#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$FRONTEND_DIR/.." && pwd)"

TEMPLATE_PATH="${TEMPLATE_PATH:-$REPO_ROOT/deploy-config/front-end-nginx-config/nginx.conf}"
NGINX_CONF_PATH="${NGINX_CONF_PATH:-${TMPDIR:-/tmp}/fecfile-nginx-local.conf}"
PORT="${PORT:-4200}"
WATCH="${WATCH:-0}"
API_URL="${API_URL:-http://localhost:8080}"
APP_URL="${APP_URL:-http://localhost:$PORT}"

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
  -e "s|{{port}}|$PORT|g" \
  -e "s|{{env \"FECFILE_APP_URL\"}}|$APP_URL|g" \
  -e "s|{{env \"FECFILE_API_URL\"}}|$CSP_API_ORIGIN|g" \
  -e "s|root fecfile-web;|root /usr/share/nginx/html/fecfile-web;|g" \
  "$TEMPLATE_PATH" > "$NGINX_CONF_PATH"

if [[ "$WATCH" == "1" ]]; then
  connect_src_replacement="connect-src 'self' $CSP_API_ORIGIN http://localhost:3001 ws://localhost:3001;"
  browser_sync_script='sub_filter '\''</body>'\'' '\''<script nonce="$nonce" async src="http://localhost:'"$PORT"'/browser-sync/browser-sync-client.js"></script></body>'\'';'
  browser_sync_script=${browser_sync_script/http:\/\/localhost:${PORT}\/browser-sync\/browser-sync-client.js/\/browser-sync\/browser-sync-client.js}
  browser_sync_proxy_location='location /browser-sync/ { proxy_pass http://browser-sync:3000/browser-sync/; proxy_http_version 1.1; proxy_set_header Host $host; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; proxy_intercept_errors on; error_page 502 503 504 =204 /browser-sync-empty; }'
  browser_sync_empty_location='location = /browser-sync-empty { access_log off; return 204; }'

  sed -i \
    -e "s|connect-src 'self' $CSP_API_ORIGIN;|$connect_src_replacement|" \
    "$NGINX_CONF_PATH"

  sed -i "/sub_filter web_app_nonce \\\$nonce;/a\\
      $browser_sync_script" "$NGINX_CONF_PATH"

    sed -i "/location = \/frontend-error-report-proxied {/i\\
    $browser_sync_proxy_location\\
\\
    $browser_sync_empty_location\\
" "$NGINX_CONF_PATH"
fi
