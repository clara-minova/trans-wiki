#!/usr/bin/env bash
# Local preview of the wiki, built the same way as the GitHub Pages workflow.
#
# Usage:  ./preview.sh        then open http://localhost:8080
# Stop:   Ctrl+C
#
# Needs Node.js 22+ and git. Quartz is downloaded into .quartz-build/
# (ignored by git) on the first run; later runs reuse it.
#
# Notes in the content folder are watched: save in Obsidian and the page reloads.
# Changes to files in .quartz/ (config, layout, styles, components) need a
# restart: Ctrl+C, then ./preview.sh again.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
CONTENT="$ROOT/Trans Wiki Spain/Trans guide in Spain"
BUILD="$ROOT/.quartz-build"

# Use the same Quartz version as the deploy workflow
QUARTZ_VERSION="$(awk '/^[[:space:]]*QUARTZ_VERSION:/ {print $2; exit}' "$ROOT/.github/workflows/deploy.yml" 2>/dev/null || true)"
QUARTZ_VERSION="${QUARTZ_VERSION:-v4.5.2}"

if [ "$(cat "$BUILD/.version" 2>/dev/null || true)" != "$QUARTZ_VERSION" ]; then
  echo "Downloading Quartz $QUARTZ_VERSION..."
  rm -rf "$BUILD"
  git clone --quiet --depth 1 --branch "$QUARTZ_VERSION" https://github.com/jackyzha0/quartz.git "$BUILD"
  (cd "$BUILD" && npm ci --no-audit --no-fund)
  echo "$QUARTZ_VERSION" > "$BUILD/.version"
fi

cd "$BUILD"
# Reset Quartz's own files, then apply this wiki's customizations on top
git checkout --quiet -- .
git clean -fdq -e node_modules -e .version -e public -e .quartz-cache
cp -R "$ROOT/.quartz/." "$BUILD/"

npx quartz build --serve -d "$CONTENT"
