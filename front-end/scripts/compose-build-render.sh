#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# define our two modes as constants for clarity
PREPARE_MODE="prepare"
REBUILD_MODE="rebuild"

MODE="${1:-$PREPARE_MODE}"
if [[ "$MODE" != "$PREPARE_MODE" && "$MODE" != "$REBUILD_MODE" ]]; then
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

# get user:group of host frontend to maintain ownership of mounted volumes
HOST_UID=$(stat -c "%u" "$FRONTEND_DIR" 2>/dev/null || echo 0)
HOST_GID=$(stat -c "%g" "$FRONTEND_DIR" 2>/dev/null || echo 0)

restore_angular_config() {
  if [[ -n "$ANGULAR_CONFIG_BACKUP" && -f "$ANGULAR_CONFIG_BACKUP" ]]; then
    mv "$ANGULAR_CONFIG_BACKUP" "$ANGULAR_CONFIG_PATH"
  fi
}

cleanup() {
  restore_angular_config
  if [[ "$HOST_UID" != "0" ]]; then
    # chown dist and node_modules to host user just in case we did a fresh install
    chown -R $HOST_UID:$HOST_GID "$FRONTEND_DIR/dist" "$FRONTEND_DIR/node_modules" 2>/dev/null || true
  fi
}

trap cleanup EXIT

mkdir -p "$FRONTEND_DIR/.tmp"
if [[ "$HOST_UID" != "0" ]]; then
  # immediately chown .tmp to host user
  chown -R $HOST_UID:$HOST_GID "$FRONTEND_DIR/.tmp" 2>/dev/null || true
fi

if [[ "$MODE" == "$PREPARE_MODE" ]]; then
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

  perl -0pi -e 's|("with":\s*"src/environments/environment\.local\.ts"\s*\n\s*}\s*\n\s*],\s*\n)(\s*"optimization":\s*true)|$1                            "outputHashing": "all",\n$2|s' "$ANGULAR_CONFIG_PATH"

  if cmp -s "$ANGULAR_CONFIG_PATH" "$ANGULAR_CONFIG_BACKUP"; then
    echo "LIKE_PROD=1 was set, but local angular.json settings were not updated." >&2
    exit 1
  fi
fi

cd "$FRONTEND_DIR"
BUILD_LOG_PATH="$(mktemp "$FRONTEND_DIR/.tmp/build.output.XXXXXX.log")"

if [[ "$MODE" == "$PREPARE_MODE" ]]; then
  echo "Building frontend using npm run $BUILD_SCRIPT ..."

  if npm run "$BUILD_SCRIPT" 2>&1 | tee "$BUILD_LOG_PATH"; then
    :
  else
    echo "Initial build failed. Running npm ci and then retrying build..."
    npm ci
    npm run "$BUILD_SCRIPT"
  fi
else
  echo "Change detected. Rebuilding..."
  npm run "$BUILD_SCRIPT"
fi

if npm run "$BUILD_SCRIPT" 2>&1 | tee "$BUILD_LOG_PATH"; then
  :
else
  echo "Initial build failed. Running npm ci and then retrying build..."
  npm ci
  npm run "$BUILD_SCRIPT"
fi

if [[ ! -f "$FRONTEND_DIR/dist/fecfile-web/index.html" ]]; then
  echo "Build output not found at $FRONTEND_DIR/dist/fecfile-web" >&2
  exit 1
fi

WATCH_FOR_RENDER="$WATCH"
if [[ "$MODE" == "$REBUILD_MODE" ]]; then
  WATCH_FOR_RENDER="1"
fi

PORT="$PORT" \
WATCH="$WATCH_FOR_RENDER" \
API_URL="$API_URL" \
APP_URL="$APP_URL" \
NGINX_CONF_PATH="$NGINX_CONF_PATH" \
"$SCRIPT_DIR/render-nginx-local-config.sh"

chmod -R a+w "$FRONTEND_DIR/.tmp"

if [[ "$MODE" == "$REBUILD_MODE" ]]; then
  echo "Rebuild complete."
  date +%s%N > "$RELOAD_TRIGGER_FILE"
fi