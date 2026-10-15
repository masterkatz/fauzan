// T02 SOFT LUXE — serif italic bercahaya + gradient rose gold, pill keyword, kabus, sparkle, light leak, kad naik satu-satu.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {BEATS} from '../lib/script';
import {BRoll, EndCard, Footage, Music, Packshot, Sfx} from '../lib/common';
import {E, inOut, rnd, sp, tw, useT} from '../lib/anim';

type Phrase = {t: number; end: number; l1: string; l2: {w: string; at: number; pill?: boolean}[]};

const {hook, tips, broll, product, end} = BEATS;
const PHRASES: Phrase[] = [
  {t: hook.t, end: hook.end, l1: hook.small, l2: [{w: '3 tips', at: 1.1, pill: true}, {w: 'pilih produk', at: 1.9}]},
  ...tips.map((b) => {
    const [a, c] = b.key.toLowerCase().split(' ');
    return {t: b.t, end: b.end, l1: `${b.lead} ${b.sub}`, l2: [{w: a, at: b.t + 0.5}, {w: c, at: b.t + 0.8, pill: true}]};
  }),
  {t: broll.t, end: broll.end, l1: broll.line, l2: [{w: 'cantik kat iklan', at: broll.t + 0.8, pill: true}]},
  {t: product.t, end: product.end, l1: product.lead, l2: [{w: 'produk kau', at: product.t + 0.6, pill: true}]},
];

