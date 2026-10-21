"""check-whisper-gpu.py - Test faster-whisper guna GPU NVIDIA atau tidak.
Cara guna:  py -3.12 check-whisper-gpu.py
"""
import os, sys, glob, time, sysconfig

# Windows: bagi ctranslate2 jumpa DLL CUDA dari pip (nvidia-cublas-cu12, nvidia-cudnn-cu12)
site = sysconfig.get_paths()["purelib"]
for d in glob.glob(os.path.join(site, "nvidia", "*", "bin")):
    os.environ["PATH"] = d + os.pathsep + os.environ["PATH"]
    if hasattr(os, "add_dll_directory"):
        os.add_dll_directory(d)

import ctranslate2
import numpy as np
from faster_whisper import WhisperModel

n = ctranslate2.get_cuda_device_count()
print(f"CUDA devices: {n}")
if n == 0:
    print("GAGAL: GPU tak dikesan. Transcribe akan guna CPU.")
    sys.exit(1)

types = ctranslate2.get_supported_compute_types("cuda")
print(f"Compute types disokong: {sorted(types)}")
# GTX 16xx/RTX boleh float16; GTX 9xx kena float32
ct = "float16" if "float16" in types else "float32"

audio = np.zeros(16000 * 5, dtype=np.float32)  # 5s senyap, cukup untuk test
for ct_try in (ct, "float32"):
    try:
        t = time.time()
        model = WhisperModel("small", device="cuda", compute_type=ct_try)
        list(model.transcribe(audio, language="ms")[0])
        print(f"OK: faster-whisper jalan atas GPU (compute_type={ct_try}) dalam {time.time()-t:.1f}s")
        sys.exit(0)
    except Exception as e:
        print(f"compute_type={ct_try} gagal: {e}")
print("GAGAL: GPU dikesan tapi model tak boleh jalan. Paste output ni kat Claude.")
sys.exit(1)
