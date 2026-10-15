// T07 NEON NIGHT — grade gelap, teks tiub neon berkelip masuk, bingkai neon, cincin neon pada produk, buzz.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {BEATS} from '../lib/script';
import {BRoll, EndCard, Footage, Music, Packshot, Sfx} from '../lib/common';
import {fit} from '../lib/Stack';
import {rnd, tw, useT} from '../lib/anim';

const {hook, tips, broll, product, end} = BEATS;
const PK = '#FF3EA5';
const CY = '#3EF0FF';
const YL = '#FFE93E';

const glow = (c: string, k = 1) =>
  `0 0 ${4 * k}px #fff, 0 0 ${10 * k}px ${c}, 0 0 ${22 * k}px ${c}, 0 0 ${44 * k}px ${c}, 0 0 ${80 * k}px ${c}`;

// kelip neon masa hidup: on/off rawak selama 0.45s, lepas tu stabil + dengung halus
const flick = (t: number, at: number, seed: number) => {
  if (t < at) return 0;
  const d = t - at;
  if (d > 0.45) return 0.92 + 0.08 * Math.sin(t * 40 + seed);
  return rnd(Math.floor(d * 30) * 7 + seed) > 0.45 ? 1 : 0.15;
};

const Neon: React.FC<{text: string; at: number; out: number; color: string; font: string; size: number; seed?: number; style?: React.CSSProperties}> = ({text, at, out, color, font, size, seed = 1, style}) => {
  const t = useT();
  if (t < at || t > out) return null;
  const f = flick(t, at, seed) * (1 - tw(t, out - 0.2, out));
  return (
    <div style={{font: `${size}px ${font}`, color: '#FFF6FB', whiteSpace: 'nowrap', textShadow: glow(color, f), opacity: 0.25 + 0.75 * f, lineHeight: 1.05, ...style}}>
      {text}
    </div>
  );
};

const Frame: React.FC<{at: number; out: number; color: string; children: React.ReactNode; top: number}> = ({at, out, color, children, top}) => {
  const t = useT();
  if (t < at || t > out) return null;
  const f = flick(t, at + 0.1, 9) * (1 - tw(t, out - 0.2, out));
  return (
    <div style={{position: 'absolute', left: 60, right: 140, top, display: 'flex', justifyContent: 'center'}}>
      <div style={{border: `6px solid #FFF6FB`, borderRadius: 34, padding: '24px 40px', boxShadow: `${glow(color, f)}, inset 0 0 30px ${color}`, opacity: 0.3 + 0.7 * f, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'rgba(10,0,20,.35)'}}>
        {children}
      </div>
    </div>
  );
};

const Ring: React.FC = () => {
  const t = useT();
  const a = product.t + 0.3;
  if (t < a || t > product.end) return null;
  const f = flick(t, a, 4) * (1 - tw(t, product.end - 0.2, product.end));
  return (
    <div style={{position: 'absolute', left: 620, top: 110, width: 320, height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 + 0.8 * f}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `6px solid #FFF6FB`, boxShadow: `0 0 18px ${CY}, 0 0 40px ${CY}, inset 0 0 24px ${CY}`, transform: `rotate(${t * 60}deg)`, borderTopColor: 'transparent'}} />
      <Packshot w={170} body="#2A0A3A" cap={PK} label="#FFF0FA" ink="#2A0A3A" style={{filter: `drop-shadow(0 0 20px ${PK})`}} />
    </div>
  );
};

