#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

set -a
source "$PROJECT_DIR/.env" 2>/dev/null || true
set +a

BACKEND_URL="${APP_URL:-http://localhost:3001}/api/health"
FRONTEND_URL="${APP_URL:-http://localhost:4173}"

echo "check backend: $BACKEND_URL"
curl -fsS "$BACKEND_URL" && echo " [ok]" || echo " [fail]"
echo "check frontend: $FRONTEND_URL"
curl -fsS "$FRONTEND_URL" >/dev/null && echo " [ok]" || echo " [fail]"
