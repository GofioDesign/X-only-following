#!/usr/bin/env bash
# Genera el zip para subir a la Chrome Web Store
set -euo pipefail
cd "$(dirname "$0")"
VERSION=$(python3 -c "import json;print(json.load(open('extension/manifest.json'))['version'])")
mkdir -p dist
OUT="dist/dezombify-$VERSION.zip"
rm -f "$OUT"
(cd extension && zip -rq "../$OUT" . -x '.*')
echo "Creado $OUT"
