// T04 GLITCH TECH — RGB split, slice displacement, shake, scanline, HUD, teks taip mono.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {noise2D} from '@remotion/noise';
import {BEATS} from '../lib/script';
import {BRoll, EndCard, Footage, Music, Packshot, Sfx} from '../lib/common';
import {fit} from '../lib/Stack';
import {rnd, sp, tw, useT} from '../lib/anim';

const {hook, tips, broll, product, end} = BEATS;
const GLITCH_AT = [0.1, 1.1, tips[0].t, tips[1].t, broll.t, broll.end, tips[2].t, product.t, end.t];
const GDUR = 0.24;
const CY = '#00F0FF';
const RD = '#FF2A55';
const GR = '#39FF88';

const gAmt = (t: number) => {
  for (const a of GLITCH_AT) if (t >= a && t < a + GDUR) return 1 - (t - a) / GDUR;
  return 0;
};

const ColorFilters: React.FC = () => (
  <svg width="0" height="0" style={{position: 'absolute'}}>
    <filter id="onlyR"><feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" /></filter>
    <filter id="onlyGB"><feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" /></filter>
  </svg>
);

const GRADE = 'contrast(1.2) saturate(.75) hue-rotate(-8deg) brightness(.95)';

// Footage dengan RGB split + slice bila glitch aktif
const GlitchFootage: React.FC = () => {
  const t = useT();
  const g = gAmt(t);
  const f = Math.round(t * 30);
  const shake = {x: noise2D('sx', t * 8, 0) * (3 + g * 26), y: noise2D('sy', t * 8, 0) * (2 + g * 12)};
  return (
    <AbsoluteFill style={{transform: `translate(${shake.x}px, ${shake.y}px) scale(1.03)`}}>
      <Footage grade={GRADE} />
      {g > 0 && (
        <>
          <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.8, transform: `translateX(${-22 * g}px)`, filter: 'url(#onlyR)'}}>
            <Footage grade={GRADE} label={false} />
          </AbsoluteFill>
          <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.8, transform: `translateX(${22 * g}px)`, filter: 'url(#onlyGB)'}}>
            <Footage grade={GRADE} label={false} />
          </AbsoluteFill>
          {[0, 1, 2, 3, 4].map((i) => {
            const y0 = rnd(f * 7 + i) * 1800;
            const h = 40 + rnd(f * 3 + i) * 140;
            return (
              <AbsoluteFill key={i} style={{clipPath: `inset(${y0}px 0 ${1920 - y0 - h}px 0)`, transform: `translateX(${(rnd(f + i * 13) - 0.5) * 160 * g}px)`}}>
                <Footage grade={`${GRADE} hue-rotate(${i * 40}deg)`} label={false} />
              </AbsoluteFill>
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};

const Overlay: React.FC = () => {
  const t = useT();
  const rec = Math.floor(t * 2) % 2 === 0;
  const tc = `00:00:${String(Math.floor(t)).padStart(2, '0')}:${String(Math.floor((t % 1) * 30)).padStart(2, '0')}`;
  const C = (s: React.CSSProperties) => <div style={{position: 'absolute', width: 70, height: 70, borderColor: CY, borderStyle: 'solid', borderWidth: 0, ...s}} />;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 2px, transparent 2px 5px)', mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,10,20,.65))'}} />
      <AbsoluteFill style={{background: `rgba(0,240,255,${0.04 + gAmt(t) * 0.15})`, mixBlendMode: 'screen'}} />
      {C({left: 40, top: 60, borderLeftWidth: 5, borderTopWidth: 5})}
      {C({right: 40, top: 60, borderRightWidth: 5, borderTopWidth: 5})}
      {C({left: 40, bottom: 140, borderLeftWidth: 5, borderBottomWidth: 5})}
      <div style={{position: 'absolute', left: 70, top: 90, font: '700 34px SpaceMono', color: '#fff', display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{width: 22, height: 22, borderRadius: 99, background: RD, opacity: rec ? 1 : 0.15}} /> REC
      </div>
      <div style={{position: 'absolute', right: 80, top: 92, font: '400 30px SpaceMono', color: CY}}>{tc}</div>
    </AbsoluteFill>
  );
};

const Typed: React.FC<{text: string; at: number; cps?: number; style: React.CSSProperties; cursor?: boolean}> = ({text, at, cps = 22, style, cursor}) => {
  const t = useT();
  if (t < at) return null;
  const n = Math.min(text.length, Math.floor((t - at) * cps) + 1);
  const done = n >= text.length;
  const jit = gAmt(t) * 8 + 2;
  return (
    <div style={{whiteSpace: 'nowrap', textShadow: `${jit}px 0 ${RD}, ${-jit}px 0 ${CY}, 0 3px 12px rgba(0,0,0,.75)`, ...style}}>
      {text.slice(0, n)}
      {cursor && (!done || Math.floor(t * 3) % 2 === 0) && <span style={{background: style.color as string, color: 'transparent', marginLeft: 6}}>_</span>}
    </div>
  );
};

