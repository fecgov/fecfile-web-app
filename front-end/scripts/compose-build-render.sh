#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

MODE="${1:-prepare}"
if [[ "$MODE" != "prepare" && "$MODE" != "rebuild" ]]; then
  echo "Usage: $0 <prepare|rebuild>" >&2
  exit 2
fi

BUILD_SCRIPT="${BUILD_SCRIPT:-build-local}"
PORT="${PORT:-4200}"
WATCH="${WATCH:-0}"
LIKE_PROD="${LIKE_PROD:-0}"
API_URL="${API_URL:-http://localhost:8080}"
APP_URL="${APP_URL:-http://localhost:${PORT}}"
NGINX_CONF_PATH="${NGINX_CONF_PATH:-$FRONTEND_DIR/.tmp/nginx.local.generated.conf}"
RELOAD_TRIGGER_FILE="${RELOAD_TRIGGER_FILE:-$FRONTEND_DIR/.tmp/browser-sync.reload}"
ANGULAR_CONFIG_PATH="${ANGULAR_CONFIG_PATH:-$FRONTEND_DIR/angular.json}"
ANGULAR_CONFIG_BACKUP=""

restore_angular_config() {
  if [[ -n "$ANGULAR_CONFIG_BACKUP" && -f "$ANGULAR_CONFIG_BACKUP" ]]; then
    mv "$ANGULAR_CONFIG_BACKUP" "$ANGULAR_CONFIG_PATH"
  fi
}

mkdir -p "$FRONTEND_DIR/.tmp"
trap restore_angular_config EXIT

if [[ "$MODE" == "prepare" ]]; then
  : > "$RELOAD_TRIGGER_FILE"
fi

if [[ "$LIKE_PROD" == "1" ]]; then
  echo "LIKE_PROD=1 is set. Modifying angular.json for production-like settings..."
  if [[ ! -f "$ANGULAR_CONFIG_PATH" ]]; then
    echo "Angular config not found at $ANGULAR_CONFIG_PATH" >&2
    exit 1
  fi

  ANGULAR_CONFIG_BACKUP="$(mktemp "$FRONTEND_DIR/.tmp/angular.json.backup.XXXXXX")"
  cp -p "$ANGULAR_CONFIG_PATH" "$ANGULAR_CONFIG_BACKUP"

  perl -0pi -e 's|("with":\s*"src/environments/environment\.local\.ts"\s*\n\s*}\s*\n\s*],\s*\n)\s*"optimization":\s*true,\s*\n\s*"extractLicenses":\s*false,\s*\n\s*"sourceMap":\s*true,\s*\n\s*"namedChunks":\s*true|$1                            "outputHashing": "all",\n                            "optimization": true|s' "$ANGULAR_CONFIG_PATH"

  if cmp -s "$ANGULAR_CONFIG_PATH" "$ANGULAR_CONFIG_BACKUP"; then
    echo "LIKE_PROD=1 was set, but local angular.json settings were not updated." >&2
    exit 1
  fi
fi

if [[ "$MODE" == "prepare" ]]; then
  echo "Building frontend using npm run $BUILD_SCRIPT ..."
else
  echo "Change detected. Rebuilding..."
fi

cd "$FRONTEND_DIR"
npm run "$BUILD_SCRIPT"

if [[ ! -f "$FRONTEND_DIR/dist/fecfile-web/index.html" ]]; then
  echo "Build output not found at $FRONTEND_DIR/dist/fecfile-web" >&2
  exit 1
fi

WATCH_FOR_RENDER="$WATCH"
if [[ "$MODE" == "rebuild" ]]; then
  WATCH_FOR_RENDER="1"
fi

PORT="$PORT" \
WATCH="$WATCH_FOR_RENDER" \
API_URL="$API_URL" \
APP_URL="$APP_URL" \
NGINX_CONF_PATH="$NGINX_CONF_PATH" \
"$SCRIPT_DIR/render-nginx-local-config.sh"

chmod -R a+w "$FRONTEND_DIR/.tmp"

if [[ "$MODE" == "rebuild" ]]; then
  echo "Rebuild complete."
  date +%s%N > "$RELOAD_TRIGGER_FILE"
fi