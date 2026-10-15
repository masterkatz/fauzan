import React from 'react';
import {AbsoluteFill, Html5Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile} from 'remotion';
import {BEATS, CUTS, FACE, WORDS} from './script';
import {E, rnd, tw, useT} from './anim';

// ------------------------------------------------------------------ audio
export const Sfx: React.FC<{f: string; at: number; v?: number}> = ({f, at, v = 0.35}) => (
  <Sequence from={Math.max(0, Math.round(at * 30))} durationInFrames={90} layout="none">
    <Html5Audio src={staticFile(`sfx/${f}.wav`)} volume={v} />
  </Sequence>
);

// Music latar: perlahan bawah suara, naik masa end card, fade out hujung.
export const Music: React.FC<{f: string; v?: number; vEnd?: number}> = ({f, v = 0.16, vEnd = 0.38}) => (
  <Html5Audio
    src={staticFile(`music/${f}.m4a`)}
    volume={(fr) => {
      const t = fr / 30;
      const base = interpolate(t, [0, 0.4, BEATS.end.t - 0.2, BEATS.end.t + 0.4], [0, v, v, vEnd], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return base * interpolate(t, [19.2, 20], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    }}
  />
);

// ------------------------------------------------------------------ placeholder footage
const BLINKS = [2.1, 5.6, 8.9, 13.2, 15.9];

const mouthOpen = (t: number) => {
  for (const w of WORDS) {
    const d = t - w.t;
    const len = Math.min(0.32, 0.12 + w.w.length * 0.035);
    if (d >= 0 && d < len) return Math.sin((d / len) * Math.PI) * (0.6 + 0.4 * rnd(w.t * 10));
  }
  return 0;
};

export const Presenter: React.FC<{t: number; layer?: 'all' | 'bg' | 'person'}> = ({t, layer = 'all'}) => {
  const talking = t < 16.8;
  const mo = talking ? mouthOpen(t) : 0;
  const blink = BLINKS.some((b) => t > b && t < b + 0.12) ? 0.1 : 1;
  const sway = Math.sin(t * 1.3) * 1.6 + Math.sin(t * 3.1) * 0.6 + mo * 1.2;
  const nod = Math.sin(t * 2.2) * 4 + mo * 6;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#EFE2D2" />
          <stop offset="1" stopColor="#BFA88F" />
        </linearGradient>
        <radialGradient id="light" cx="0.2" cy="0.15" r="0.7">
          <stop offset="0" stopColor="#FFF8EC" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFF8EC" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D49A98" />
          <stop offset="1" stopColor="#B87C7B" />
        </linearGradient>
        <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A5468" />
          <stop offset="1" stopColor="#2E3546" />
        </linearGradient>
        <radialGradient id="skin" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#F2C7A5" />
          <stop offset="1" stopColor="#D9A27E" />
        </radialGradient>
        <filter id="dof">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      {/* background (out of focus) */}
      {layer !== 'person' && <>
      <rect width="1080" height="1920" fill="url(#wall)" />
      <g filter="url(#dof)">
        <rect x="-40" y="380" width="300" height="26" fill="#8C6E54" />
        <rect x="20" y="300" width="60" height="80" rx="8" fill="#E9B8A8" />
        <rect x="100" y="270" width="50" height="110" rx="10" fill="#9DB4A0" />
        <circle cx="200" cy="345" r="36" fill="#F3D9A4" />
        <ellipse cx="930" cy="900" rx="120" ry="220" fill="#7E9A6E" />
        <ellipse cx="1010" cy="760" rx="90" ry="160" fill="#93AE7F" />
        <rect x="880" y="1080" width="120" height="180" rx="16" fill="#B9876A" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={120 + i * 170} cy={180 + (i % 2) * 90} r={30 + (i % 3) * 14} fill="#FFF3DF" opacity={0.5} />
        ))}
      </g>
      <rect width="1080" height="1920" fill="url(#light)" />
      </>}
      {/* presenter */}
      {layer !== 'bg' && (
      <g transform={`rotate(${sway} 540 1200) translate(0 ${nod * 0.3})`}>
        <path d="M120 1920 C140 1380 260 1130 540 1110 C820 1130 940 1380 960 1920 Z" fill="url(#shirt)" />
        <path d="M330 760 C310 980 300 1120 250 1260 C420 1330 660 1330 830 1260 C780 1120 770 980 750 760 Z" fill="url(#hood)" />
        <g transform={`translate(0 ${nod * 0.4})`}>
          <ellipse cx="540" cy="700" rx="228" ry="262" fill="url(#hood)" />
          <ellipse cx="540" cy="735" rx="140" ry="175" fill="url(#skin)" />
          <path d="M392 610 C430 520 650 520 688 610 C640 570 440 570 392 610 Z" fill="#B87C7B" />
          {/* brows */}
          <path d="M455 668 Q490 652 520 664" stroke="#5A3A2E" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M560 664 Q590 652 625 668" stroke="#5A3A2E" strokeWidth="7" fill="none" strokeLinecap="round" />
          {/* eyes */}
          <ellipse cx="490" cy="705" rx="17" ry={13 * blink} fill="#2B1C16" />
          <ellipse cx="590" cy="705" rx="17" ry={13 * blink} fill="#2B1C16" />
          <circle cx="495" cy="700" r={4 * blink} fill="#fff" />
          <circle cx="595" cy="700" r={4 * blink} fill="#fff" />
          {/* nose */}
          <path d="M540 720 Q532 765 548 772" stroke="#C78B6A" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* blush */}
          <ellipse cx="465" cy="775" rx="30" ry="16" fill="#E88E86" opacity="0.35" />
          <ellipse cx="615" cy="775" rx="30" ry="16" fill="#E88E86" opacity="0.35" />
          {/* mouth */}
          <path
            d={`M500 818 Q540 ${826 + mo * 4} 580 818 Q540 ${830 + mo * 34} 500 818 Z`}
            fill="#8E3B3E"
            stroke="#B5585A"
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </g>
      </g>
      )}
    </svg>
  );
};

