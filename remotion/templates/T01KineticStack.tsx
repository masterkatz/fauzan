// T01 KINETIC STACK — Anton kuning/putih bersusun di tepi muka, spring overshoot + motion blur.
import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {BEATS} from '../lib/script';
import {BRoll, EndCard, FOOTAGE_BLUR_SRC, Flash, Footage, Music, Packshot, Sfx} from '../lib/common';
import {KineticBlock, fit} from '../lib/Stack';
import {sp, tw, useT} from '../lib/anim';

const Y = '#FFE81A';
const O = '#FF9A3C';

const Captions: React.FC = () => {
  const t = useT();
  const {hook, tips, product} = BEATS;
  const side = (i: number) => (i % 2 === 0 ? {left: 40, width: 480, align: 'flex-start' as const} : {left: 470, width: 470, align: 'flex-end' as const});
  const st = tips[2];
  return (
    <AbsoluteFill>
      <KineticBlock
        t0={hook.t} t1={hook.end} left={60} top={1000} width={880}
        lines={[
          {at: 0.2, text: hook.small, size: 66, color: '#fff', font: 'serif'},
          {at: 1.1, text: hook.key, size: 250, color: Y},
          {at: 1.9, text: hook.rest, size: fit(hook.rest, 120, 880), color: '#fff'},
        ]}
      />
      {tips.slice(0, 2).map((b, i) => {
        const s = side(i);
        const [w1, w2] = b.key.split(' ');
        return (
          <KineticBlock
            key={i} t0={b.t} t1={b.end} left={s.left} top={1010} width={s.width} align={s.align}
            lines={[
              {at: b.t, text: b.lead, size: 64, color: '#fff', font: 'serif'},
              {at: b.t + 0.45, text: w1, size: fit(w1, 120, s.width), color: '#fff'},
              {at: b.t + 0.8, text: w2, size: fit(w2, 210, s.width), color: i ? O : Y},
              {at: b.t + 1.7, text: b.sub, size: 52, color: '#fff', font: 'serif'},
            ]}
          />
        );
      })}
      <KineticBlock
        t0={st.t} t1={st.end} left={60} top={760} width={960}
        lines={[
          {at: st.t, text: st.lead, size: 70, color: '#fff', font: 'serif'},
          {at: st.t + 0.5, text: 'CUBA', size: 200, color: '#fff'},
          {at: st.t + 0.9, text: 'SENDIRI', size: 230, color: Y},
        ]}
      />
      <KineticBlock
        t0={product.t} t1={product.end} left={40} top={1020} width={480} align="flex-start"
        lines={[
          {at: product.t, text: product.lead, size: 56, color: '#fff', font: 'serif'},
          {at: product.t + 0.6, text: 'PRODUK', size: 150, color: '#fff'},
          {at: product.t + 0.9, text: 'KAU', size: 230, color: Y},
        ]}
      />
    </AbsoluteFill>
  );
};

// tip 3 = "statement": latar blur gelap + teks tengah besar (footage pre-blur, jimat render)
const StatementBg: React.FC = () => {
  const t = useT();
  const st = BEATS.tips[2];
  const o = Math.min(tw(t, st.t, st.t + 0.2), 1 - tw(t, st.end - 0.2, st.end));
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <OffthreadVideo src={staticFile(FOOTAGE_BLUR_SRC)} muted style={{width: 1080, height: 1920}} />
      <AbsoluteFill style={{background: 'rgba(10,8,6,.4)'}} />
    </AbsoluteFill>
  );
};

const Sticker: React.FC = () => {
  const t = useT();
  const {t: a, end: b} = BEATS.product;
  if (t < a + 0.3 || t > b) return null;
  const p = sp(t, a + 0.3, {damping: 10, stiffness: 180});
  const o = 1 - tw(t, b - 0.15, b);
  return (
    <div style={{position: 'absolute', left: 560, top: 960, transform: `scale(${0.4 + 0.6 * p}) rotate(${-14 + 8 * p}deg)`, opacity: Math.min(p * 2, o)}}>
      <div style={{background: '#fff', borderRadius: 30, padding: 18, boxShadow: '0 18px 40px rgba(0,0,0,.4)'}}>
        <Packshot w={300} />
      </div>
    </div>
  );
};

const BRollCap: React.FC = () => {
  const {broll} = BEATS;
  return (
    <KineticBlock
      t0={broll.t} t1={broll.end} left={60} top={1240} width={880}
      lines={[
        {at: broll.t + 0.1, text: broll.line, size: 64, color: '#fff', font: 'serif'},
        {at: broll.t + 0.9, text: broll.key, size: fit(broll.key, 140, 880), color: Y},
      ]}
    />
  );
};

export const T01KineticStack: React.FC = () => {
  const {broll, tips, product, end} = BEATS;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Footage grade="contrast(1.06) saturate(1.08)" />
      <Sequence from={Math.round(broll.t * 30)} durationInFrames={Math.round((broll.end - broll.t) * 30)}>
        <BRoll />
      </Sequence>
      <StatementBg />
      <CameraMotionBlur shutterAngle={200} samples={4}>
        <Captions />
        <BRollCap />
        <Sticker />
      </CameraMotionBlur>
      <Flash at={[broll.t, broll.end]} max={0.55} />
      <Flash at={[end.t]} max={0.7} />
      <EndCard
        s={{
          shade: 'linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.72))',
          title: {fontFamily: 'Anton', fontSize: 150, lineHeight: 0.95, color: Y, textShadow: '0 8px 26px rgba(0,0,0,.5)'},
          sub: {fontFamily: 'DMSerif', fontStyle: 'italic', fontSize: 64, color: '#fff', marginTop: 14},
        }}
      />
      <Music f="pop" />
      <Sfx f="hit" at={1.1} v={0.4} />
      {tips.map((b) => <Sfx key={b.t} f="whoosh-soft" at={b.t - 0.03} v={0.3} />)}
      <Sfx f="whoosh" at={broll.t - 0.12} v={0.35} />
      <Sfx f="magic" at={product.t + 0.3} v={0.4} />
      <Sfx f="whoosh" at={end.t - 0.05} v={0.45} />
      <Sfx f="bell" at={end.t + 0.85} v={0.4} />
    </AbsoluteFill>
  );
};

