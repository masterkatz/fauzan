// T09 DOODLE — contengan marker dilukis live (stroke draw-on), highlight kuning, anak panah, bulatan, "boil" tangan.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {BEATS} from '../lib/script';
import {BRoll, EndCard, Footage, Music, Packshot, Sfx} from '../lib/common';
import {fit} from '../lib/Stack';
import {rnd, sp, tw, useT} from '../lib/anim';

const {hook, tips, broll, product, end} = BEATS;
const INK = '#1B1B1B';
const HL = '#FFE03D';
const RD = '#FF4D3D';
const BLU = '#2F7BFF';

// "boil": goyang kecil 8fps macam animasi tangan
const boil = (t: number, seed: number, amt = 1.2) => {
  const k = Math.floor(t * 8);
  return {r: (rnd(k * 3 + seed) - 0.5) * amt * 2, x: (rnd(k * 5 + seed) - 0.5) * amt * 3, y: (rnd(k * 7 + seed) - 0.5) * amt * 3};
};

const Draw: React.FC<{d: string; at: number; out: number; color: string; w?: number; dur?: number; len?: number; vb?: string; style: React.CSSProperties}> = ({d, at, out, color, w = 10, dur = 0.4, len = 1200, vb = '0 0 400 200', style}) => {
  const t = useT();
  if (t < at || t > out) return null;
  const p = tw(t, at, at + dur, 0, 1, (x) => 1 - (1 - x) ** 2);
  const b = boil(t, len);
  return (
    <svg viewBox={vb} style={{position: 'absolute', overflow: 'visible', transform: `translate(${b.x}px,${b.y}px) rotate(${b.r}deg)`, opacity: 1 - tw(t, out - 0.15, out), ...style}}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
    </svg>
  );
};

const ARROW = 'M20 180 C 80 140, 160 60, 330 40 M330 40 L 280 20 M330 40 L 295 85';
const CIRCLE = 'M200 20 C 330 15, 395 70, 390 110 C 385 165, 290 190, 190 185 C 80 182, 10 150, 12 100 C 15 45, 110 22, 215 26';
const STAR = 'M50 5 L62 38 L97 38 L69 58 L80 92 L50 72 L20 92 L31 58 L3 38 L38 38 Z';
const SQUIG = 'M5 30 C 40 0, 60 60, 95 30 C 130 0, 150 60, 185 30 C 220 0, 240 60, 275 30';

