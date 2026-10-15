// T05 CINEMATIC — letterbox, grade teal-orange, film grain, lens flare anamorphic, Cinzel fade blur-to-sharp, BWAAM.
import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile} from 'remotion';
import {BEATS} from '../lib/script';
import {BRoll, EndCard, Footage, Music, Packshot, Sfx} from '../lib/common';
import {E, inOut, tw, useT} from '../lib/anim';
import {fit} from '../lib/Stack';

const {hook, tips, broll, product, end} = BEATS;
const GOLD = '#E8C887';
const BAR = 210;
const ROMAN = ['I', 'II', 'III'];

// Film grain: 8 tile noise pra-jana (tools/gen_fx.py), pusing ikut frame.
const Grain: React.FC = () => {
  const f = Math.round(useT() * 30);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.35}}>
      <Img src={staticFile(`fx/grain_${f % 8}.png`)} style={{width: 1080, height: 1920}} />
    </AbsoluteFill>
  );
};

// Anamorphic flare: garisan biru melintang + glow, muncul pada beat
const Flare: React.FC<{at: number}> = ({at}) => {
  const t = useT();
  if (t < at || t > at + 1.4) return null;
  const p = tw(t, at, at + 1.4, 0, 1, (x) => x);
  const o = Math.sin(p * Math.PI);
  const x = -200 + p * 1500;
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', opacity: o, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, height: 8, background: 'linear-gradient(90deg, transparent, rgba(120,190,255,.9), transparent)', filter: 'blur(2px)'}} />
      <div style={{position: 'absolute', left: x - 220, top: 470, width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,230,190,.8), rgba(255,160,90,.25) 35%, transparent 65%)'}} />
      <div style={{position: 'absolute', left: 1080 - x - 50, top: 1000, width: 100, height: 100, borderRadius: '50%', border: '3px solid rgba(140,200,255,.4)'}} />
    </AbsoluteFill>
  );
};

const Title: React.FC<{t0: number; t1: number; kicker: string; main: string; sub?: string; size?: number}> = ({t0, t1, kicker, main, sub, size = 120}) => {
  const t = useT();
  if (t < t0 || t >= t1) return null;
  const o = inOut(t, t0, t1, 0.6, 0.35);
  const a = tw(t, t0 + 0.25, t0 + 1.0, 0, 1, E.out(E.quad));
  const b = tw(t, t0 + 0.7, t0 + 1.4, 0, 1, E.out(E.quad));
  return (
    <div style={{position: 'absolute', left: 50, right: 140, top: 1150, textAlign: 'center', opacity: o}}>
      <div style={{font: '700 34px Cinzel', letterSpacing: 18, color: GOLD, opacity: tw(t, t0, t0 + 0.5), textShadow: '0 2px 10px rgba(0,0,0,.8)'}}>{kicker}</div>
      <div style={{width: 120 * tw(t, t0 + 0.1, t0 + 0.8), height: 2, background: GOLD, margin: '18px auto'}} />
      <div style={{whiteSpace: 'nowrap', font: `700 ${fit(main, size, 860, 0.74)}px Cinzel`, color: '#F7F1E6', letterSpacing: 6 + (1 - a) * 30, lineHeight: 1.05, opacity: a, filter: `blur(${(1 - a) * 14}px)`, transform: `scale(${1.08 - 0.08 * a})`, textShadow: '0 6px 30px rgba(0,0,0,.6)'}}>{main}</div>
      {sub && <div style={{font: '400 40px Cinzel', color: '#E9DFCF', textShadow: '0 2px 10px rgba(0,0,0,.8)', letterSpacing: 6, marginTop: 18, opacity: b, filter: `blur(${(1 - b) * 8}px)`}}>{sub}</div>}
    </div>
  );
};

const Bars: React.FC = () => {
  const t = useT();
  const p = tw(t, 0, 0.9, 0, 1, E.inOut(E.cubic));
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: BAR * p, background: '#000'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: BAR * p, background: '#000'}} />
    </>
  );
};

