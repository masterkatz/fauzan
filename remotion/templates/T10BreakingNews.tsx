// T10 BREAKING NEWS — bug LIVE, lower third, ticker bergerak, wipe jalur, kotak FAKTA, news sting.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {BEATS} from '../lib/script';
import {BRoll, EndCard, Footage, Music, Packshot, Sfx} from '../lib/common';
import {fit} from '../lib/Stack';
import {E, tw, useT} from '../lib/anim';

const {hook, tips, broll, product, end} = BEATS;
const RED = '#D7262E';
const NAVY = '#0E2A47';
const OS = 'Oswald';

// wipe jalur menyerong pada masa `at`
const Wipe: React.FC<{at: number}> = ({at}) => {
  const t = useT();
  if (t < at - 0.3 || t > at + 0.35) return null;
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      {[RED, '#fff', NAVY].map((c, i) => {
        const p = tw(t, at - 0.3 + i * 0.06, at + 0.25 + i * 0.06, 0, 1, E.inOut(E.cubic));
        return <div key={i} style={{position: 'absolute', top: -400, height: 2800, width: 700, left: -1500 + p * 3300, background: c, transform: 'rotate(18deg)'}} />;
      })}
    </AbsoluteFill>
  );
};

const Bug: React.FC = () => {
  const t = useT();
  const p = tw(t, 0.2, 0.6, 0, 1, E.out(E.cubic));
  const dot = Math.floor(t * 2) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: 50, top: 80, display: 'flex', transform: `translateX(${(1 - p) * -500}px)`}}>
      <div style={{background: RED, color: '#fff', font: `700 40px ${OS}`, padding: '6px 20px', display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{width: 16, height: 16, borderRadius: 99, background: '#fff', opacity: dot ? 1 : 0.25}} /> LIVE
      </div>
      <div style={{background: '#fff', color: NAVY, font: `700 40px ${OS}`, padding: '6px 22px'}}>INFO PRODUK</div>
    </div>
  );
};

const LowerThird: React.FC<{at: number; out: number; label: string; main: string; sub?: string}> = ({at, out, label, main, sub}) => {
  const t = useT();
  if (t < at || t > out) return null;
  const a = tw(t, at, at + 0.35, 0, 1, E.out(E.cubic));
  const b = tw(t, at + 0.15, at + 0.55, 0, 1, E.out(E.cubic));
  const c = tw(t, at + 0.5, at + 0.85, 0, 1, E.out(E.cubic));
  const o = tw(t, out - 0.25, out, 0, 1, E.in(E.cubic));
  return (
    <div style={{position: 'absolute', left: 40, width: 890, top: 1160, transform: `translateX(${-o * 1000}px)`}}>
      <div style={{display: 'flex', alignItems: 'stretch'}}>
        <div style={{background: RED, color: '#fff', font: `700 64px ${OS}`, padding: '0 22px', display: 'flex', alignItems: 'center', clipPath: `inset(0 ${(1 - a) * 100}% 0 0)`}}>{label}</div>
        <div style={{flex: 1, background: '#fff', color: NAVY, font: `700 ${fit(main, 96, 620, 0.5)}px ${OS}`, padding: '4px 26px', clipPath: `inset(0 ${(1 - b) * 100}% 0 0)`, whiteSpace: 'nowrap', lineHeight: 1.2}}>{main}</div>
      </div>
      {sub && (
        <div style={{display: 'inline-block', background: NAVY, color: '#fff', font: `500 40px Montserrat`, padding: '8px 22px', clipPath: `inset(0 ${(1 - c) * 100}% 0 0)`, textTransform: 'uppercase', letterSpacing: 2}}>{sub}</div>
      )}
    </div>
  );
};

const TICK = '  •  BACA LABEL  •  TENGOK REVIEW ORANG YANG DAH PAKAI  •  CUBA SENDIRI  •  PRODUK KAU  •  TEKAN BEG KUNING';
const Ticker: React.FC = () => {
  const t = useT();
  const p = tw(t, 0.4, 0.8) * (1 - tw(t, end.t - 0.1, end.t + 0.1));
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, width: 930, top: 1430, height: 64, display: 'flex', opacity: p, overflow: 'hidden'}}>
      <div style={{background: RED, color: '#fff', font: `700 40px ${OS}`, padding: '0 22px', display: 'flex', alignItems: 'center', zIndex: 1}}>TIPS</div>
      <div style={{flex: 1, background: NAVY, position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 900 - t * 170, top: 10, font: `500 38px Montserrat`, color: '#fff', whiteSpace: 'nowrap'}}>{TICK + TICK}</div>
      </div>
    </div>
  );
};