// Untuk bake: bg statik (gambar) + orang (SVG ringan, tanpa blur).
export const PresenterBaked: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Img src={staticFile('placeholder/bg.png')} style={{width: 1080, height: 1920}} />
      <Presenter t={t} layer="person" />
    </AbsoluteFill>
  );
};

// Footage sumber. Ganti src dengan footage sebenar (1080x1920 30fps yang dah di-prep).
export const FOOTAGE_SRC = 'placeholder/talking.mp4';
export const FOOTAGE_BLUR_SRC = 'placeholder/talking_blur.mp4';
export const END_BG_SRC = 'placeholder/endbg.jpg';

// Footage + jump-cut punch-in + grade. punch: 'hard' = potong terus, 'smooth' = ease.
export const Footage: React.FC<{grade?: string; punch?: 'hard' | 'smooth'; zoom?: number; label?: boolean; src?: string}> = ({
  src = FOOTAGE_SRC,
  grade = 'none',
  punch = 'hard',
  zoom = 1.12,
  label = true,
}) => {
  const t = useT();
  let idx = 0;
  CUTS.forEach((c, i) => {
    if (t >= c) idx = i;
  });
  const target = idx % 2 ? zoom : 1;
  const prev = idx % 2 ? 1 : zoom;
  let s = punch === 'smooth' ? interpolate(t, [CUTS[idx], CUTS[idx] + 0.35], [prev, target], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.out(E.cubic)}) : target;
  if (idx === 0) s = interpolate(t, [0, 1.2], [1.12, 1], {extrapolateRight: 'clamp', easing: E.out(E.cubic)});
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${FACE.x}px ${FACE.y}px`, filter: grade}}>
        <OffthreadVideo src={staticFile(src)} muted style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
      {label && t < BEATS.end.t && (
        <div
          style={{
            position: 'absolute', left: 40, top: 1830, padding: '8px 18px', borderRadius: 999,
            background: 'rgba(0,0,0,.45)', color: '#fff', font: '600 24px Poppins', letterSpacing: 1,
          }}
        >
          CONTOH • footage kau ganti sini
        </div>
      )}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ product placeholders
export const Packshot: React.FC<{w?: number; body?: string; cap?: string; label?: string; ink?: string; style?: React.CSSProperties}> = ({
  w = 300, body = '#7A3E8E', cap = '#F2C94C', label = '#FFF6EA', ink = '#7A3E8E', style,
}) => (
  <svg viewBox="0 0 200 320" width={w} height={w * 1.6} style={style}>
    <defs>
      <linearGradient id={`gl${body.slice(1)}`} x1="0" x2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.25" stopColor="#fff" stopOpacity="0.45" />
        <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect x="62" y="6" width="76" height="58" rx="10" fill={cap} />
    <rect x="70" y="58" width="60" height="18" fill={cap} opacity="0.8" />
    <path d="M40 92 Q40 74 62 74 H138 Q160 74 160 92 V292 Q160 314 138 314 H62 Q40 314 40 292 Z" fill={body} />
    <rect x="52" y="140" width="96" height="120" rx="10" fill={label} />
    <text x="100" y="186" textAnchor="middle" fontFamily="Anton" fontSize="30" fill={ink}>PRODUK</text>
    <text x="100" y="214" textAnchor="middle" fontFamily="Poppins" fontWeight="700" fontSize="15" fill={ink}>KAU</text>
    <rect x="72" y="230" width="56" height="6" rx="3" fill={ink} opacity="0.4" />
    <path d="M40 92 Q40 74 62 74 H138 Q160 74 160 92 V292 Q160 314 138 314 H62 Q40 314 40 292 Z" fill={`url(#gl${body.slice(1)})`} />
  </svg>
);

