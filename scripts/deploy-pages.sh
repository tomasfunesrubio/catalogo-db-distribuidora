#!/usr/bin/env bash
# Publica el sitio en GitHub Pages: compila la versión estática y la sube a la rama gh-pages.
# Uso: pnpm deploy:pages
set -euo pipefail

cd "$(dirname "$0")/.."

GITHUB_PAGES=true npx next build

# Sin esto GitHub Pages (Jekyll) ignora la carpeta _next
touch out/.nojekyll

REMOTE_URL=$(git remote get-url origin)
TMP_DIR=$(mktemp -d)
cp -R out/. "$TMP_DIR"

cd "$TMP_DIR"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(date '+%Y-%m-%d %H:%M')"
git push -q -f "$REMOTE_URL" gh-pages
rm -rf "$TMP_DIR"

echo "Publicado. Puede tardar 1-2 minutos en actualizarse."
