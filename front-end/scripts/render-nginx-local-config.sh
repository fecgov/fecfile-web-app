#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$FRONTEND_DIR/.." && pwd)"

TEMPLATE_PATH="${TEMPLATE_PATH:-$REPO_ROOT/deploy-config/front-end-nginx-config/nginx.conf}"
NGINX_CONF_PATH="${NGINX_CONF_PATH:-${TMPDIR:-/tmp}/fecfile-nginx-local.conf}"
PUBLIC_PORT="${PUBLIC_PORT:-4200}"
NGINX_PORT="${NGINX_PORT:-$PUBLIC_PORT}"
WATCH="${WATCH:-0}"
API_URL="${API_URL:-http://localhost:8080}"
APP_URL="${APP_URL:-http://localhost:$PUBLIC_PORT}"

if [[ ! -f "$TEMPLATE_PATH" ]]; then
  echo "Nginx template not found at $TEMPLATE_PATH" >&2
  exit 1
fi

if [[ "$API_URL" =~ ^https?://[^/]+ ]]; then
  CSP_API_ORIGIN="${BASH_REMATCH[0]}"
else
  echo "API_URL must start with http:// or https://" >&2
  exit 1
fi

echo "Rendering Nginx config to $NGINX_CONF_PATH ..."
sed \
  -e "/^daemon off;/d" \
  -e "s|{{port}}|$NGINX_PORT|g" \
  -e "s|{{env \"FECFILE_APP_URL\"}}|$APP_URL|g" \
  -e "s|{{env \"FECFILE_API_URL\"}}|$CSP_API_ORIGIN|g" \
  -e "s|root fecfile-web;|root /usr/share/nginx/html/fecfile-web;|g" \
  "$TEMPLATE_PATH" > "$NGINX_CONF_PATH"

if [[ "$WATCH" == "1" ]]; then
  script_src_replacement="script-src 'self' 'nonce-\$nonce' http://localhost:$PUBLIC_PORT 'unsafe-inline';"
  connect_src_replacement="connect-src 'self' $CSP_API_ORIGIN http://localhost:$PUBLIC_PORT ws://localhost:$PUBLIC_PORT;"
  browser_sync_script='sub_filter '\''</body>'\'' '\''<script nonce="$nonce" async src="http://localhost:'"$PUBLIC_PORT"'/browser-sync/browser-sync-client.js"></script></body>'\'';'

  sed -i \
    -e "s|script-src 'self' 'nonce-\\\$nonce';|$script_src_replacement|" \
    -e "s|connect-src 'self' $CSP_API_ORIGIN;|$connect_src_replacement|" \
    "$NGINX_CONF_PATH"

  sed -i "/sub_filter web_app_nonce \\\$nonce;/a\\
      $browser_sync_script" "$NGINX_CONF_PATH"
fi
