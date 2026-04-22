#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WWW_DIR="$ROOT_DIR/www"
DOCS_DIR="$ROOT_DIR/docs"

if ! command -v wasm-pack >/dev/null 2>&1; then
  echo "error: wasm-pack is required but not found in PATH." >&2
  exit 1
fi

echo "==> Building WebAssembly package into www/pkg"
(
  cd "$ROOT_DIR"
  wasm-pack build --target web --out-dir "$WWW_DIR/pkg" --out-name capybara_tty
)

echo "==> Syncing www/ -> docs/ for GitHub Pages"
rsync -a --delete \
  --exclude ".DS_Store" \
  "$WWW_DIR/" "$DOCS_DIR/"

echo "==> Done. Review changes with: git status --short"
