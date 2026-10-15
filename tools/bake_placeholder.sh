#!/bin/bash
# Bake footage placeholder (presenter animasi) jadi MP4, macam footage sebenar yang dah di-prep.
set -euo pipefail
cd "$(dirname "$0")/.."
P=public/placeholder
mkdir -p "$P"
npx remotion still Bake-BG "$P/bg.png" --frame=0 --image-format=png --log=error
npx remotion render Bake-Talking "$P/talking.mp4" --crf=16 --muted --log=error
# versi blur (untuk statement / end card) + gambar end card
ffmpeg -v error -y -i "$P/talking.mp4" -vf "scale=270:480,gblur=sigma=6,scale=1080:1920" -c:v libx264 -crf 22 -pix_fmt yuv420p "$P/talking_blur.mp4"
ffmpeg -v error -y -ss 16.9 -i "$P/talking.mp4" -frames:v 1 -vf "scale=270:480,gblur=sigma=5,scale=1080:1920" -q:v 3 "$P/endbg.jpg"
echo "bake ok"
