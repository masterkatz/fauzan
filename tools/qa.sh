#!/bin/bash
# QA cepat: render separuh saiz, buat contact sheet 9 frame -> out/qa/<ID>.jpg
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out/qa
for ID in "$@"; do
  npx remotion render "$ID" "out/qa/$ID.small.mp4" --scale=0.5 --crf=26 --log=error > /dev/null 2>&1
  ffmpeg -v error -y -i "out/qa/$ID.small.mp4" \
    -vf "select='eq(n\,40)+eq(n\,75)+eq(n\,140)+eq(n\,230)+eq(n\,320)+eq(n\,400)+eq(n\,470)+eq(n\,540)+eq(n\,590)',tile=9x1" \
    -frames:v 1 -q:v 3 "out/qa/$ID.jpg"
  echo "qa $ID ok"
done
