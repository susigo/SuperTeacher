#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cp -n "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env" || true

if command -v node >/dev/null 2>&1; then
  echo "[superteacher] installing dependencies in workspace"
  (cd "$PROJECT_DIR" && npm install)
else
  echo "[superteacher] Node/npm missing. Install Node.js 20+ then rerun."
  exit 1
fi

mkdir -p "$PROJECT_DIR/storage/published" "$PROJECT_DIR/storage/assets"