export const Logo: React.FC<{size?: number; bg?: string; ink?: string}> = ({size = 200, bg = '#fff', ink = '#7A3E8E'}) => (
  <div
    style={{
      width: size, height: size, borderRadius: size * 0.22, background: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', boxShadow: '0 18px 40px rgba(0,0,0,.35)', flexDirection: 'column',
    }}
  >
    <div style={{font: `900 ${size * 0.26}px Poppins`, color: ink, lineHeight: 1}}>LOGO</div>
    <div style={{font: `600 ${size * 0.09}px Poppins`, color: ink, opacity: 0.6, letterSpacing: 3}}>JENAMA</div>
  </div>
);

// B-roll placeholder: macro packshot, light sweep, zoom perlahan.
export const BRoll: React.FC<{bg?: [string, string]; body?: string; cap?: string}> = ({bg = ['#3B1E4A', '#B76E9E'], body, cap}) => {
  const t = useT();
  const {t: a, end: b} = BEATS.broll;
  const p = tw(t, a, b, 0, 1, (x) => x);
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 45%, ${bg[1]}, ${bg[0]} 70%)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1.2 - p * 0.18}) rotate(${-4 + p * 6}deg)`, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 230}}>
        <Packshot w={400} body={body} cap={cap} />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute', top: -400, left: -600 + p * 1800, width: 260, height: 2800, transform: 'rotate(20deg)',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)',
        }}
      />
      {Array.from({length: 18}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: rnd(i) * 1080, top: 1920 - ((rnd(i + 50) * 1920 + p * 600) % 1920),
            width: 6 + rnd(i + 9) * 10, height: 6 + rnd(i + 9) * 10, borderRadius: 99, background: '#fff',
            opacity: 0.35 + rnd(i + 3) * 0.4, boxShadow: '0 0 14px 4px rgba(255,255,255,.6)',
          }}
        />
      ))}
      <div style={{position: 'absolute', left: 40, top: 1830, padding: '8px 18px', borderRadius: 999, background: 'rgba(0,0,0,.45)', color: '#fff', font: '600 24px Poppins'}}>
        CONTOH • b-roll kau ganti sini
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ end card
export const BAG: React.FC<{size?: number}> = ({size = 64}) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M14 22 h36 l-3 34 h-30 z" fill="#FFD233" stroke="#2A1A14" strokeWidth="4" strokeLinejoin="round" />
    <path d="M23 24 v-6 a9 9 0 0 1 18 0 v6" fill="none" stroke="#2A1A14" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const Arrow: React.FC<{color?: string}> = ({color = '#FFD233'}) => (
  <svg viewBox="0 0 120 120" width={170} height={170}>
    <path d="M100 18 Q70 70 26 92" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
    <path d="M26 92 l26 -2 M26 92 l10 -24" stroke={color} strokeWidth="9" strokeLinecap="round" />
  </svg>
);

export type EndStyle = {
  shade: string;
  title: React.CSSProperties;
  sub: React.CSSProperties;
  logoBg?: string;
  logoInk?: string;
  bgFilter?: string;
  arrow?: string;
  cta?: React.CSSProperties;
};

export const EndCard: React.FC<{s: EndStyle; children?: React.ReactNode}> = ({s, children}) => {
  const t = useT();
  const T0 = BEATS.end.t;
  if (t < T0 - 0.1) return null;
  const k = (d: number) => tw(t, T0 + d, T0 + d + 0.45, 0, 1, E.out(E.back(2)));
  const pulse = 1 + 0.06 * Math.max(0, Math.sin((t - T0 - 1.3) * 7)) * (t > T0 + 1.3 ? 1 : 0);
  const arrowBob = Math.sin((t - T0) * 7) * 12;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: tw(t, T0, T0 + 0.3), transform: `scale(${1.05 + (t - T0) * 0.04})`, filter: s.bgFilter ?? 'brightness(.8)'}}>
        <Img src={staticFile(END_BG_SRC)} style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: s.shade, opacity: tw(t, T0, T0 + 0.3)}} />
      {children}
      <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <div style={{opacity: k(0.05), transform: `translateY(${(1 - k(0.05)) * 40}px) scale(${0.8 + 0.2 * k(0.05)})`}}>
          <Logo size={220} bg={s.logoBg} ink={s.logoInk} />
        </div>
        <div style={{marginTop: 46, opacity: k(0.3), transform: `translateY(${(1 - k(0.3)) * 40}px)`, ...s.title}}>{BEATS.end.title}</div>
        <div style={{opacity: k(0.5), transform: `translateY(${(1 - k(0.5)) * 30}px)`, ...s.sub}}>{BEATS.end.sub}</div>
        <div
          style={{
            marginTop: 60, opacity: k(0.8), transform: `scale(${(0.6 + 0.4 * k(0.8)) * pulse})`, display: 'flex', alignItems: 'center',
            gap: 18, background: '#FFD233', color: '#2A1A14', font: '900 54px Poppins', padding: '22px 46px', borderRadius: 999,
            boxShadow: '0 16px 40px rgba(0,0,0,.35)', ...s.cta,
          }}
        >
          <BAG />
          <span>{BEATS.end.cta}</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 90, top: 1330, opacity: k(1.0), transform: `translate(${-arrowBob}px, ${arrowBob}px)`}}>
        <Arrow color={s.arrow} />
      </div>
    </AbsoluteFill>
  );
};

// flash putih/warna pada masa t
export const Flash: React.FC<{at: number[]; color?: string; max?: number}> = ({at, color = '#fff', max = 0.7}) => {
  const t = useT();
  let o = 0;
  for (const a of at) {
    if (t >= a - 0.06 && t < a + 0.35) o = Math.max(o, t < a ? tw(t, a - 0.06, a, 0, max) : tw(t, a, a + 0.3, max, 0));
  }
  return <AbsoluteFill style={{background: color, opacity: o, pointerEvents: 'none'}} />;
};
