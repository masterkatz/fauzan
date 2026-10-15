import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

const F: [string, string, string?, string?][] = [
  ['Anton', 'anton-latin-400-normal.woff2'],
  ['Poppins', 'poppins-latin-400-normal.woff2', '400'],
  ['Poppins', 'poppins-latin-600-normal.woff2', '600'],
  ['Poppins', 'poppins-latin-700-normal.woff2', '700'],
  ['Poppins', 'poppins-latin-800-normal.woff2', '800'],
  ['Poppins', 'poppins-latin-900-normal.woff2', '900'],
  ['Playfair', 'playfair-display-latin-700-italic.woff2', '700', 'italic'],
  ['Playfair', 'playfair-display-latin-800-italic.woff2', '800', 'italic'],
  ['Playfair', 'playfair-display-latin-900-normal.woff2', '900', 'normal'],
  ['DMSerif', 'dm-serif-display-latin-400-italic.woff2', '400', 'italic'],
  ['SpaceMono', 'space-mono-latin-400-normal.woff2', '400'],
  ['SpaceMono', 'space-mono-latin-700-normal.woff2', '700'],
  ['Marker', 'permanent-marker-latin-400-normal.woff2'],
  ['Caveat', 'caveat-latin-700-normal.woff2', '700'],
  ['Bebas', 'bebas-neue-latin-400-normal.woff2'],
  ['Cinzel', 'cinzel-latin-400-normal.woff2', '400'],
  ['Cinzel', 'cinzel-latin-700-normal.woff2', '700'],
  ['Monoton', 'monoton-latin-400-normal.woff2'],
  ['Abril', 'abril-fatface-latin-400-normal.woff2'],
  ['Oswald', 'oswald-latin-700-normal.woff2', '700'],
  ['Montserrat', 'montserrat-latin-500-normal.woff2', '500'],
  ['Montserrat', 'montserrat-latin-900-normal.woff2', '900'],
];

export const fontsReady = Promise.all(
  F.map(([family, file, weight, style]) =>
    loadFont({family, url: staticFile(`fonts/${file}`), weight: weight ?? '400', style: style ?? 'normal'}),
  ),
);