// dip to black antara babak
const Dip: React.FC = () => {
  const t = useT();
  let o = 0;
  for (const a of [tips[0].t, tips[1].t, broll.t, broll.end, tips[2].t, product.t]) {
    if (t > a - 0.18 && t < a + 0.3) o = Math.max(o, t < a ? tw(t, a - 0.18, a) : 1 - tw(t, a, a + 0.3));
  }
  return <AbsoluteFill style={{background: '#000', opacity: o}} />;
};

const Product: React.FC = () => {
  const t = useT();
  const a = product.t + 0.2;
  if (t < a || t > product.end) return null;
  const p = tw(t, a, a + 1.2, 0, 1, E.out(E.cubic));
  const o = 1 - tw(t, product.end - 0.3, product.end);
  return (
    <div style={{position: 'absolute', left: 660, top: 130, opacity: p * o, transform: `translateY(${(1 - p) * 30}px)`, filter: `drop-shadow(0 0 40px rgba(232,200,135,.45)) blur(${(1 - p) * 6}px)`}}>
      <Packshot w={240} body="#1E2B2E" cap={GOLD} label="#F7F1E6" ink="#1E2B2E" />
    </div>
  );
};

export const T05Cinematic: React.FC = () => {
  const t = useT();
  const drift = 1 + t * 0.006;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${drift})`}}>
        <Footage grade="contrast(1.12) saturate(.85) sepia(.18) brightness(.95)" punch="smooth" zoom={1.06} />
      </AbsoluteFill>
      <Sequence from={Math.round(broll.t * 30)} durationInFrames={Math.round((broll.end - broll.t) * 30)}>
        <AbsoluteFill style={{filter: 'contrast(1.1) saturate(.8)'}}>
          <BRoll bg={['#0B1A1E', '#3E5F63']} body="#1E2B2E" cap={GOLD} />
        </AbsoluteFill>
      </Sequence>
      {/* teal shadows + orange highlights */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,90,110,.35), rgba(255,140,60,.18) 55%, rgba(0,70,90,.4))', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, transparent 45%, rgba(0,0,0,.6))'}} />
      <Grain />
      <Flare at={1.0} />
      <Flare at={tips[2].t} />
      <Title t0={hook.t} t1={hook.end} kicker="KORANG NAK TAHU" main="3 TIPS" sub="pilih produk yang betul" size={190} />
      {tips.map((b, i) => (
        <Title key={i} t0={b.t} t1={b.end} kicker={`BAB ${ROMAN[i]}`} main={b.key} sub={b.sub} size={108} />
      ))}
      <Title t0={broll.t} t1={broll.end} kicker={broll.line.toUpperCase()} main="CANTIK KAT IKLAN" size={100} />
      <Title t0={product.t} t1={product.end} kicker={product.lead.toUpperCase()} main="PRODUK KAU" sub="hari-hari" size={120} />
      <Product />
      <Dip />
      <Bars />
      <EndCard
        s={{
          shade: 'linear-gradient(180deg, rgba(0,0,0,.5), rgba(0,0,0,.85))',
          title: {font: '700 120px Cinzel', color: GOLD, letterSpacing: 6, textShadow: '0 8px 30px rgba(0,0,0,.6)'},
          sub: {font: '400 44px Cinzel', color: '#E9DFCF', letterSpacing: 6, marginTop: 14},
          bgFilter: 'brightness(.5) sepia(.3)',
          logoBg: '#11181A',
          logoInk: GOLD,
        }}
      >
        <Bars />
      </EndCard>
      <Music f="dark" v={0.18} vEnd={0.32} />
      <Sfx f="boom" at={1.05} v={0.55} />
      {tips.map((b) => <Sfx key={b.t} f="hit" at={b.t + 0.25} v={0.3} />)}
      <Sfx f="riser" at={broll.t - 1.3} v={0.25} />
      <Sfx f="whoosh-soft" at={product.t} v={0.25} />
      <Sfx f="boom" at={end.t + 0.3} v={0.45} />
      <Sfx f="bell" at={end.t + 0.85} v={0.25} />
    </AbsoluteFill>
  );
};


