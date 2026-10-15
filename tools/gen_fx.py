#!/usr/bin/env python3
"""Tile film grain (8 frame) untuk overlay: public/fx/grain_N.png (540x960, diskala 2x masa render)."""
import os
import cv2
import numpy as np

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "fx")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(3)
for i in range(8):
    n = rng.normal(128, 38, (960, 540)).clip(0, 255).astype(np.uint8)
    cv2.imwrite(f"{OUT}/grain_{i}.png", n)
print("ok")
