#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

git pull

if [ -f "$PROJECT_DIR/deploy/docker-compose.yml" ]; then
  docker compose -f "$PROJECT_DIR/deploy/docker-compose.yml" build
  docker compose -f "$PROJECT_DIR/deploy/docker-compose.yml" up -d
else
  (cd "$PROJECT_DIR" && npm install && npm run build -ws --if-present)
fi
