#!/usr/bin/env python3
import json
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.request
import urllib.error

API_BASE = "https://circleci.com/api/v2"

def eprint(*args):
    print(*args, file=sys.stderr)

def require_env(name: str) -> str:
    v = os.getenv(name)
    if not v:
        raise RuntimeError(f"Missing required env var: {name}")
    return v

def run(cmd):
    p = subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if p.returncode != 0:
        eprint("Command failed:", " ".join(cmd))
        eprint(p.stderr.strip())
        raise RuntimeError("Command failed")
    return p.stdout

def latest_sprint_branch(remote="origin") -> str:
    # Only supports integer sprint numbers: release/sprint-78 (NOT 78.1)
    out = run(["git", "ls-remote", "--heads", remote, "release/sprint-*"])
    found = []
    for line in out.splitlines():
        m = re.search(r"refs/heads/(release/sprint-(\d+))$", line.strip())
        if m:
            found.append((int(m.group(2)), m.group(1)))

    if not found:
        raise RuntimeError("No branches matched release/sprint-<integer>")

    found.sort(key=lambda t: t[0])
    latest = found[-1][1]
    print("Detected sprint branches:", ", ".join([b for _, b in found]))
    print("Latest sprint branch:", latest)
    return latest

def circleci_request(token, method, url, payload=None):
    headers = {
        "Circle-Token": token,
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, method=method, headers=headers, data=data)
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8").strip()
            return {} if not body else json.loads(body)
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        eprint(f"CircleCI API error {e.code} on {method} {url}")
        eprint(err)
        raise

def list_schedules(token, project_slug):
    schedules = []
    page_token = None
    enc_slug = urllib.parse.quote(project_slug, safe="")
    while True:
        url = f"{API_BASE}/project/{enc_slug}/schedule"
        if page_token:
            url += f"?page-token={urllib.parse.quote(page_token, safe='')}"
        resp = circleci_request(token, "GET", url)
        schedules.extend(resp.get("items", []))
        page_token = resp.get("next_page_token")
        if not page_token:
            break
    return schedules

def patch_schedule_branch(token, schedule_id, params, branch):
    new_params = dict(params or {})
    new_params["branch"] = branch

    # Ensure nightly param is present (defensive)
    if "is-triggered-full-nightly" not in new_params:
        new_params["is-triggered-full-nightly"] = True

    url = f"{API_BASE}/schedule/{schedule_id}"
    circleci_request(token, "PATCH", url, payload={"parameters": new_params})
    print(f"Updated schedule {schedule_id} → branch={branch}")

def main():
    token = os.getenv("CIRCLE_TOKEN") or os.getenv("CIRCLECI_TOKEN")
    if not token:
        raise RuntimeError("Missing CIRCLE_TOKEN (or CIRCLECI_TOKEN)")

    project_slug = require_env("CIRCLECI_PROJECT_SLUG")
    schedule_name = os.getenv("CIRCLECI_SPRINT_SCHEDULE_NAME", "nightly-latest-sprint")

    latest = latest_sprint_branch()

    schedules = list_schedules(token, project_slug)
    matches = [s for s in schedules if s.get("name") == schedule_name]

    if not matches:
        raise RuntimeError(f"Schedule '{schedule_name}' not found. Create it once in the CircleCI UI.")
    if len(matches) > 1:
        raise RuntimeError(f"Multiple schedules named '{schedule_name}'. Make schedule names unique.")

    sched = matches[0]
    sched_id = sched.get("id")
    params = sched.get("parameters") or {}
    current = params.get("branch")

    print(f"Schedule '{schedule_name}' currently targets:", current)
    if current == latest:
        print("Already up to date. No changes.")
        return 0

    patch_schedule_branch(token, sched_id, params, latest)
    return 0

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as ex:
        eprint("Updater failed:", ex)
        raise SystemExit(1)
