import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 0..1 spring bermula pada masa t0 (saat)
export const sp = (t: number, t0: number, cfg: {damping?: number; stiffness?: number; mass?: number} = {}) =>
  spring({frame: Math.round((t - t0) * 30), fps: 30, config: {damping: 12, stiffness: 160, mass: 0.7, ...cfg}});

// interpolate masa -> nilai dengan easing
export const tw = (t: number, t0: number, t1: number, a = 0, b = 1, ease: (x: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(t, [t0, t1], [a, b], {...CL, easing: ease});

export const between = (t: number, a: number, b: number) => t >= a && t < b;

// masuk + keluar: 0 -> 1 -> 0
export const inOut = (t: number, a: number, b: number, fin = 0.25, fout = 0.2) =>
  Math.min(tw(t, a, a + fin), 1 - tw(t, b - fout, b, 0, 1, Easing.in(Easing.cubic)));

export const E = Easing;

// deterministik pseudo-random
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