const Block: React.FC<{t0: number; t1: number; children: React.ReactNode; top?: number}> = ({t0, t1, children, top = 1060}) => {
  const t = useT();
  if (t < t0 || t >= t1) return null;
  const out = tw(t, t1 - 0.12, t1);
  return (
    <div style={{position: 'absolute', left: 70, width: 860, top, display: 'flex', flexDirection: 'column', gap: 6, opacity: 1 - out, transform: `translateX(${out * 40}px) skewX(${out * -20}deg)`}}>
      {children}
    </div>
  );
};

const Captions: React.FC = () => {
  const t = useT();
  const hp = sp(t, 1.1, {damping: 8, stiffness: 300});
  return (
    <>
      <Block t0={hook.t} t1={hook.end} top={1000}>
        <Typed text={'> korang nak tahu?'} at={0.2} style={{font: '400 44px SpaceMono', color: GR}} />
        {t >= 1.1 && (
          <div style={{font: '260px Anton', lineHeight: 0.95, color: '#fff', transform: `scale(${1.6 - 0.6 * hp})`, transformOrigin: 'left center', textShadow: `${10 * (gAmt(t) + 0.3)}px 0 ${RD}, ${-10 * (gAmt(t) + 0.3)}px 0 ${CY}`}}>
            3 TIPS
          </div>
        )}
        <Typed text="PILIH PRODUK" at={1.9} cps={18} cursor style={{font: '700 76px SpaceMono', color: '#fff'}} />
      </Block>
      {tips.map((b, i) => (
        <Block key={i} t0={b.t} t1={b.end}>
          <Typed text={`// TIP_${b.n}`} at={b.t} style={{font: '700 40px SpaceMono', color: CY}} />
          <Typed text={b.key} at={b.t + 0.4} cps={16} cursor style={{font: `700 ${fit(b.key, 100, 860, 0.62)}px SpaceMono`, color: '#fff', lineHeight: 1.1}} />
          <Typed text={`> ${b.sub}`} at={b.t + 1.5} style={{font: '400 42px SpaceMono', color: GR}} />
        </Block>
      ))}
      <Block t0={broll.t} t1={broll.end} top={1240}>
        <Typed text={`> ${broll.line}`} at={broll.t + 0.1} style={{font: '400 44px SpaceMono', color: GR}} />
        <Typed text={broll.key} at={broll.t + 0.6} cps={20} cursor style={{font: '700 70px SpaceMono', color: '#fff'}} />
      </Block>
      <Block t0={product.t} t1={product.end}>
        <Typed text={`> ${product.lead}`} at={product.t} style={{font: '400 44px SpaceMono', color: GR}} />
        <Typed text="PRODUK_KAU.exe" at={product.t + 0.5} cps={20} cursor style={{font: '700 76px SpaceMono', color: '#fff'}} />
      </Block>
    </>
  );
};

const Scan: React.FC = () => {
  const t = useT();
  const a = product.t + 0.3;
  if (t < a || t > product.end) return null;
  const p = tw(t, a, a + 0.25);
  const scan = ((t - a) / 1.2) % 1;
  const pct = Math.min(100, Math.floor(tw(t, a, a + 1.3) * 100));
  const o = 1 - tw(t, product.end - 0.15, product.end);
  return (
    <div style={{position: 'absolute', left: 610, top: 150, width: 310, height: 400, border: `4px solid ${CY}`, background: 'rgba(0,30,40,.55)', opacity: p * o, transform: `scaleY(${p})`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Packshot w={180} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: scan * 400, height: 6, background: CY, boxShadow: `0 0 24px 6px ${CY}`}} />
      <div style={{position: 'absolute', left: 12, bottom: 10, font: '700 28px SpaceMono', color: CY}}>SCAN {pct}%</div>
    </div>
  );
};

export const T04GlitchTech: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <ColorFilters />
    <GlitchFootage />
    <Sequence from={Math.round(broll.t * 30)} durationInFrames={Math.round((broll.end - broll.t) * 30)}>
      <AbsoluteFill style={{filter: 'contrast(1.2) saturate(.7) hue-rotate(160deg)'}}>
        <BRoll bg={['#02121A', '#0B5E6E']} body="#0E2A33" cap={CY} />
      </AbsoluteFill>
    </Sequence>
    <Overlay />
    <Scan />
    <Captions />
    <EndCard
      s={{
        shade: 'linear-gradient(180deg, rgba(0,20,30,.55), rgba(0,0,0,.85))',
        title: {fontFamily: 'Anton', fontSize: 150, lineHeight: 0.95, color: '#fff', textShadow: `7px 0 ${RD}, -7px 0 ${CY}`},
        sub: {font: '400 46px SpaceMono', color: GR, marginTop: 16},
        bgFilter: 'brightness(.6) saturate(.5) hue-rotate(160deg)',
        logoBg: '#0B1418',
        logoInk: CY,
      }}
    />
    <Music f="dark" v={0.2} />
    {GLITCH_AT.filter((a) => a !== broll.end).map((a) => <Sfx key={a} f="glitch" at={a} v={0.28} />)}
    <Sfx f="hit" at={1.1} v={0.45} />
    {tips.map((b) => <Sfx key={b.t} f="blips" at={b.t + 0.4} v={0.22} />)}
    <Sfx f="riser" at={product.t - 1.25} v={0.25} />
    <Sfx f="bell" at={end.t + 0.85} v={0.3} />
  </AbsoluteFill>
);
