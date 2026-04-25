#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

BUILD_SCRIPT="${BUILD_SCRIPT:-build-local}"
PORT="${PORT:-4200}"
API_URL="${API_URL:-http://localhost:8080}"
APP_URL="${APP_URL:-http://localhost:${PORT}}"
NGINX_CONF_PATH="${NGINX_CONF_PATH:-$FRONTEND_DIR/.tmp/nginx.local.generated.conf}"
RELOAD_TRIGGER_FILE="${RELOAD_TRIGGER_FILE:-$FRONTEND_DIR/.tmp/browser-sync.reload}"

mkdir -p "$FRONTEND_DIR/.tmp"
: > "$RELOAD_TRIGGER_FILE"

echo "Building frontend using npm run $BUILD_SCRIPT ..."
cd "$FRONTEND_DIR"
npm run "$BUILD_SCRIPT"

if [[ ! -f "$FRONTEND_DIR/dist/fecfile-web/index.html" ]]; then
  echo "Build output not found at $FRONTEND_DIR/dist/fecfile-web" >&2
  exit 1
fi

PORT="$PORT" \
WATCH="1" \
API_URL="$API_URL" \
APP_URL="$APP_URL" \
NGINX_CONF_PATH="$NGINX_CONF_PATH" \
"$SCRIPT_DIR/render-nginx-local-config.sh"
