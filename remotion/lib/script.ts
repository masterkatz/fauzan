// Skrip demo yang SAMA untuk semua 10 template, supaya beza yang nampak hanya style.
// Bila guna footage sebenar, data ni datang dari Whisper (word timestamps) + plan.

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION_S = 20;

// Kedudukan muka placeholder (bila footage sebenar: dari face detect OpenCV).
export const FACE = {x: 540, y: 720, w: 300};

export type Word = {w: string; t: number; key?: boolean};

// Transkrip (anggap dari Whisper). key = keyword yang ditonjolkan.
export const WORDS: Word[] = [
  {w: 'Korang', t: 0.2}, {w: 'nak', t: 0.5}, {w: 'tahu', t: 0.7}, {w: '3', t: 1.1, key: true},
  {w: 'TIPS', t: 1.4, key: true}, {w: 'pilih', t: 1.9}, {w: 'PRODUK', t: 2.2, key: true}, {w: 'yang', t: 2.6},
  {w: 'betul?', t: 2.8},
  {w: 'First,', t: 3.2}, {w: 'baca', t: 3.7}, {w: 'LABEL', t: 4.0, key: true}, {w: 'dulu.', t: 4.5},
  {w: 'Tengok', t: 5.0}, {w: 'bahan', t: 5.4}, {w: 'UTAMA', t: 5.8, key: true}, {w: 'dia.', t: 6.3},
  {w: 'Second,', t: 6.8}, {w: 'tengok', t: 7.3}, {w: 'REVIEW', t: 7.7, key: true}, {w: 'orang', t: 8.3},
  {w: 'yang', t: 8.6}, {w: 'dah', t: 8.8}, {w: 'PAKAI.', t: 9.1, key: true},
  {w: 'Bukan', t: 10.0}, {w: 'sekadar', t: 10.3}, {w: 'cantik', t: 10.8, key: true}, {w: 'kat', t: 11.3},
  {w: 'iklan.', t: 11.5},
  {w: 'Third,', t: 12.0}, {w: 'CUBA', t: 12.5, key: true}, {w: 'SENDIRI,', t: 12.9, key: true},
  {w: 'baru', t: 13.5}, {w: 'korang', t: 13.8}, {w: 'tahu.', t: 14.1},
  {w: 'Ni', t: 14.7}, {w: 'yang', t: 14.9}, {w: 'aku', t: 15.1}, {w: 'PAKAI', t: 15.3, key: true},
  {w: 'hari-hari', t: 15.8}, {w: 'tau.', t: 16.4},
];
export const SPEECH_END = 16.8;

// Beat = satu blok caption/grafik. Template guna ni untuk susun teks.
export const BEATS = {
  hook: {t: 0.15, end: 3.05, small: 'korang nak tahu', key: '3 TIPS', rest: 'PILIH PRODUK', q: 'yang betul?'},
  tips: [
    {n: '01', t: 3.2, end: 6.65, lead: 'first,', key: 'BACA LABEL', sub: 'tengok bahan utama'},
    {n: '02', t: 6.8, end: 9.85, lead: 'second,', key: 'TENGOK REVIEW', sub: 'orang yang dah pakai'},
    {n: '03', t: 12.0, end: 14.6, lead: 'third,', key: 'CUBA SENDIRI', sub: 'baru korang tahu'},
  ],
  broll: {t: 9.9, end: 11.95, line: 'bukan sekadar', key: 'CANTIK KAT IKLAN'},
  product: {t: 14.7, end: 16.95, lead: 'ni yang aku pakai', key: 'PRODUK KAU', sub: 'hari-hari'},
  end: {t: 17.0, end: 20.0, title: 'PRODUK KAU', sub: 'cuba sendiri hari ni', cta: 'TEKAN BEG KUNING'},
};

// Jump cut (masa sumber dipotong) -> punch-in selang-seli.
export const CUTS = [0, 3.2, 6.8, 9.9, 12.0, 14.7];

export const wordsBetween = (a: number, b: number) => WORDS.filter((x) => x.t >= a - 1e-6 && x.t < b);
