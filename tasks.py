import git
import json
import os
import sys

from shutil import copyfile
from invoke import task


APP_NAME = "fecfile-web-app"
ORG_NAME = "fec-fecfile"


def _detect_space(repo, branch=None):
    """Detect space from active git branch.
    :param str branch: Optional branch name override
    :returns: Space name if space is detected and confirmed, else `None`
    """
    space = _resolve_rule(repo, branch)
    if space is None:
        print(
            "The current configuration does not require a deployment to cloud.gov.   "
        )
        return None
    print("Detected space {space}".format(**locals()))
    return space


def _resolve_rule(repo, branch):
    """Get space associated with first matching rule."""
    for space, rule in DEPLOY_RULES:
        if rule(repo, branch):
            print(f"Deploying to {space} due to matching branch name {branch}")
            return space
    print(f"Current branch {branch} does not match any deployment specifications.")
    print(f"Skipping deployment.")
    return None


def _detect_branch(repo):
    try:
        return repo.active_branch.name
    except TypeError:
        return None


DEPLOY_RULES = (
    ("test", lambda _, branch: branch == "main"),
    ("stage", lambda _, branch: branch.startswith("release")),
    ("dev", lambda _, branch: branch == "feature/1972"),
)


# new commit to trigger build
def _build_angular_app(ctx, space):
    orig_directory = os.getcwd()
    os.chdir(os.path.join(orig_directory, "front-end"))

    print(f"Starting build: npm run build-{space}")
    result = ctx.run(f"npm run build-{space}", warn=True, echo=True)

    if result.return_code != 0:
        print(f"error building Angular app.  Exiting with code {result.return_code}")
        exit(result.return_code)

    os.chdir(orig_directory)


# copies a few nginx config files into the Angualr app distribution directory
def _prep_distribution_directory(ctx):
    dist_directory = os.path.join(os.getcwd(), "front-end", "dist")
    nginx_config_dir = os.path.join(
        os.getcwd(), "deploy-config", "front-end-nginx-config"
    )

    copyfile(
        os.path.join(nginx_config_dir, "nginx.conf"),
        os.path.join(dist_directory, "nginx.conf"),
    )
    copyfile(
        os.path.join(nginx_config_dir, "mime.types"),
        os.path.join(dist_directory, "mime.types"),
    )


def _login_to_cf(ctx, space):
    # Set api
    api = "https://api.fr.cloud.gov"
    ctx.run(f"cf api {api}", echo=True)

    # Authenticate
    user_var_name = f"FEC_CF_USERNAME_{space.upper()}"
    pass_var_name = f"FEC_CF_PASSWORD_{space.upper()}"
    login_command = f'cf auth "${user_var_name}" "${pass_var_name}"'
    result = ctx.run(login_command, echo=True, warn=True)
    if result.return_code != 0:
        print("\n\nError logging into cloud.gov.")
        if os.getenv(user_var_name) and os.getenv(pass_var_name):
            print("Please check your authentication environment variables:")
            print(f"    - {user_var_name}")
            print(f"    - {pass_var_name}")
        else:
            print(f"You must set the {user_var_name} and {pass_var_name} environment ")
            print(f"variables with space-deployer service account credentials")
            print(f"")
            print(
                f"If you don't have a service account, you can create one with the following commands:"
            )
            print(
                f"   cf login -u [email-address] -o {ORG_NAME} -a api.fr.cloud.gov --sso"
            )
            print(f"   cf target -o {ORG_NAME} -s {space}")
            print(
                f"   cf create-service cloud-gov-service-account space-deployer [my-service-account-name]"
            )
            print(
                f"   cf create-service-key  [my-server-account-name] [my-service-key-name]"
            )
            print(f"   cf service-key  [my-server-account-name] [my-service-key-name]")

        exit(1)


