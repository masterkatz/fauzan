// T03 BOLD POP — caption karaoke 2-3 perkataan, pill warna pada perkataan aktif, scribble underline keyword, hook box, PIP, flash.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {BEATS} from '../lib/script';
import {BRoll, EndCard, Flash, Footage, Music, Packshot, Sfx} from '../lib/common';
import {groups} from '../lib/karaoke';
import {sp, tw, useT} from '../lib/anim';

const COLS = ['#FFD233', '#FF4F8B', '#4FE3C1'];
const G = groups(3);
const {hook, broll, product, end} = BEATS;

const Karaoke: React.FC = () => {
  const t = useT();
  const gi = G.findIndex((g) => t >= g.t && t < g.end);
  if (gi < 0 || t >= end.t) return null;
  const g = G[gi];
  const col = COLS[gi % 3];
  return (
    <div style={{position: 'absolute', left: 50, right: 150, top: 1180, height: 300, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: '6px 14px'}}>
      {g.words.map((w, wi) => {
        if (t < w.t) return null;
        const p = sp(t, w.t, {damping: 9, stiffness: 260, mass: 0.5});
        const active = t < w.next - 0.02;
        const word = w.w.replace(/[.,?]$/, '').toUpperCase();
        const ul = tw(t, w.t + 0.08, w.t + 0.33);
        return (
          <div
            key={wi}
            style={{
              position: 'relative', font: '900 84px Poppins', lineHeight: 1.15, padding: '0 14px', borderRadius: 18, whiteSpace: 'nowrap',
              transform: `scale(${0.5 + 0.5 * p}) translateY(${(1 - p) * 20}px) rotate(${w.key ? (1 - p) * -6 : 0}deg)`,
              background: active ? col : 'transparent',
              color: active ? '#111' : w.key ? col : '#fff',
              WebkitTextStroke: active ? '0px' : '12px #111', paintOrder: 'stroke fill',
            }}
          >
            {word}
            {w.key && (
              <svg viewBox="0 0 200 34" preserveAspectRatio="none" style={{position: 'absolute', left: '-4%', width: '108%', bottom: -20, height: 34, overflow: 'visible'}}>
                <path d="M4 22 C 50 6, 120 34, 196 12" fill="none" stroke={col} strokeWidth="9" strokeLinecap="round" strokeDasharray="240" strokeDashoffset={240 * (1 - ul)} />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};

const HookBox: React.FC = () => {
  const t = useT();
  if (t > hook.end) return null;
  const p = sp(t, 0.05, {damping: 10, stiffness: 170});
  const o = 1 - tw(t, hook.end - 0.25, hook.end);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 95, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: Math.min(p, o), transform: `translateY(${(1 - p) * -60 - (1 - o) * 80}px) scale(${0.8 + 0.2 * p})`}}>
      <div style={{background: '#FF4F8B', color: '#fff', font: '900 42px Poppins', padding: '8px 28px', borderRadius: 999, transform: 'rotate(-3deg)'}}>3 TIPS PENTING</div>
      <div style={{background: '#fff', color: '#1a1a1a', font: '900 54px Poppins', lineHeight: 1.05, padding: '20px 36px', borderRadius: 26, textAlign: 'center', boxShadow: '0 14px 34px rgba(0,0,0,.3)'}}>
        Nak pilih produk
        <br />
        <span style={{color: '#FF4F8B'}}>yang betul?</span>
      </div>
    </div>
  );
};

const Pip: React.FC = () => {
  const t = useT();
  const a = product.t + 0.5;
  if (t < a || t > product.end) return null;
  const p = sp(t, a, {damping: 10, stiffness: 200});
  const o = 1 - tw(t, product.end - 0.2, product.end);
  return (
    <div
      style={{
        position: 'absolute', left: 600, top: 130, width: 320, height: 400, borderRadius: 30, overflow: 'hidden', border: '7px solid #fff',
        boxShadow: '0 18px 40px rgba(0,0,0,.4)', background: 'radial-gradient(circle,#FFE88A,#FF9F43)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: Math.min(p * 2, o), transform: `scale(${0.3 + 0.7 * p}) rotate(${20 - 14 * p}deg)`,
      }}
    >
      <Packshot w={190} />
    </div>
  );
};

export const T03BoldPop: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Footage grade="contrast(1.15) saturate(1.3)" zoom={1.14} />
    <Sequence from={Math.round(broll.t * 30)} durationInFrames={Math.round((broll.end - broll.t) * 30)}>
      <BRoll bg={['#FF4F8B', '#FFD233']} />
    </Sequence>
    <HookBox />
    <Pip />
    <Karaoke />
    <Flash at={[broll.t, broll.end, product.t + 0.5]} max={0.6} />
    <Flash at={[end.t]} />
    <EndCard
      s={{
        shade: 'linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.7))',
        title: {font: '900 120px Poppins', lineHeight: 1, color: '#fff', WebkitTextStroke: '14px #111', paintOrder: 'stroke fill'},
        sub: {font: '900 50px Poppins', color: '#111', background: '#4FE3C1', padding: '6px 26px', borderRadius: 16, marginTop: 20, transform: 'rotate(-2deg)'},
      }}
    />
    <Music f="playful" v={0.17} />
    <Sfx f="whoosh-soft" at={0.05} v={0.3} />
    <Sfx f="whoosh" at={broll.t - 0.12} v={0.35} />
    <Sfx f="shutter" at={product.t + 0.5} v={0.5} />
    <Sfx f="whoosh" at={end.t - 0.05} v={0.4} />
    <Sfx f="bell" at={end.t + 0.85} v={0.4} />
  </AbsoluteFill>
);
