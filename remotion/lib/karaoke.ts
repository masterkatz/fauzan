import {BEATS, SPEECH_END, WORDS, Word} from './script';

export type Group = {t: number; end: number; words: (Word & {next: number})[]};

// Pecah transkrip jadi kumpulan 2-4 perkataan, tak lintas beat.
export const groups = (max = 3): Group[] => {
  const bounds = [BEATS.hook.t, ...BEATS.tips.map((b) => b.t), BEATS.broll.t, BEATS.product.t, SPEECH_END];
  const out: Group[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({t: cur[0].t, end: 0, words: cur.map((w) => ({...w, next: 0}))});
    cur = [];
  };
  WORDS.forEach((w, i) => {
    const crosses = cur.length && bounds.some((b) => cur[0].t < b && w.t >= b);
    if (crosses || cur.length >= max) flush();
    cur.push(w);
    if (/[.,?]$/.test(w.w) && cur.length >= 2 && i < WORDS.length - 1) flush();
  });
  flush();
  out.forEach((g, i) => {
    g.end = i + 1 < out.length ? out[i + 1].t - 0.03 : SPEECH_END;
    g.words.forEach((w, j) => (w.next = j + 1 < g.words.length ? g.words[j + 1].t : g.end));
  });
  return out;
};
