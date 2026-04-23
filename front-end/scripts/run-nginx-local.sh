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

usage() {
  cat <<'EOF'
Usage: npm run start:nginx-local -- [options]

Options:
  --env=<dev|stage|test|prod|local>  Angular build target (default: local)
  --port=<port>                       Nginx listen port (default: 4200)
  --api-url=<url>                     API origin or API URL for CSP connect-src (default: http://localhost:8080)
  --app-url=<url>                     Frontend URL for report endpoint (default: http://localhost:<port>)
  -h, --help                          Show this help text
EOF
}

for arg in "$@"; do
  case "$arg" in
    --env=*) TARGET_ENV="${arg#*=}" ;;
    --port=*) PORT="${arg#*=}" ;;
    --api-url=*) API_URL="${arg#*=}" ;;
    --app-url=*) APP_URL="${arg#*=}" ;;
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

echo "Building frontend using npm run $BUILD_SCRIPT ..."
cd "$FRONTEND_DIR"
npm run "$BUILD_SCRIPT"

DIST_DIR="$FRONTEND_DIR/dist/fecfile-web"
if [[ ! -f "$DIST_DIR/index.html" ]]; then
  echo "Build output not found at $DIST_DIR" >&2
  exit 1
fi

echo "Rendering Nginx config to $TMP_CONF ..."
sed \
  -e "/^daemon off;/d" \
  -e "s|{{port}}|$PORT|g" \
  -e "s|{{env \"FECFILE_APP_URL\"}}|$APP_URL|g" \
  -e "s|{{env \"FECFILE_API_URL\"}}|$CSP_API_ORIGIN|g" \
  -e "s|root fecfile-web;|root /usr/share/nginx/html/fecfile-web;|g" \
  "$TEMPLATE_PATH" > "$TMP_CONF"

echo "Starting Nginx on http://localhost:$PORT ..."
echo "Press Ctrl+C to stop."
docker run --rm \
  -p "$PORT:$PORT" \
  -e "DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY" \
  -e "FEC_API=$FEC_API" \
  -e "FEC_API_KEY=$FEC_API_KEY" \
  -e "CYPRESS_COMMITTEE_ID=$CYPRESS_COMMITTEE_ID" \
  -e "CYPRESS_PASSWORD=$CYPRESS_PASSWORD" \
  -v "$DIST_DIR:/usr/share/nginx/html/fecfile-web:ro" \
  -v "$TMP_CONF:/etc/nginx/nginx.conf:ro" \
  nginx:alpine