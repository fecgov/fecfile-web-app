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

usage() {
  cat <<'EOF'
Usage: ./scripts/run-nginx-local.sh [options]

Options:
  --env=<dev|stage|test|prod|local>  Angular build target (default: local)
  --port=<port>                       Nginx listen port (default: 4200)
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

if [[ -z "$APP_URL" ]]; then
  APP_URL="http://localhost:$PORT"
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

DIST_DIR="$FRONTEND_DIR/dist/fecfile-web"
CONTAINER_NAME="${CONTAINER_NAME}-${PORT}"

cleanup() {
  rm -f "$TMP_CONF"
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
    -e "s|{{port}}|$PORT|g" \
    -e "s|{{env \"FECFILE_APP_URL\"}}|$APP_URL|g" \
    -e "s|{{env \"FECFILE_API_URL\"}}|$CSP_API_ORIGIN|g" \
    -e "s|root fecfile-web;|root /usr/share/nginx/html/fecfile-web;|g" \
    "$TEMPLATE_PATH" > "$TMP_CONF"
}

start_nginx() {
  local mode="$1"

  echo "Starting Nginx in $mode mode on http://localhost:$PORT ..."
  if [[ "$mode" == "watch" ]]; then
    docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
    local docker_opt="-d"
  else
    echo "Press Ctrl+C to stop."
    local docker_opt=""
  fi

  docker run $docker_opt --rm --name "$CONTAINER_NAME" \
    -p "$PORT:$PORT" \
    -e "DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY" \
    -e "FEC_API=$FEC_API" \
    -e "FEC_API_KEY=$FEC_API_KEY" \
    -e "CYPRESS_COMMITTEE_ID=$CYPRESS_COMMITTEE_ID" \
    -e "CYPRESS_PASSWORD=$CYPRESS_PASSWORD" \
    -v "$DIST_DIR:/usr/share/nginx/html/fecfile-web:ro" \
    -v "$TMP_CONF:/etc/nginx/nginx.conf:ro" \
    nginx:alpine >/dev/null

  if [[ "$mode" == "watch" ]]; then
    docker logs -f "$CONTAINER_NAME" &
    LOGS_PID="$!"

    echo "Watching for changes under $FRONTEND_DIR/src ..."
    echo "Press Ctrl+C to stop."
    while inotifywait -r -e modify,create,delete,move \
      --exclude '(^|/)(dist|node_modules|\.git)(/|$)' \
      "$FRONTEND_DIR/src" "$FRONTEND_DIR/angular.json" "$FRONTEND_DIR/tsconfig.app.json" "$FRONTEND_DIR/tsconfig.json" >/dev/null 2>&1; do
      echo "Change detected. Rebuilding..."
      if build_frontend; then
        echo "Rebuild complete."
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