const Word: React.FC<{text: string; at: number; out: number; size: number; font?: string; color?: string; hl?: boolean; style?: React.CSSProperties}> = ({text, at, out, size, font = 'Marker', color = INK, hl, style}) => {
  const t = useT();
  if (t < at || t > out) return null;
  const p = sp(t, at, {damping: 11, stiffness: 200});
  const b = boil(t, size + text.length);
  const hp = tw(t, at + 0.1, at + 0.45);
  return (
    <div style={{position: 'relative', display: 'inline-block', transform: `translate(${b.x}px,${b.y}px) rotate(${b.r - 2}deg) scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 2) * (1 - tw(t, out - 0.15, out)), ...style}}>
      {hl && <div style={{position: 'absolute', left: -10, right: -10, top: '28%', bottom: '8%', background: HL, transformOrigin: 'left', transform: `scaleX(${hp}) skewX(-8deg)`, borderRadius: 6}} />}
      <span style={{position: 'relative', font: `${font === 'Caveat' ? 700 : 400} ${size}px ${font}`, color, whiteSpace: 'nowrap', textShadow: hl || color === '#fff' ? undefined : '4px 0 0 #fff, -4px 0 0 #fff, 0 4px 0 #fff, 0 -4px 0 #fff, 3px 3px 0 #fff, -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff'}}>{text}</span>
    </div>
  );
};

// kad kertas putih senget (macam sticky note)
const Note: React.FC<{at: number; out: number; children: React.ReactNode; style: React.CSSProperties; rot?: number}> = ({at, out, children, style, rot = -2}) => {
  const t = useT();
  if (t < at || t > out) return null;
  const p = sp(t, at, {damping: 12, stiffness: 160});
  const b = boil(t, 99, 0.6);
  return (
    <div style={{position: 'absolute', background: '#fff', border: `5px solid ${INK}`, borderRadius: '18px 26px 16px 30px', padding: '18px 34px', boxShadow: `8px 8px 0 ${INK}`, transform: `rotate(${rot + b.r}deg) scale(${0.5 + 0.5 * p})`, opacity: Math.min(1, p * 2) * (1 - tw(t, out - 0.15, out)), ...style}}>
      {children}
    </div>
  );
};

export const T09Doodle: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Footage grade="brightness(1.06) saturate(1.12) contrast(1.03)" zoom={1.1} />
    <Sequence from={Math.round(broll.t * 30)} durationInFrames={Math.round((broll.end - broll.t) * 30)}>
      <BRoll bg={['#FFB347', '#FFF1B8']} />
    </Sequence>
    {/* hook */}
    <Note at={0.2} out={hook.end} style={{left: 90, top: 1000}}>
      <Word text="korang nak tahu..." at={0.25} out={hook.end} size={64} font="Caveat" />
    </Note>
    <div style={{position: 'absolute', left: 0, right: 140, top: 1130, textAlign: 'center'}}>
      <Word text="3 TIPS" at={1.1} out={hook.end} size={200} color={RD} />
    </div>
    <Draw d={SQUIG} vb="0 0 280 60" len={420} at={1.4} out={hook.end} color={RD} style={{left: 250, top: 1350, width: 460, height: 90}} />
    <div style={{position: 'absolute', left: 0, right: 140, top: 1430, textAlign: 'center'}}>
      <Word text="pilih produk!" at={1.9} out={hook.end} size={80} hl />
    </div>
    <Draw d={STAR} vb="0 0 100 100" len={400} at={1.3} out={hook.end} color={HL} w={7} style={{left: 760, top: 1030, width: 110, height: 110}} />
    {/* tips */}
    {tips.map((b, i) => (
      <React.Fragment key={i}>
        <Note at={b.t} out={b.end} rot={i % 2 ? 3 : -3} style={{left: i % 2 ? 470 : 60, top: 990}}>
          <Word text={`#${b.n.replace('0', '')}`} at={b.t} out={b.end} size={90} color={BLU} />
        </Note>
        <div style={{position: 'absolute', left: 60, width: 830, top: 1150, textAlign: 'center'}}>
          <Word text={b.key} at={b.t + 0.4} out={b.end} size={fit(b.key, 120, 800, 0.58)} hl />
        </div>
        <Draw d={CIRCLE} len={1100} at={b.t + 0.9} out={b.end} color={RD} w={9} style={{left: 40, top: 1110, width: 870, height: 230}} />
        <div style={{position: 'absolute', left: 60, width: 830, top: 1350, textAlign: 'center'}}>
          <Word text={b.sub} at={b.t + 1.4} out={b.end} size={64} font="Caveat" color="#fff" style={{textShadow: `3px 3px 0 ${INK}`}} />
        </div>
      </React.Fragment>
    ))}
    {/* b-roll */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 1250, textAlign: 'center'}}>
      <Word text={broll.line} at={broll.t + 0.1} out={broll.end} size={70} font="Caveat" />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center'}}>
      <Word text="cantik kat iklan" at={broll.t + 0.7} out={broll.end} size={100} hl />
    </div>
    {/* produk: bulatan + anak panah "INI!" */}
    <Note at={product.t + 0.3} out={product.end} rot={5} style={{left: 620, top: 120, padding: 14}}>
      <Packshot w={170} />
    </Note>
    <Draw d={ARROW} len={600} at={product.t + 0.7} out={product.end} color={RD} w={11} style={{left: 360, top: 330, width: 280, height: 160, transform: 'scaleX(1)'}} />
    <div style={{position: 'absolute', left: 230, top: 260}}>
      <Word text="INI!" at={product.t + 1.0} out={product.end} size={90} color={RD} />
    </div>
    <div style={{position: 'absolute', left: 70, top: 1080}}>
      <Word text={product.lead} at={product.t} out={product.end} size={66} font="Caveat" color="#fff" style={{textShadow: `3px 3px 0 ${INK}`}} />
    </div>
    <div style={{position: 'absolute', left: 70, top: 1170}}>
      <Word text="PRODUK KAU" at={product.t + 0.4} out={product.end} size={130} hl />
    </div>
    <EndCard
      s={{
        shade: 'linear-gradient(180deg, rgba(255,250,235,.55), rgba(255,240,200,.88))',
        title: {font: '400 130px Marker', color: INK, transform: 'rotate(-3deg)'},
        sub: {font: '700 66px Caveat', color: RD, marginTop: 6},
        bgFilter: 'brightness(1.05)',
        logoBg: '#fff',
        cta: {border: `5px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`},
        arrow: RD,
      }}
    />
    <Music f="playful" v={0.18} />
    {[1.4, ...tips.map((b) => b.t + 0.9), broll.t + 0.7, product.t + 0.7].map((a) => <Sfx key={a} f="scribble" at={a} v={0.4} />)}
    <Sfx f="whoosh-soft" at={broll.t} v={0.25} />
    <Sfx f="bell" at={end.t + 0.85} v={0.35} />
  </AbsoluteFill>
);
