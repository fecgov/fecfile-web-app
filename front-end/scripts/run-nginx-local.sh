#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$FRONTEND_DIR/.." && pwd)"
TEMPLATE_PATH="$REPO_ROOT/deploy-config/front-end-nginx-config/nginx.conf"
TMP_CONF="${TMPDIR:-/tmp}/fecfile-nginx-local.conf"

cleanup() {
  rm -f "$TMP_CONF"
}

trap cleanup EXIT

PORT="4200"
TARGET_ENV="local"
API_URL="http://localhost:8080"
APP_URL=""
DJANGO_SECRET_KEY="${DJANGO_SECRET_KEY:-If_using_test_db_use_secret_key_in_cloud.gov}"
FEC_API="${FEC_API:-https://api.open.fec.gov/v1/}"
FEC_API_KEY="${FEC_API_KEY:-DEMO_KEY}"
CYPRESS_COMMITTEE_ID="${CYPRESS_COMMITTEE_ID:-C99999999}"
CYPRESS_PASSWORD="${CYPRESS_PASSWORD:-test}"
WATCH="0"
CONTAINER_NAME="fecfile-nginx-local"
LOGS_PID=""
BROWSER_SYNC_PID=""
PUBLIC_PORT=""
NGINX_PORT=""

usage() {
  cat <<'EOF'
Usage: ./scripts/run-nginx-local.sh [options]

Options:
  --env=<dev|stage|test|prod|local>  Angular build target (default: local)
  --port=<port>                       Browser-facing port (default: 4200)
  --api-url=<url>                     API origin or API URL for CSP connect-src (default: http://localhost:8080)
  --app-url=<url>                     Frontend URL for report endpoint (default: http://localhost:<port>)
  --watch                             Watch frontend files and rebuild on changes
  -h, --help                          Show this help text
EOF
}

for arg in "$@"; do
  case "$arg" in
    --env=*) TARGET_ENV="${arg#*=}" ;;
    --port=*) PORT="${arg#*=}" ;;
    --api-url=*) API_URL="${arg#*=}" ;;
    --app-url=*) APP_URL="${arg#*=}" ;;
    --watch) WATCH="1" ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      usage
      exit 1
      ;;
  esac
done

case "$TARGET_ENV" in
  local) BUILD_SCRIPT="build-local" ;;
  dev) BUILD_SCRIPT="build-dev" ;;
  stage) BUILD_SCRIPT="build-stage" ;;
  test) BUILD_SCRIPT="build-test" ;;
  prod) BUILD_SCRIPT="build-prod" ;;
  *)
    echo "Invalid --env value: $TARGET_ENV" >&2
    usage
    exit 1
    ;;
esac

PUBLIC_PORT="$PORT"
NGINX_PORT="$PORT"

if [[ "$WATCH" == "1" ]]; then
  NGINX_PORT="$((PORT + 10))"
fi

if [[ -z "$APP_URL" ]]; then
  APP_URL="http://localhost:$PUBLIC_PORT"
fi

