#!/bin/bash
# Render semua (atau yang dinamakan) template: HQ 1080x1920 CRF16 + preview 720p untuk phone.
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p out/hq out/preview
IDS=("$@")
if [ ${#IDS[@]} -eq 0 ]; then
  IDS=($(grep -oE "id: '[^']+'" remotion/templates/index.ts | cut -d"'" -f2))
fi
for ID in "${IDS[@]}"; do
  s=$(date +%s)
  if npx remotion render "$ID" "out/hq/$ID.mp4" --log=error > "out/hq/$ID.log" 2>&1; then
    ffmpeg -v error -y -i "out/hq/$ID.mp4" -vf scale=720:1280:flags=lanczos -c:v libx264 -crf 24 -preset slow \
      -c:a aac -b:a 128k -movflags +faststart "out/preview/${ID}_720p.mp4"
    echo "$ID OK $(( $(date +%s) - s ))s"
  else
    echo "$ID FAIL (lihat out/hq/$ID.log)"
  fi
done
echo ALLDONE
