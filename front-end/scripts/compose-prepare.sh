#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

BUILD_SCRIPT="${BUILD_SCRIPT:-build-local}"
PUBLIC_PORT="${PUBLIC_PORT:-4200}"
NGINX_PORT="${NGINX_PORT:-4210}"
API_URL="${API_URL:-http://localhost:8080}"
APP_URL="${APP_URL:-http://localhost:${PUBLIC_PORT}}"
NGINX_CONF_PATH="${NGINX_CONF_PATH:-$FRONTEND_DIR/.tmp/nginx.local.generated.conf}"

mkdir -p "$FRONTEND_DIR/.tmp"

echo "Building frontend using npm run $BUILD_SCRIPT ..."
cd "$FRONTEND_DIR"
npm run "$BUILD_SCRIPT"

if [[ ! -f "$FRONTEND_DIR/dist/fecfile-web/index.html" ]]; then
  echo "Build output not found at $FRONTEND_DIR/dist/fecfile-web" >&2
  exit 1
fi

PUBLIC_PORT="$PUBLIC_PORT" \
NGINX_PORT="$NGINX_PORT" \
WATCH="1" \
API_URL="$API_URL" \
APP_URL="$APP_URL" \
NGINX_CONF_PATH="$NGINX_CONF_PATH" \
"$SCRIPT_DIR/render-nginx-local-config.sh"