const Fakta: React.FC = () => {
  const t = useT();
  const a = broll.t + 0.3;
  if (t < a || t > broll.end) return null;
  const p = tw(t, a, a + 0.35, 0, 1, E.out(E.back(1.6)));
  const o = 1 - tw(t, broll.end - 0.2, broll.end);
  return (
    <div style={{position: 'absolute', left: 90, right: 150, top: 1160, background: '#fff', borderLeft: `18px solid ${RED}`, padding: '20px 30px', boxShadow: '0 16px 40px rgba(0,0,0,.4)', opacity: o, transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: 'left center'}}>
      <div style={{font: `700 40px ${OS}`, color: RED, letterSpacing: 4}}>FAKTA</div>
      <div style={{font: `700 70px ${OS}`, color: NAVY, lineHeight: 1.1}}>BUKAN SEKADAR CANTIK KAT IKLAN</div>
    </div>
  );
};

const LiveBox: React.FC = () => {
  const t = useT();
  const a = product.t + 0.3;
  if (t < a || t > product.end) return null;
  const p = tw(t, a, a + 0.35, 0, 1, E.out(E.cubic));
  const o = 1 - tw(t, product.end - 0.2, product.end);
  return (
    <div style={{position: 'absolute', left: 620, top: 160, width: 300, opacity: o, clipPath: `inset(0 0 ${(1 - p) * 100}% 0)`, border: '5px solid #fff', boxShadow: '0 14px 30px rgba(0,0,0,.4)'}}>
      <div style={{height: 330, background: `linear-gradient(160deg, ${NAVY}, #1F5A8F)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Packshot w={150} body={NAVY} cap={RED} />
      </div>
      <div style={{background: RED, color: '#fff', font: `700 36px ${OS}`, textAlign: 'center', padding: 4}}>PRODUK KAU</div>
    </div>
  );
};

export const T10BreakingNews: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Footage grade="contrast(1.06) saturate(1.02)" zoom={1.1} />
    <Sequence from={Math.round(broll.t * 30)} durationInFrames={Math.round((broll.end - broll.t) * 30)}>
      <BRoll bg={[NAVY, '#3B7BC0']} body={NAVY} cap={RED} />
    </Sequence>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,0) 20%, rgba(0,0,0,0) 55%, rgba(0,0,0,.35))'}} />
    <Bug />
    <LowerThird at={hook.t + 0.3} out={hook.end} label="TERKINI" main="3 TIPS PILIH PRODUK" sub="jangan tersalah beli" />
    {tips.map((b) => (
      <LowerThird key={b.t} at={b.t} out={b.end} label={b.n} main={b.key} sub={b.sub} />
    ))}
    <Fakta />
    <LowerThird at={product.t} out={product.end} label="★" main="PRODUK KAU" sub={product.lead} />
    <LiveBox />
    <Ticker />
    <Wipe at={0.05} />
    <Wipe at={broll.t} />
    <Wipe at={end.t} />
    <EndCard
      s={{
        shade: `linear-gradient(180deg, rgba(14,42,71,.55), rgba(5,15,30,.9))`,
        title: {font: `700 150px ${OS}`, color: '#fff', lineHeight: 1, borderBottom: `14px solid ${RED}`, paddingBottom: 8},
        sub: {font: '500 46px Montserrat', color: '#fff', marginTop: 22, textTransform: 'uppercase', letterSpacing: 3},
        logoInk: NAVY,
      }}
    />
    <Music f="dark" v={0.15} vEnd={0.3} />
    <Sfx f="sting" at={0.1} v={0.45} />
    {tips.map((b) => <Sfx key={b.t} f="whoosh-soft" at={b.t} v={0.28} />)}
    <Sfx f="whoosh" at={broll.t - 0.2} v={0.35} />
    <Sfx f="click" at={broll.t + 0.3} v={0.4} />
    <Sfx f="whoosh-soft" at={product.t} v={0.28} />
    <Sfx f="whoosh" at={end.t - 0.2} v={0.35} />
    <Sfx f="sting" at={end.t + 0.6} v={0.4} />
  </AbsoluteFill>
);