if [[ "$API_URL" =~ ^https?://[^/]+ ]]; then
  CSP_API_ORIGIN="${BASH_REMATCH[0]}"
else
  echo "--api-url must start with http:// or https://" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required to run local Nginx." >&2
  exit 1
fi

if [[ ! -f "$TEMPLATE_PATH" ]]; then
  echo "Nginx template not found at $TEMPLATE_PATH" >&2
  exit 1
fi

if [[ "$WATCH" == "1" ]] && ! command -v inotifywait >/dev/null 2>&1; then
  echo "--watch requires inotifywait (install inotify-tools)." >&2
  exit 1
fi

if [[ "$WATCH" == "1" ]] && ! command -v npx >/dev/null 2>&1; then
  echo "--watch requires npx to run BrowserSync." >&2
  exit 1
fi

DIST_DIR="$FRONTEND_DIR/dist/fecfile-web"
CONTAINER_NAME="${CONTAINER_NAME}-${PORT}"

cleanup() {
  rm -f "$TMP_CONF"
  if [[ -n "$BROWSER_SYNC_PID" ]]; then
    kill "$BROWSER_SYNC_PID" >/dev/null 2>&1 || true
  fi
  if [[ -n "$LOGS_PID" ]]; then
    kill "$LOGS_PID" >/dev/null 2>&1 || true
  fi
  if [[ "$WATCH" == "1" ]]; then
    docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
  fi
}

build_frontend() {
  echo "Building frontend using npm run $BUILD_SCRIPT ..."
  cd "$FRONTEND_DIR"
  npm run "$BUILD_SCRIPT"

  if [[ ! -f "$DIST_DIR/index.html" ]]; then
    echo "Build output not found at $DIST_DIR" >&2
    exit 1
  fi
}

render_nginx_config() {
  echo "Rendering Nginx config to $TMP_CONF ..."
  sed \
    -e "/^daemon off;/d" \
    -e "s|{{port}}|$NGINX_PORT|g" \
    -e "s|{{env \"FECFILE_APP_URL\"}}|$APP_URL|g" \
    -e "s|{{env \"FECFILE_API_URL\"}}|$CSP_API_ORIGIN|g" \
    -e "s|root fecfile-web;|root /usr/share/nginx/html/fecfile-web;|g" \
    "$TEMPLATE_PATH" > "$TMP_CONF"

  if [[ "$WATCH" == "1" ]]; then
    local script_src_replacement="script-src 'self' 'nonce-\$nonce' http://localhost:$PUBLIC_PORT 'unsafe-inline';"
    local connect_src_replacement="connect-src 'self' $CSP_API_ORIGIN http://localhost:$PUBLIC_PORT ws://localhost:$PUBLIC_PORT;"
    local browser_sync_script
    browser_sync_script='sub_filter '\''</body>'\'' '\''<script nonce="$nonce" async src="http://localhost:'"$PUBLIC_PORT"'/browser-sync/browser-sync-client.js"></script></body>'\'';'

    sed -i \
      -e "s|script-src 'self' 'nonce-\\\$nonce';|$script_src_replacement|" \
      -e "s|connect-src 'self' $CSP_API_ORIGIN;|$connect_src_replacement|" \
      "$TMP_CONF"

    sed -i "/sub_filter web_app_nonce \\\$nonce;/a\\
      $browser_sync_script" "$TMP_CONF"
  fi
}

start_browser_sync() {
  echo "Starting BrowserSync on http://localhost:$PUBLIC_PORT ..."
  NODE_OPTIONS="--insecure-http-parser" npx -y browser-sync start \
    --proxy "http://127.0.0.1:$NGINX_PORT" \
    --port "$PUBLIC_PORT" \
    --no-open \
    --no-ui \
    --no-snippet >/dev/null 2>&1 &
  BROWSER_SYNC_PID="$!"
}

trigger_browser_reload() {
  # Reload only after a successful rebuild to avoid serving stale chunks.
  npx -y browser-sync reload --port "$PUBLIC_PORT" >/dev/null 2>&1 || \
    echo "Warning: BrowserSync reload trigger failed." >&2
}

start_nginx() {
  local mode="$1"

  echo "Starting Nginx in $mode mode on http://localhost:$NGINX_PORT ..."
  if [[ "$mode" == "watch" ]]; then
    docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
    local docker_opt="-d"
  else
    echo "Press Ctrl+C to stop."
    local docker_opt=""
  fi

  docker run $docker_opt --rm --name "$CONTAINER_NAME" \
    -p "$NGINX_PORT:$NGINX_PORT" \
    -e "DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY" \
    -e "FEC_API=$FEC_API" \
    -e "FEC_API_KEY=$FEC_API_KEY" \
    -e "CYPRESS_COMMITTEE_ID=$CYPRESS_COMMITTEE_ID" \
    -e "CYPRESS_PASSWORD=$CYPRESS_PASSWORD" \
    -v "$DIST_DIR:/usr/share/nginx/html/fecfile-web:ro" \
    -v "$TMP_CONF:/etc/nginx/nginx.conf:ro" \
    nginx:alpine >/dev/null

  if [[ "$mode" == "watch" ]]; then
    start_browser_sync
    docker logs -f "$CONTAINER_NAME" &
    LOGS_PID="$!"

    echo "Watching for changes under $FRONTEND_DIR/src ..."
    echo "Open http://localhost:$PUBLIC_PORT and press Ctrl+C to stop."
    while inotifywait -r -e modify,create,delete,move \
      --exclude '(^|/)(dist|node_modules|\.git)(/|$)' \
      "$FRONTEND_DIR/src" "$FRONTEND_DIR/angular.json" "$FRONTEND_DIR/tsconfig.app.json" "$FRONTEND_DIR/tsconfig.json" >/dev/null 2>&1; do
      echo "Change detected. Rebuilding..."
      if build_frontend; then
        echo "Rebuild complete."
        trigger_browser_reload
      else
        echo "Rebuild failed. Nginx is still serving the last successful build." >&2
      fi
    done
  fi
}

build_frontend
render_nginx_config

if [[ "$WATCH" == "1" ]]; then
  start_nginx watch
else
  start_nginx foreground
fi