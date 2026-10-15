# Remotion — 10 Template TikTok Talking-Head

Semua template guna **skrip yang sama** (`lib/script.ts`), jadi yang berubah cuma style. Untuk tukar style video, tukar je ID composition.

| ID | Style | Font | SFX utama | Music |
|---|---|---|---|---|
| `T01-KineticStack` | Anton kuning/putih bersusun di tepi muka, spring + motion blur, statement blur | Anton + DM Serif italic | hit, whoosh lembut, magic | pop |
| `T02-SoftLuxe` | Serif bercahaya + gradient rose gold, pill, kabus, sparkle, light leak, 3 kad naik | Playfair italic + Poppins | whoosh lembut, magic | ambient |
| `T03-BoldPop` | Karaoke 2–3 perkataan, pill aktif, scribble underline, hook box, PIP | Poppins 900 | shutter, whoosh | playful |
| `T04-GlitchTech` | RGB split, slice, shake, scanline, HUD REC, teks taip mono | Space Mono + Anton | glitch, blips, riser | dark |
| `T05-Cinematic` | Letterbox, teal-orange, grain, lens flare, blur-to-sharp, dip to black | Cinzel | boom (BWAAM), hit, riser | dark |
| `T06-Flip3D` | Nombor 3D extrude, kad flip, kamera parallax, transisi kiub | Bebas Neue | swish 3D | pop |
| `T07-NeonNight` | Grade gelap, teks neon berkelip, bingkai neon, cincin produk | Monoton + Montserrat + Caveat | buzz neon | dark |
| `T08-Editorial` | Masthead majalah, kertas koyak + tape, polaroid | Abril Fatface + Playfair | kertas, shutter | ambient |
| `T09-Doodle` | Contengan marker dilukis live, highlight, bulatan, anak panah, "boil" | Permanent Marker + Caveat | scribble | playful |
| `T10-BreakingNews` | Bug LIVE, lower third, ticker, kotak FAKTA, wipe jalur | Oswald + Montserrat | news sting, whoosh | dark |

Semua template ada punch-in zoom pada setiap cut, b-roll, end card 3s (logo + tajuk + "TEKAN BEG KUNING" + anak panah), dan safe zone TikTok.

## Arahan

```bash
npx remotion studio                       # preview + scrub dalam browser
./tools/qa.sh T04-GlitchTech              # contact sheet 9 frame -> out/qa/
./tools/render_all.sh                     # semua: out/hq (1080x1920 CRF16) + out/preview (720p)
./tools/render_all.sh T02-SoftLuxe        # satu template
```

## Struktur

- `lib/script.ts`: transkrip (word timestamps), beat (hook/tips/b-roll/produk/end), cut, kedudukan muka
- `lib/common.tsx`: Footage (punch-in + grade), BRoll, Packshot, Logo, EndCard, Sfx, Music, Flash
- `templates/T*.tsx`: satu fail untuk satu template
- `public/`: font (`@fontsource`), SFX + music (`tools/gen_audio.py`), grain (`tools/gen_fx.py`), placeholder (`tools/bake_placeholder.sh`)

## Bila guna footage sebenar

1. Prep footage ke 1080x1920 30fps (`prep.py` dalam kit). Letak dalam `public/`, kemudian tukar `FOOTAGE_SRC` (`lib/common.tsx`).
2. Isi `WORDS` dari Whisper, `BEATS` dari plan, `CUTS` dari jump cut, `FACE` dari face detect.
3. Gantikan `Packshot` / `Logo` / `BRoll` placeholder dengan gambar/video sebenar.

SFX dan music sekarang synth placeholder. Gantikan fail dalam `public/sfx` dan `public/music` dengan pack sendiri (guna nama fail yang sama).
