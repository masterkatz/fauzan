// T08 EDITORIAL — gaya majalah: masthead serif, potongan kertas koyak + tape, polaroid produk.
import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile} from 'remotion';
import {BEATS} from '../lib/script';
import {BRoll, EndCard, Footage, Music, Packshot, Sfx} from '../lib/common';
import {fit} from '../lib/Stack';
import {E, rnd, sp, tw, useT} from '../lib/anim';

const {hook, tips, broll, product, end} = BEATS;
const PAPER = '#F4EEE3';
const INK = '#161412';
const RED = '#C8322B';

// tepi kertas koyak (clip-path polygon bergerigi)
const torn = (seed: number) => {
  const pts: string[] = [];
  const n = 26;
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${rnd(seed + i) * 5}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${95 + rnd(seed + 40 + i) * 5}%`);
  return `polygon(${pts.join(',')})`;
};

const Tape: React.FC<{style: React.CSSProperties}> = ({style}) => (
  <div style={{position: 'absolute', width: 120, height: 42, background: 'rgba(235,222,190,.82)', boxShadow: '0 2px 4px rgba(0,0,0,.15)', ...style}} />
);

const Strip: React.FC<{at: number; out: number; rot: number; seed: number; children: React.ReactNode; style: React.CSSProperties; from?: 'L' | 'R'}> = ({at, out, rot, seed, children, style, from = 'L'}) => {
  const t = useT();
  if (t < at || t > out) return null;
  const p = sp(t, at, {damping: 15, stiffness: 140});
  const o = tw(t, out - 0.2, out, 0, 1, E.in(E.cubic));
  const dx = (from === 'L' ? -1 : 1) * (1 - p) * 900;
  return (
    <div style={{position: 'absolute', transform: `translateX(${dx}px) rotate(${rot}deg)`, opacity: 1 - o, ...style}}>
      <div style={{background: PAPER, clipPath: torn(seed), padding: '26px 40px', filter: 'drop-shadow(0 10px 14px rgba(0,0,0,.35))'}}>{children}</div>
      <Tape style={{left: -30, top: -12, transform: 'rotate(-28deg)'}} />
      <Tape style={{right: -30, bottom: -8, transform: 'rotate(-24deg)'}} />
    </div>
  );
};

const Label: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = RED}) => (
  <div style={{font: '500 30px Montserrat', letterSpacing: 9, color, textTransform: 'uppercase'}}>{children}</div>
);

const Masthead: React.FC = () => {
  const t = useT();
  if (t > hook.end) return null;
  const p = tw(t, 0.1, 0.8, 0, 1, E.out(E.cubic));
  const o = 1 - tw(t, hook.end - 0.25, hook.end);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', opacity: o}}>
      <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 70px', opacity: p}}>
        <Label color="#fff">Edisi 01</Label>
        <Label color="#fff">Panduan Produk</Label>
      </div>
      <div style={{height: 3, background: '#fff', margin: '14px 70px', transform: `scaleX(${p})`}} />
      <div style={{font: '260px Abril', color: '#fff', lineHeight: 0.95, letterSpacing: -4 + (1 - p) * 40, opacity: p, textShadow: '0 6px 30px rgba(0,0,0,.35)'}}>
        3 TIPS
      </div>
    </div>
  );
};

const Polaroid: React.FC = () => {
  const t = useT();
  const a = product.t + 0.3;
  if (t < a || t > product.end) return null;
  const p = sp(t, a, {damping: 12, stiffness: 120});
  const o = 1 - tw(t, product.end - 0.2, product.end);
  return (
    <div style={{position: 'absolute', left: 600, top: 110, opacity: o, transform: `translateY(${(1 - p) * -500}px) rotate(${8 - 3 * p}deg)`}}>
      <div style={{background: '#fff', padding: '18px 18px 70px', boxShadow: '0 18px 30px rgba(0,0,0,.4)'}}>
        <div style={{width: 280, height: 300, background: 'linear-gradient(160deg,#E9D8C4,#C9A88A)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Packshot w={150} body={INK} cap={RED} label={PAPER} ink={INK} />
        </div>
        <div style={{font: '700 46px Caveat', color: INK, textAlign: 'center', marginTop: 8}}>my daily pick ♡</div>
      </div>
      <Tape style={{left: 110, top: -18, transform: 'rotate(3deg)'}} />
    </div>
  );
};

export const T08Editorial: React.FC = () => {
  const f = Math.round(useT() * 30);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Footage grade="contrast(1.04) saturate(.88) sepia(.12)" punch="smooth" zoom={1.08} />
      <Sequence from={Math.round(broll.t * 30)} durationInFrames={Math.round((broll.end - broll.t) * 30)}>
        <BRoll bg={['#2B2420', '#C9A88A']} body={INK} cap={RED} />
      </Sequence>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,0) 25%)'}} />
      <AbsoluteFill style={{mixBlendMode: 'multiply', opacity: 0.18}}>
        <Img src={staticFile(`fx/grain_${Math.floor(f / 3) % 8}.png`)} style={{width: 1080, height: 1920}} />
      </AbsoluteFill>
      <Masthead />
      <Strip at={0.25} out={hook.end} rot={-3} seed={2} style={{left: 70, top: 1120}}>
        <div style={{font: '700 italic 62px Playfair', color: INK}}>pilih produk yang betul</div>
      </Strip>
      {tips.map((b, i) => (
        <React.Fragment key={i}>
          <Strip at={b.t} out={b.end} rot={i % 2 ? 2.5 : -2.5} seed={i * 10 + 5} from={i % 2 ? 'R' : 'L'} style={{left: i % 2 ? 230 : 60, top: 1010}}>
            <Label>Tip No. {b.n}</Label>
            <div style={{font: `${fit(b.key, 104, 640, 0.56)}px Abril`, color: INK, lineHeight: 1.05, marginTop: 6}}>{b.key.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</div>
          </Strip>
          <Strip at={b.t + 1.1} out={b.end} rot={i % 2 ? -1.5 : 1.5} seed={i * 10 + 7} from={i % 2 ? 'L' : 'R'} style={{left: i % 2 ? 90 : 300, top: 1250}}>
            <div style={{font: '700 italic 46px Playfair', color: INK}}>— {b.sub}</div>
          </Strip>
        </React.Fragment>
      ))}
      <Strip at={broll.t + 0.2} out={broll.end} rot={-2} seed={77} style={{left: 80, top: 1230, width: 780}}>
        <div style={{font: '150px Abril', color: RED, lineHeight: 0.5, height: 60}}>“</div>
        <div style={{font: '700 italic 64px Playfair', color: INK, lineHeight: 1.1}}>bukan sekadar cantik kat iklan</div>
      </Strip>
      <Strip at={product.t} out={product.end} rot={-2} seed={88} style={{left: 60, top: 1080}}>
        <Label>Pilihan Editor</Label>
        <div style={{font: '120px Abril', color: INK, lineHeight: 1}}>Produk Kau</div>
      </Strip>
      <Polaroid />
      <EndCard
        s={{
          shade: 'linear-gradient(180deg, rgba(244,238,227,.6), rgba(244,238,227,.9))',
          title: {font: '150px Abril', color: INK, lineHeight: 1},
          sub: {font: '700 italic 58px Playfair', color: RED, marginTop: 10},
          bgFilter: 'brightness(.95) sepia(.3)',
          logoBg: INK,
          logoInk: PAPER,
          arrow: RED,
        }}
      />
      <Music f="ambient" v={0.2} vEnd={0.38} />
      {[0.25, ...tips.flatMap((b) => [b.t, b.t + 1.1]), broll.t + 0.2, product.t].map((a) => <Sfx key={a} f="paper" at={a} v={0.4} />)}
      <Sfx f="shutter" at={product.t + 0.3} v={0.45} />
      <Sfx f="bell" at={end.t + 0.85} v={0.35} />
    </AbsoluteFill>
  );
};
