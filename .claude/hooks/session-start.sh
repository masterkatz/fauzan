#!/bin/bash
# Pasang semua dependency video pipeline bila session cloud start.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Node: remotion, hyperframes, transformers.js + model whisper-small (.npmrc skip CUDA)
npm install --no-audit --no-fund

# Python: numpy, opencv (face detect), onnxruntime (matte)
pip install -q --root-user-action=ignore -r requirements.txt

# Sanity check
command -v ffmpeg >/dev/null || { echo "ffmpeg tak jumpa" >&2; exit 1; }
python3 -c "import numpy, cv2, onnxruntime"
test -f node_modules/sts-whisper-small/models/Xenova/whisper-small/onnx/encoder_model_quantized.onnx

# Path browser untuk HyperFrames render
echo 'export HYPERFRAMES_BROWSER_PATH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell' >> "$CLAUDE_ENV_FILE"
