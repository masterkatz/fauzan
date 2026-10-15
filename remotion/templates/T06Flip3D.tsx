// T06 3D FLIP — nombor & kad teks berputar 3D, kamera parallax pada footage, transisi kiub ke b-roll.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BEATS, CUTS} from '../lib/script';
import {BRoll, EndCard, Footage, Music, Packshot, Sfx} from '../lib/common';
import {fit} from '../lib/Stack';
import {E, sp, tw, useT} from '../lib/anim';

const {hook, tips, broll, product, end} = BEATS;
const BL = '#2D5BFF';
const PER = 1400;

// teks 3D "extrude": lapisan text-shadow bertingkat
const extrude = (n: number, col: string) =>
  Array.from({length: n}, (_, i) => `${i + 1}px ${i + 1}px 0 ${col}`).join(',') + ', 0 30px 40px rgba(0,0,0,.45)';

// Kamera: footage condong rotateY sikit setiap cut (parallax)
const CamFootage: React.FC = () => {
  const t = useT();
  let idx = 0;
  CUTS.forEach((c, i) => {
    if (t >= c) idx = i;
  });
  const dir = idx % 2 ? 1 : -1;
  const p = tw(t, CUTS[idx], CUTS[idx] + 0.6, 0, 1, E.out(E.cubic));
  const ry = dir * (5 - 3 * p);
  return (
    <AbsoluteFill style={{perspective: PER}}>
      <AbsoluteFill style={{transform: `rotateY(${ry}deg) scale(1.08)`}}>
        <Footage grade="contrast(1.05) saturate(.95)" zoom={1.1} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Transisi kiub: footage pusing keluar, b-roll pusing masuk
const Cube: React.FC = () => {
  const t = useT();
  const a = broll.t;
  const b = broll.end;
  if (t < a - 0.01 || t > b + 0.45) return null;
  const pin = tw(t, a, a + 0.45, 0, 1, E.inOut(E.cubic));
  const pout = tw(t, b, b + 0.45, 0, 1, E.inOut(E.cubic));
  const rot = -90 * (1 - pin) + 90 * pout;
  return (
    <AbsoluteFill style={{perspective: 1800, background: '#0B1230'}}>
      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `translateZ(-540px) rotateY(${rot}deg)`}}>
        <AbsoluteFill style={{transform: 'translateZ(540px)', backfaceVisibility: 'hidden'}}>
          <BRoll bg={['#0B1230', BL]} body="#13235C" cap="#8FB0FF" />
        </AbsoluteFill>
        <AbsoluteFill style={{transform: `rotateY(${pout > 0 ? 90 : -90}deg) translateZ(540px)`, backfaceVisibility: 'hidden'}}>
          <Footage grade="contrast(1.05) saturate(.95)" />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// kad flip: rotateX dari -100 ke 0 dengan spring
const FlipCard: React.FC<{at: number; out: number; children: React.ReactNode; axis?: 'X' | 'Y'; style?: React.CSSProperties}> = ({at, out, children, axis = 'X', style}) => {
  const t = useT();
  if (t < at || t > out) return null;
  const p = sp(t, at, {damping: 13, stiffness: 150});
  const o = tw(t, out - 0.3, out, 0, 1, E.in(E.cubic));
  const r = (1 - p) * -100 + o * 100;
  return (
    <div style={{perspective: PER, ...style}}>
      <div style={{transform: `rotate${axis}(${r}deg)`, transformOrigin: axis === 'X' ? 'center bottom' : 'left center', opacity: Math.min(1, p * 3) * (1 - o)}}>{children}</div>
    </div>
  );
};

const Num: React.FC<{n: string; at: number; out: number}> = ({n, at, out}) => {
  const t = useT();
  if (t < at || t > out) return null;
  const p = sp(t, at, {damping: 10, stiffness: 120});
  const o = tw(t, out - 0.3, out);
  return (
    <div style={{position: 'absolute', left: 50, top: 920, perspective: 900}}>
      <div
        style={{
          font: '400 300px Bebas', lineHeight: 0.85, color: '#fff', textShadow: extrude(18, '#1B3AB8'),
          transform: `rotateY(${(1 - p) * 180 + o * -90}deg) rotateX(${8 * Math.sin(t * 2)}deg)`, opacity: 1 - o,
        }}
      >
        {n}
      </div>
    </div>
  );
};

const card: React.CSSProperties = {background: '#fff', borderRadius: 18, padding: '6px 28px', boxShadow: '0 22px 40px rgba(10,20,60,.45)'};

const Captions: React.FC = () => {
  const t = useT();
  const hp = sp(t, 1.1, {damping: 9, stiffness: 110});
  return (
    <>
      {t < hook.end && t > 1.1 && (
        <div style={{position: 'absolute', left: 0, right: 140, top: 900, display: 'flex', justifyContent: 'center', perspective: 900}}>
          <div style={{font: '400 360px Bebas', lineHeight: 0.85, color: '#fff', textShadow: extrude(24, '#1B3AB8'), transform: `rotateY(${(1 - hp) * -270}deg) scale(${0.6 + 0.4 * hp})`, opacity: 1 - tw(t, hook.end - 0.25, hook.end)}}>3</div>
          <div style={{alignSelf: 'center', marginLeft: 20}}>
            <FlipCard at={1.4} out={hook.end}>
              <div style={{...card, font: '400 120px Bebas', color: BL, lineHeight: 1}}>TIPS</div>
            </FlipCard>
            <FlipCard at={1.9} out={hook.end} style={{marginTop: 14}}>
              <div style={{...card, background: BL, font: '400 64px Bebas', color: '#fff', letterSpacing: 2}}>PILIH PRODUK</div>
            </FlipCard>
          </div>
        </div>
      )}
      <FlipCard at={0.2} out={1.05} style={{position: 'absolute', left: 0, right: 140, top: 1180, display: 'flex', justifyContent: 'center'}}>
        <div style={{...card, font: '400 80px Bebas', color: '#111'}}>KORANG NAK TAHU?</div>
      </FlipCard>
      {tips.map((b, i) => (
        <React.Fragment key={i}>
          <Num n={b.n} at={b.t} out={b.end} />
          <FlipCard at={b.t + 0.35} out={b.end} axis="Y" style={{position: 'absolute', left: 320, top: 960}}>
            <div style={{...card, font: `400 ${fit(b.key, 110, 560, 0.42)}px Bebas`, color: BL, lineHeight: 1.05}}>{b.key}</div>
          </FlipCard>
          <FlipCard at={b.t + 1.2} out={b.end} axis="Y" style={{position: 'absolute', left: 320, top: 1110}}>
            <div style={{...card, background: BL, font: '400 54px Bebas', color: '#fff', letterSpacing: 2}}>{b.sub.toUpperCase()}</div>
          </FlipCard>
        </React.Fragment>
      ))}
      <FlipCard at={broll.t + 0.5} out={broll.end} style={{position: 'absolute', left: 0, right: 140, top: 1280, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{...card, font: '400 90px Bebas', color: BL}}>{broll.key}</div>
      </FlipCard>
      <FlipCard at={product.t} out={product.end} style={{position: 'absolute', left: 60, top: 1080}}>
        <div style={{...card, font: '400 64px Bebas', color: '#111'}}>{product.lead.toUpperCase()}</div>
      </FlipCard>
      <FlipCard at={product.t + 0.4} out={product.end} style={{position: 'absolute', left: 60, top: 1190}}>
        <div style={{...card, background: BL, font: '400 140px Bebas', color: '#fff', lineHeight: 1}}>PRODUK KAU</div>
      </FlipCard>
    </>
  );
};

const Spin: React.FC = () => {
  const t = useT();
  const a = product.t + 0.3;
  if (t < a || t > product.end) return null;
  const p = sp(t, a, {damping: 12, stiffness: 120});
  const o = 1 - tw(t, product.end - 0.25, product.end);
  return (
    <div style={{position: 'absolute', left: 640, top: 120, perspective: 1000, opacity: o}}>
      <div style={{transform: `rotateY(${(1 - p) * 360 + Math.sin(t * 2) * 15}deg) scale(${0.4 + 0.6 * p})`, filter: 'drop-shadow(0 30px 30px rgba(10,20,60,.5))'}}>
        <Packshot w={230} body="#13235C" cap="#8FB0FF" />
      </div>
    </div>
  );
};

export const T06Flip3D: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <CamFootage />
    <Cube />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,40,120,0) 50%, rgba(10,20,70,.45))'}} />
    <Spin />
    <Captions />
    <EndCard
      s={{
        shade: 'linear-gradient(180deg, rgba(20,40,140,.35), rgba(5,10,40,.85))',
        title: {font: '400 170px Bebas', lineHeight: 0.9, color: '#fff', textShadow: extrude(14, '#1B3AB8')},
        sub: {font: '400 56px Bebas', color: '#fff', background: BL, padding: '4px 26px', borderRadius: 14, marginTop: 24, letterSpacing: 2},
        logoInk: BL,
      }}
    />
    <Music f="pop" v={0.16} />
    {[1.1, ...tips.map((b) => b.t), broll.t, broll.end, product.t].map((a) => <Sfx key={a} f="swish3d" at={a - 0.05} v={0.3} />)}
    <Sfx f="hit" at={1.25} v={0.3} />
    <Sfx f="magic" at={product.t + 0.3} v={0.35} />
    <Sfx f="bell" at={end.t + 0.85} v={0.35} />
  </AbsoluteFill>
);
