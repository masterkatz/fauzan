#!/usr/bin/env python3
"""Synth SFX + music loop untuk demo template (placeholder sampai user upload pack sendiri).
Output: public/sfx/*.wav, public/music/*.m4a."""
import os, sys, wave
import numpy as np

SR = 48000
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")
rng = np.random.default_rng(7)


def t_(d):
    return np.arange(int(SR * d)) / SR


def env(n, a, r, curve=3.0):
    """attack (s) + exponential-ish release over the rest."""
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    rest = n - na
    if rest > 0:
        e[na:] = (1 - np.linspace(0, 1, rest)) ** curve
    return e


def lp(x, cutoff):
    """one-pole lowpass; cutoff may be array."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    s = 0.0
    for i in range(len(x)):
        s = (1 - a[i]) * x[i] + a[i] * s
        y[i] = s
    return y


def hp(x, cutoff):
    return x - lp(x, cutoff)


def bp(x, f):
    return lp(hp(x, f * 0.6), f * 1.6)


def noise(n):
    return rng.standard_normal(n)


def stereo(x, pan=None):
    if pan is None:
        return np.stack([x, x], 1)
    pan = np.broadcast_to(pan, x.shape)  # -1..1
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * l, x * r], 1)


def save(path, x, peak=0.89):
    if x.ndim == 1:
        x = stereo(x)
    m = np.abs(x).max() or 1
    x = x / m * peak
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())
    print("wrote", os.path.relpath(path, ROOT), f"{len(x)/SR:.2f}s")


# ------------------------------------------------------------------ SFX
def whoosh(d=0.55, f0=400, f1=3500, soft=False):
    n = int(SR * d)
    t = t_(d)
    sweep = f0 * (f1 / f0) ** (np.sin(np.pi * t / d) ** 2)
    x = lp(hp(noise(n), sweep * 0.5), sweep)
    x *= np.sin(np.pi * t / d) ** (3 if soft else 2)
    return stereo(x, np.linspace(-0.7, 0.7, n))


def hit(d=0.9):
    t = t_(d)
    f = 40 + 90 * np.exp(-t * 18)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0, 1) * np.exp(-t * 4)
    click = lp(noise(len(t)), 3000) * np.exp(-t * 60)
    return np.tanh(2.2 * (body + 0.5 * click))


def boom(d=2.4):
    t = t_(d)
    x = np.zeros_like(t)
    for f in (55, 82.4, 110, 164.8):
        ph = 2 * np.pi * f * t * (1 + 0.003 * np.sin(2 * np.pi * 0.7 * t))
        x += 2 * ((ph / (2 * np.pi)) % 1) - 1  # saw
    cut = 180 + 1400 * np.exp(-t * 2.5)
    x = lp(lp(x, cut), cut)
    x = np.tanh(1.8 * x) * env(len(t), 0.03, 0, 2.2)
    return x + 0.8 * hit(d)


def riser(d=1.3):
    t = t_(d)
    f = 200 * (8 ** (t / d))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    nz = lp(hp(noise(len(t)), 800), 800 + 9000 * (t / d) ** 2)
    x = (tone + nz) * (t / d) ** 2
    x[-int(0.02 * SR):] *= np.linspace(1, 0, int(0.02 * SR))
    return x


def glitch(d=0.38):
    n = int(SR * d)
    x = np.zeros(n)
    i = 0
    while i < n:
        L = int(rng.uniform(0.008, 0.04) * SR)
        kind = rng.integers(0, 3)
        tt = np.arange(min(L, n - i)) / SR
        if kind == 0:
            seg = np.sign(np.sin(2 * np.pi * rng.uniform(200, 2400) * tt))
        elif kind == 1:
            seg = noise(len(tt))
        else:
            seg = np.zeros(len(tt))
        x[i:i + len(tt)] = seg * rng.uniform(0.3, 1)
        i += L
    x = np.round(x * 6) / 6  # bitcrush
    return stereo(x * env(n, 0.002, 0, 0.6), np.sign(np.sin(np.arange(n) / 900)) * 0.6)


def blips(d=0.5):
    x = np.zeros(int(SR * d))
    for k, f in enumerate((1800, 2400, 1500, 3000)):
        s = int(k * 0.09 * SR)
        tt = t_(0.05)
        x[s:s + len(tt)] += np.sign(np.sin(2 * np.pi * f * tt)) * np.exp(-tt * 40)
    return x * 0.6


def magic(d=1.6):
    t = t_(d)
    x = np.zeros_like(t)
    notes = [1318.5, 1568, 1975.5, 2637, 3136, 3951]
    for k, f in enumerate(notes):
        s = int(k * 0.06 * SR)
        tt = t[: len(t) - s]
        x[s:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 3.5) * (0.7 ** k + 0.3)
    x += 0.15 * hp(noise(len(t)), 7000) * np.exp(-t * 3)
    return stereo(x, 0.5 * np.sin(2 * np.pi * 1.2 * t))


def bell(d=2.2, f=880):
    t = t_(d)
    x = np.zeros_like(t)
    for ratio, amp, dec in ((1, 1, 2.2), (2.76, 0.5, 3.5), (5.4, 0.25, 5), (8.93, 0.12, 7), (0.5, 0.3, 1.5)):
        x += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t * dec)
    return x * env(len(t), 0.002, 0, 0.3)


def shutter(d=0.35):
    x = np.zeros(int(SR * d))
    for s, dec in ((0, 120), (0.11, 90)):
        tt = t_(0.08)
        i = int(s * SR)
        x[i:i + len(tt)] += bp(noise(len(tt)), 2500) * np.exp(-tt * dec)
    return x


def neon(d=0.8):
    t = t_(d)
    saw = 2 * ((120 * t) % 1) - 1
    flick = (rng.random(len(t) // 800 + 1) > 0.25).repeat(800)[: len(t)]
    x = lp(saw + 0.3 * np.sign(np.sin(2 * np.pi * 240 * t)), 2500) * flick
    x += 0.4 * hit(d) * (t < 0.2)
    return x * env(len(t), 0.005, 0, 1.5)


def sting(d=1.6):
    t = t_(d)
    x = np.zeros_like(t)
    for k, chord in enumerate(((220, 277.2, 329.6), (246.9, 311.1, 370), (293.7, 370, 440, 587.3))):
        s = int(k * 0.16 * SR)
        tt = t[: len(t) - s]
        c = np.zeros_like(tt)
        for f in chord:
            c += sum(np.sin(2 * np.pi * f * h * tt) / h for h in range(1, 7))
        dec = 9 if k < 2 else 2.2
        x[s:] += c * np.exp(-tt * dec) * env(len(tt), 0.01, 0, 0.2)
    return np.tanh(0.6 * x) + 0.6 * hit(d)


def scribble(d=0.45):
    t = t_(d)
    am = 0.5 + 0.5 * np.sin(2 * np.pi * 14 * t + 3 * np.sin(2 * np.pi * 3 * t))
    return bp(noise(len(t)), 3200) * am * env(len(t), 0.02, 0, 0.7)


def paper(d=0.5):
    t = t_(d)
    crk = (rng.random(len(t)) > 0.985) * noise(len(t)) * 3
    return hp(noise(len(t)) * 0.4 + crk, 2000) * np.sin(np.pi * t / d) ** 1.5


def click(d=0.06):
    t = t_(d)
    return bp(noise(len(t)), 4000) * np.exp(-t * 200) + np.sin(2 * np.pi * 1600 * t) * np.exp(-t * 120)


def swish3d(d=0.6):
    w = whoosh(d, 250, 2500)
    t = t_(d)
    trem = 0.6 + 0.4 * np.sin(2 * np.pi * 22 * t)
    return w * trem[:, None]


# ------------------------------------------------------------------ MUSIC
def kick(d=0.35):
    t = t_(d)
    f = 45 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def snare(d=0.25):
    t = t_(d)
    return (hp(noise(len(t)), 1500) * 0.7 + np.sin(2 * np.pi * 190 * t) * 0.5) * np.exp(-t * 18)


def hat(d=0.06):
    t = t_(d)
    return hp(noise(len(t)), 7000) * np.exp(-t * 70)


def pluck(f, d=0.4):
    t = t_(d)
    x = sum(np.sin(2 * np.pi * f * h * t) * (0.6 ** h) for h in range(1, 6))
    return x * np.exp(-t * 8)


def pad(freqs, d):
    t = t_(d)
    x = np.zeros_like(t)
    for f in freqs:
        for dt in (-0.004, 0, 0.004):
            ph = 2 * np.pi * f * (1 + dt) * t
            x += 2 * ((ph / (2 * np.pi)) % 1) - 1
    x = lp(x, 900)
    a = min(1.0, d / 3)
    return x * np.minimum(1, np.minimum(t / a, (d - t) / a))


def place(buf, x, at):
    i = int(at * SR)
    j = min(len(buf), i + len(x))
    if i < len(buf):
        buf[i:j] += x[: j - i]


def m2f(m):
    return 440 * 2 ** ((m - 69) / 12)


CHORDS = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)]  # Am F C G


def music_pop(d=24, bpm=118):
    b = 60 / bpm
    out = np.zeros(int(SR * d))
    bass = np.zeros_like(out)
    beat = 0
    while beat * b < d:
        tt = beat * b
        place(out, kick() * 0.9, tt)
        if beat % 2 == 1:
            place(out, snare() * 0.55, tt)
        place(out, hat() * 0.25, tt + b / 2)
        ch = CHORDS[(beat // 4) % 4]
        place(bass, pluck(m2f(ch[0] - 24), b * 0.9) * 0.7, tt + b / 2)
        if beat % 2 == 0:
            for k, m in enumerate(ch):
                place(out, pluck(m2f(m + 12), 0.5) * 0.18, tt + k * b / 4)
        beat += 1
    return stereo(out + lp(bass, 400))


def music_ambient(d=24):
    out = np.zeros(int(SR * d))
    seg = d / 4
    for k in range(4):
        ch = CHORDS[k % 4]
        place(out, pad([m2f(m) for m in ch] + [m2f(ch[0] - 12)], seg + 1.5) * 0.25, k * seg)
    t = t_(d)
    for k in range(int(d * 2)):
        at = k * 0.5 + rng.uniform(0, 0.2)
        f = m2f(CHORDS[int(at / seg) % 4][rng.integers(0, 3)] + 24)
        place(out, np.sin(2 * np.pi * f * t_(0.8)) * np.exp(-t_(0.8) * 5) * 0.08, at)
    return stereo(out, 0.3 * np.sin(2 * np.pi * 0.1 * t))


def music_dark(d=24, bpm=100):
    b = 60 / bpm
    t = t_(d)
    out = lp(2 * ((55 * t) % 1) - 1 + 2 * ((55.3 * t) % 1) - 1, 220) * 0.35
    beat = 0
    while beat * b < d:
        tt = beat * b
        place(out, kick() * 0.8, tt)
        for s in range(4):
            place(out, hat() * (0.18 if s % 2 else 0.1), tt + s * b / 4)
        if beat % 4 == 2:
            place(out, snare() * 0.4, tt)
        beat += 1
    pulse = (np.sin(2 * np.pi * (bpm / 60 * 2) * t) > 0).astype(float)
    out += lp(np.sign(np.sin(2 * np.pi * 110 * t)) * pulse, 700) * 0.08
    return stereo(out)


def music_playful(d=24, bpm=126):
    b = 60 / bpm
    out = np.zeros(int(SR * d))
    mel = [72, 76, 79, 76, 74, 77, 81, 77, 72, 76, 79, 84, 79, 76, 74, 72]
    beat = 0
    while beat * b < d:
        tt = beat * b
        if beat % 2 == 0:
            place(out, kick() * 0.6, tt)
        else:
            place(out, snare() * 0.3, tt)
        place(out, pluck(m2f(mel[beat % 16]), 0.3) * 0.22, tt)
        place(out, pluck(m2f(mel[(beat + 2) % 16] - 12), 0.25) * 0.12, tt + b / 2)
        ch = CHORDS[(beat // 4) % 4]
        place(out, pluck(m2f(ch[0] - 24), b) * 0.4, tt)
        beat += 1
    return stereo(out)


if __name__ == "__main__":
    S = os.path.join(ROOT, "sfx")
    M = os.path.join(ROOT, "music")
    save(f"{S}/whoosh.wav", whoosh())
    save(f"{S}/whoosh-soft.wav", whoosh(0.45, 300, 2000, soft=True), 0.6)
    save(f"{S}/hit.wav", hit())
    save(f"{S}/boom.wav", boom())
    save(f"{S}/riser.wav", riser())
    save(f"{S}/glitch.wav", glitch())
    save(f"{S}/blips.wav", blips(), 0.6)
    save(f"{S}/magic.wav", magic(), 0.7)
    save(f"{S}/bell.wav", bell(), 0.7)
    save(f"{S}/shutter.wav", shutter())
    save(f"{S}/neon.wav", neon(), 0.7)
    save(f"{S}/sting.wav", sting())
    save(f"{S}/scribble.wav", scribble(), 0.6)
    save(f"{S}/paper.wav", paper(), 0.6)
    save(f"{S}/click.wav", click(), 0.6)
    save(f"{S}/swish3d.wav", swish3d())
    for name, fn in (("pop", music_pop), ("ambient", music_ambient), ("dark", music_dark), ("playful", music_playful)):
        wav = f"{M}/{name}.wav"
        save(wav, fn(), 0.8)
        # m4a: jimat saiz repo (wav 4.6MB -> ~0.5MB)
        os.system(f'ffmpeg -v error -y -i "{wav}" -c:a aac -b:a 160k "{M}/{name}.m4a" && rm "{wav}"')
