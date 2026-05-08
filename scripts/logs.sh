#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ -f "$PROJECT_DIR/deploy/docker-compose.yml" ]; then
  docker compose -f "$PROJECT_DIR/deploy/docker-compose.yml" logs -f --tail=200
else
  echo "No docker-compose.yml"
fi
