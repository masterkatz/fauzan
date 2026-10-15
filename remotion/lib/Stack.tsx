import React from 'react';
import {E, sp, tw, useT} from './anim';

// Satu baris dalam blok kinetic: masuk pada `at`, gaya ikut `font`.
export type Line = {at: number; text: string; size: number; color: string; font?: 'anton' | 'serif' | 'custom'; css?: React.CSSProperties};

export const fit = (text: string, size: number, maxW: number, k = 0.47) => {
  let s = size;
  while (text.length * s * k > maxW && s > 40) s -= 4;
  return s;
};

export const KineticBlock: React.FC<{
  lines: Line[];
  t0: number;
  t1: number;
  left: number;
  top: number;
  width: number;
  align?: 'center' | 'flex-start' | 'flex-end';
  shadow?: string;
}> = ({lines, t0, t1, left, top, width, align = 'center', shadow = '0 6px 22px rgba(0,0,0,.45), 0 2px 4px rgba(0,0,0,.35)'}) => {
  const t = useT();
  if (t < t0 || t >= t1) return null;
  const out = tw(t, t1 - 0.16, t1, 0, 1, E.in(E.cubic));
  return (
    <div
      style={{
        position: 'absolute', left, top, width, display: 'flex', flexDirection: 'column', alignItems: align,
        opacity: 1 - out, transform: `translateY(${-out * 18}px) scale(${1 + out * 0.06})`,
      }}
    >
      {lines.map((l, i) => {
        const at = Math.max(l.at, t0);
        if (t < at) return <div key={i} style={{height: l.size * (l.font === 'serif' ? 1.05 : 0.94)}} />;
        const p = sp(t, at, {damping: 11, stiffness: 220, mass: 0.6});
        const big = l.size >= 150;
        const isSerif = l.font === 'serif';
        const fontCss: React.CSSProperties = isSerif
          ? {fontFamily: 'DMSerif', fontStyle: 'italic', lineHeight: 1.05}
          : l.font === 'custom'
            ? {}
            : {fontFamily: 'Anton', textTransform: 'uppercase', lineHeight: 0.94, letterSpacing: 0.5};
        const sc = isSerif ? 1 : (big ? 1.7 : 1.35) - (big ? 0.7 : 0.35) * p;
        return (
          <div
            key={i}
            style={{
              fontSize: l.size, color: l.color, whiteSpace: 'nowrap', textShadow: shadow, ...fontCss, ...l.css,
              opacity: Math.min(1, p * 1.6), transformOrigin: align === 'flex-start' ? 'left center' : align === 'flex-end' ? 'right center' : 'center', transform: `translateY(${(1 - p) * (isSerif ? 24 : 40)}px) scale(${sc})`,
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};