export const T07NeonNight: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Footage grade="brightness(.58) contrast(1.25) saturate(1.3)" zoom={1.12} />
      <Sequence from={Math.round(broll.t * 30)} durationInFrames={Math.round((broll.end - broll.t) * 30)}>
        <AbsoluteFill style={{filter: 'brightness(.75) saturate(1.4)'}}>
          <BRoll bg={['#0A0018', '#5B0B6E']} body="#2A0A3A" cap={PK} />
        </AbsoluteFill>
      </Sequence>
      {/* pencahayaan neon: magenta kiri, cyan kanan */}
      <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(255,62,165,.42), rgba(40,0,80,.15) 50%, rgba(62,240,255,.32))`, mixBlendMode: 'color-dodge', opacity: 0.55 + 0.05 * Math.sin(t * 9)}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(10,0,25,.75))'}} />
      <Ring />
      {/* hook */}
      <Neon text="korang nak tahu" at={0.2} out={hook.end} color={CY} font="Caveat" size={86} style={{position: 'absolute', left: 0, right: 140, top: 990, textAlign: 'center', fontWeight: 700}} />
      <Neon text="3 TIPS" at={1.1} out={hook.end} color={PK} font="Monoton" size={170} seed={3} style={{position: 'absolute', left: 0, right: 140, top: 1090, textAlign: 'center'}} />
      <Neon text="PILIH PRODUK" at={1.9} out={hook.end} color={YL} font="Montserrat" size={78} seed={5} style={{position: 'absolute', left: 0, right: 140, top: 1300, textAlign: 'center', fontWeight: 900}} />
      {tips.map((b, i) => {
        const c = [PK, CY, YL][i];
        return (
          <Frame key={i} at={b.t} out={b.end} color={c} top={1020}>
            <Neon text={b.n} at={b.t} out={b.end} color={c} font="Monoton" size={110} seed={i * 4} />
            <Neon text={b.key} at={b.t + 0.4} out={b.end} color={c} font="Montserrat" size={fit(b.key, 92, 700, 0.66)} seed={i * 4 + 1} style={{fontWeight: 900}} />
            <Neon text={b.sub} at={b.t + 1.2} out={b.end} color={CY} font="Caveat" size={62} seed={i * 4 + 2} style={{fontWeight: 700}} />
          </Frame>
        );
      })}
      <Neon text={broll.line} at={broll.t + 0.1} out={broll.end} color={CY} font="Caveat" size={76} style={{position: 'absolute', left: 0, right: 0, top: 1230, textAlign: 'center', fontWeight: 700}} />
      <Neon text={broll.key} at={broll.t + 0.7} out={broll.end} color={PK} font="Montserrat" size={84} seed={6} style={{position: 'absolute', left: 0, right: 0, top: 1320, textAlign: 'center', fontWeight: 900}} />
      <Neon text={product.lead} at={product.t} out={product.end} color={CY} font="Caveat" size={76} style={{position: 'absolute', left: 60, top: 1060, fontWeight: 700}} />
      <Neon text="PRODUK KAU" at={product.t + 0.5} out={product.end} color={YL} font="Montserrat" size={110} seed={8} style={{position: 'absolute', left: 60, top: 1150, fontWeight: 900}} />
      <EndCard
        s={{
          shade: 'linear-gradient(180deg, rgba(40,0,60,.6), rgba(5,0,15,.9))',
          title: {font: '900 120px Montserrat', color: '#FFF6FB', textShadow: glow(PK)},
          sub: {font: '700 70px Caveat', color: '#FFF6FB', textShadow: glow(CY, 0.7), marginTop: 10},
          bgFilter: 'brightness(.45) saturate(1.4) hue-rotate(-30deg)',
          logoBg: '#14001F',
          logoInk: PK,
          cta: {boxShadow: `0 0 30px ${YL}, 0 16px 40px rgba(0,0,0,.4)`},
          arrow: YL,
        }}
      />
      <Music f="dark" v={0.18} />
      {[1.1, ...tips.map((b) => b.t), product.t + 0.3].map((a) => <Sfx key={a} f="neon" at={a} v={0.3} />)}
      <Sfx f="whoosh-soft" at={broll.t} v={0.25} />
      <Sfx f="neon" at={end.t + 0.3} v={0.3} />
      <Sfx f="bell" at={end.t + 0.85} v={0.3} />
    </AbsoluteFill>
  );
};