const Phrases: React.FC = () => {
  const t = useT();
  return (
    <>
      {PHRASES.map((p, i) => {
        if (t < p.t || t >= p.end) return null;
        const o = 1 - tw(t, p.end - 0.25, p.end);
        const a = tw(t, p.t, p.t + 0.5);
        return (
          <div key={i} style={{position: 'absolute', left: 40, right: 140, top: 1270, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: o, transform: `translateY(${-(1 - o) * 12}px)`}}>
            <div
              style={{
                fontFamily: 'Playfair', fontStyle: 'italic', fontWeight: 700, fontSize: 62, color: '#fff', whiteSpace: 'nowrap',
                textShadow: '0 0 18px rgba(255,255,255,.6), 0 4px 16px rgba(0,0,0,.35)', opacity: a,
                transform: `translateY(${(1 - a) * 20}px) scale(${0.94 + 0.06 * a})`, filter: `blur(${(1 - a) * 6}px)`,
              }}
            >
              {p.l1}
            </div>
            <div style={{display: 'flex', gap: 18, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center'}}>
              {p.l2.map((w, j) => {
                const q = tw(t, w.at, w.at + 0.45, 0, 1, E.out(E.cubic));
                if (t < w.at) return null;
                const base: React.CSSProperties = {
                  fontFamily: 'Poppins', fontWeight: 800, fontSize: 84, lineHeight: 1.12, whiteSpace: 'nowrap',
                  opacity: q, transform: `translateY(${(1 - q) * 26}px) scale(${0.9 + 0.1 * q})`,
                };
                return w.pill ? (
                  <div key={j} style={{...base, color: '#fff', padding: '0 26px', borderRadius: 24, background: 'linear-gradient(135deg,#D9694C,#B8456A)', boxShadow: '0 8px 24px rgba(120,40,40,.35), 0 0 30px rgba(255,190,170,.5)'}}>
                    {w.w}
                  </div>
                ) : (
                  <div key={j} style={{...base, background: 'linear-gradient(180deg,#FFF4EC 0%,#FFC2A6 50%,#F08A6C 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 3px 3px rgba(60,20,20,.85)) drop-shadow(0 6px 14px rgba(0,0,0,.45))'}}>
                    {w.w}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

const Atmos: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 700, background: 'linear-gradient(180deg, rgba(255,250,246,.7), rgba(255,248,242,.3) 45%, rgba(255,248,242,0))'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 820, background: 'linear-gradient(0deg, rgba(60,25,22,.62), rgba(60,25,22,.35) 55%, rgba(60,25,22,0))'}} />
      {/* light leak yang bergerak */}
      <div
        style={{
          position: 'absolute', width: 1200, height: 1200, borderRadius: '50%', left: -500 + Math.sin(t * 0.4) * 300, top: -300 + Math.cos(t * 0.3) * 200,
          background: 'radial-gradient(circle, rgba(255,170,120,.45), rgba(255,120,140,0) 65%)', mixBlendMode: 'screen',
        }}
      />
      {Array.from({length: 16}).map((_, i) => {
        const y = 1900 - ((rnd(i) * 1900 + t * (40 + rnd(i + 4) * 50)) % 1900);
        const x = rnd(i + 20) * 1040 + Math.sin(t * (0.6 + rnd(i) * 0.6) + i) * 30;
        const tw2 = 0.5 + 0.5 * Math.sin(t * 3 + i);
        const s = 18 + rnd(i + 7) * 22;
        return (
          <svg key={i} viewBox="0 0 40 40" width={s} height={s} style={{position: 'absolute', left: x, top: y, opacity: 0.35 + 0.5 * tw2, filter: 'drop-shadow(0 0 6px #fff)'}}>
            <path d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0 Z" fill="#FFF6E6" />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

const CARDS = [
  {at: product.t + 0.2, body: '#B8456A', cap: '#F6D7C3'},
  {at: product.t + 0.5, body: '#7A3E8E', cap: '#F2C94C'},
  {at: product.t + 0.8, body: '#D9694C', cap: '#FFF1E6'},
];

const Cards: React.FC = () => {
  const t = useT();
  if (t < product.t || t > product.end) return null;
  return (
    <>
      {CARDS.map((c, j) => {
        const p = sp(t, c.at, {damping: 13, stiffness: 140});
        const o = 1 - tw(t, product.end - 0.25 + j * 0.03, product.end);
        const rot = (j - 1) * 7;
        const bob = Math.sin((t - c.at) * 4) * 6;
        return (
          <div
            key={j}
            style={{
              position: 'absolute', left: 540 - 125 + (j - 1) * 215, top: 110 + Math.abs(j - 1) * 30 + bob, width: 250, height: 330, borderRadius: 28,
              background: 'linear-gradient(160deg,#FFF8F2,#F6DDD0)', border: '5px solid rgba(255,255,255,.95)', boxShadow: '0 18px 40px rgba(80,30,10,.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: j === 1 ? 2 : 1,
              opacity: Math.min(p * 1.5, o), transform: `translateY(${(1 - p) * 160}px) scale(${0.55 + 0.45 * p}) rotate(${rot * (2 - p)}deg)`,
            }}
          >
            <Packshot w={150} body={c.body} cap={c.cap} />
          </div>
        );
      })}
    </>
  );
};

export const T02SoftLuxe: React.FC = () => {
  const t = useT();
  const bo = inOut(t, broll.t, broll.end, 0.35, 0.35);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Footage grade="brightness(1.07) contrast(.94) saturate(1.06) sepia(.12)" punch="smooth" zoom={1.08} />
      <Sequence from={Math.round(broll.t * 30)} durationInFrames={Math.round((broll.end - broll.t) * 30)}>
        <AbsoluteFill style={{opacity: bo, filter: `blur(${(1 - bo) * 20}px)`}}>
          <BRoll bg={['#5A2A2A', '#F2B8A0']} body="#B8456A" cap="#F6D7C3" />
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, rgba(255,240,230,.18), rgba(0,0,0,0) 60%)', mixBlendMode: 'screen'}} />
      <Atmos />
      <Cards />
      <Phrases />
      <EndCard
        s={{
          shade: 'linear-gradient(180deg, rgba(255,240,232,.35), rgba(90,40,25,.75))',
          title: {fontFamily: 'Playfair', fontStyle: 'italic', fontWeight: 800, fontSize: 130, lineHeight: 1, color: '#FFE2CF', textShadow: '0 10px 30px rgba(0,0,0,.4), 0 0 30px rgba(255,220,200,.5)'},
          sub: {fontFamily: 'Poppins', fontWeight: 700, fontSize: 40, letterSpacing: 8, color: '#fff', marginTop: 16, textTransform: 'uppercase'},
          logoInk: '#B8456A',
          cta: {background: 'linear-gradient(135deg,#FFE27A,#FFC93C)'},
        }}
      />
      <Music f="ambient" v={0.2} vEnd={0.4} />
      {[hook.t, ...tips.map((b) => b.t), broll.t, product.t].map((a) => <Sfx key={a} f="whoosh-soft" at={a} v={0.22} />)}
      <Sfx f="magic" at={CARDS[0].at} v={0.45} />
      <Sfx f="bell" at={end.t + 0.85} v={0.35} />
    </AbsoluteFill>
  );
};
