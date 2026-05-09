#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ -f "$PROJECT_DIR/.env" ]; then
  set -a
  source "$PROJECT_DIR/.env"
  set +a
fi

if command -v docker >/dev/null 2>&1 && [ -f "$PROJECT_DIR/deploy/docker-compose.yml" ]; then
  docker compose -f "$PROJECT_DIR/deploy/docker-compose.yml" up -d
else
  (cd "$PROJECT_DIR" && npm run dev -ws --if-present)
fi