def _do_deploy(ctx, space):
    orig_directory = os.getcwd()
    os.chdir(os.path.join(orig_directory, "front-end", "dist"))
    print(f"new dir {os.getcwd()}")

    manifest_filename = os.path.join(
        orig_directory, "deploy-config", f"{APP_NAME}-{space}-manifest.yml"
    )

    existing_deploy = ctx.run("cf app {0}".format(APP_NAME), echo=True, warn=True)
    print("\n")
    cmd = "push --strategy rolling" if existing_deploy.ok else "push"
    new_deploy = ctx.run(
        f"cf {cmd} {APP_NAME} -f {manifest_filename}",
        echo=True,
        warn=True,
    )

    os.chdir(orig_directory)
    return new_deploy


def _print_help_text():
    help_text = """
    Usage:
    invoke deploy [--space SPACE] [--branch BRANCH] [--login LOGIN] [--help] [--nobuild]
    
    --space SPACE    If provided, the SPACE space in cloud.gov will be targeted for deployment.
                     Either --space or --branch must be provided
                     Allowed values are dev, stage, test, and prod.
                     
                     
    --branch BRANCH  Name of the branch to use for deployment. Will auto-detect
                     the git branch in the current directory by default
                     Either --space or --branch must be provided
                     
    --login          If this flag is set, deploy with attempt to login to a 
                     service account specified in the environemnt variables
                     $FEC_CF_USERNAME_[SPACE] and $FEC_CF_PASSWORD_[SPACE]
                     
    --help           If set, display help/usage text and exit
    
    --nobuild        If set, skip the Angular applicaiton build process. Useful
                     for debugging, but should not be used in most cases.
                    
    """
    print(help_text)


def _rollback(ctx):
    print("Build failed!")
    # Check if there are active deployments
    app_guid = ctx.run("cf app {} --guid".format(APP_NAME), hide=True, warn=True)
    app_guid_formatted = app_guid.stdout.strip()
    status = ctx.run(
        'cf curl "/v3/deployments?app_guids={}&status_values=ACTIVE"'.format(
            app_guid_formatted
        ),
        hide=True,
        warn=True,
    )
    active_deployments = (
        json.loads(status.stdout).get("pagination").get("total_results")
    )
    # Try to roll back
    if active_deployments > 0:
        print("Attempting to roll back any deployment in progress...")
        # Show the in-between state
        ctx.run("cf app {}".format(APP_NAME), echo=True, warn=True)
        cancel_deploy = ctx.run(
            "cf cancel-deployment {}".format(APP_NAME), echo=True, warn=True
        )
        if cancel_deploy.ok:
            print("Successfully cancelled deploy. Check logs.")
        else:
            print("Unable to cancel deploy. Check logs.")


@task
def deploy(ctx, space=None, branch=None, login=False, help=False, nobuild=False):
    """Deploy app to Cloud Foundry.
    Log in using credentials stored per environment
    like `FEC_CF_USERNAME_DEV` and `FEC_CF_PASSWORD_DEV`;
    Push to either `space` or the space detected from the name and tags
    of the current branch.
    Note: Must pass `space` or `branch` if repo is in detached HEAD mode,
    e.g. when running on Circle.

    Example usage: invoke deploy --space dev
    """

    if help:
        _print_help_text()
        exit(0)

    # Detect space
    repo = git.Repo(".")
    branch = branch or _detect_branch(repo)
    space = space or _detect_space(repo, branch)
    if space is None:
        # this is not an error condition, it just means the current space/branch is not
        # a candidate for deployment. Return successful exit code
        return sys.exit(0)

    if login:
        _login_to_cf(ctx, space)

    if not nobuild:
        _build_angular_app(ctx, space)

    _prep_distribution_directory(ctx)

    # Target space
    ctx.run("cf target -o {0} -s {1}".format(ORG_NAME, space), echo=True)

    # Set deploy variables
    with open(".cfmeta", "w") as fp:
        json.dump({"user": os.getenv("USER"), "branch": branch}, fp)

    new_deploy = _do_deploy(ctx, space)

    if not new_deploy.ok:
        _rollback(ctx)
        return sys.exit(1)

    ctx.run("cf apps", echo=True, warn=True)
    print(
        f"A new version of your application '{APP_NAME}' has been successfully pushed!"
    )

    # Needed for CircleCI
    return sys.exit(0)
