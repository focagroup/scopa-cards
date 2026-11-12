'use strict';
/*
 * Writes the vector card skins:
 *   skins/alternative/  - the hand-drawn Napoletane-style cards (from napoletane_cards.js)
 *   skins/milanese/     - French-suited Milanese cards, pip cards A and 2-10 (no face cards)
 *                         Quadri = Denari, Cuori = Coppe, Picche = Spade, Fiori = Bastoni
 *   skins/originale/back.svg - back for the scanned originale deck
 * File names are the same in every skin: <denari|coppe|spade|bastoni>_<01..10>.<ext>, back.svg
 *
 * Usage: node tools/gen_skins.js skins
 */
const fs = require('fs');
const path = require('path');
const nap = require('./napoletane_cards.js');

const SUIT_FILE = ['denari', 'coppe', 'spade', 'bastoni'];
const fileName = (id, ext) => `${SUIT_FILE[Math.floor(id / 10)]}_${String(id % 10 + 1).padStart(2, '0')}.${ext}`;
const out = process.argv[2] || 'skins';

function write(dir, name, svg) {
  fs.mkdirSync(path.join(out, dir), {recursive: true});
  fs.writeFileSync(path.join(out, dir, name), svg.replace(/\n\s+/g, '\n').trim() + '\n');
}

// ------------------------------------------------------------------ alternative (existing look)

const napDefs = nap.CARD_DEFS.match(/<defs>[\s\S]*<\/defs>/)[0];
function standalone(svg) {
  // Inline the shared symbol definitions so every file renders on its own.
  let s = svg.replace(/(<svg[^>]*>)/, `$1${napDefs}`);
  if (!/xmlns:xlink/.test(s.slice(0, s.indexOf('>')))) s = s.replace('<svg ', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ');
  return s;
}
for (let id = 0; id < 40; id++) write('alternative', fileName(id, 'svg'), standalone(nap.cardSVG(id)));
write('alternative', 'back.svg', standalone(nap.backSVG()));

// ------------------------------------------------------------------ milanese (French suits)

const W = 100, H = 150;
const RED = '#c8102e', BLACK = '#161616', BLUE = '#1f4fa3';
// Suit shapes centred on 0,0 within roughly -10..10.
const SHAPE = {
  quadri: 'M0,-11 Q3.2,-4.5 8,0 Q3.2,4.5 0,11 Q-3.2,4.5 -8,0 Q-3.2,-4.5 0,-11Z',
  cuori: 'M0,9.5 C-6,4.5 -10.5,0.5 -10.5,-4.5 C-10.5,-8.2 -7.8,-10.5 -5,-10.5 C-2.6,-10.5 -0.9,-9 0,-6.8 C0.9,-9 2.6,-10.5 5,-10.5 C7.8,-10.5 10.5,-8.2 10.5,-4.5 C10.5,0.5 6,4.5 0,9.5Z',
  picche: 'M0,-10.5 C-6,-5.5 -10.5,-1.5 -10.5,2.8 C-10.5,6.3 -8,8 -5.3,8 C-3.3,8 -1.6,7 -0.7,5.6 C-0.9,8 -2,9.8 -3.6,11 L3.6,11 C2,9.8 0.9,8 0.7,5.6 C1.6,7 3.3,8 5.3,8 C8,8 10.5,6.3 10.5,2.8 C10.5,-1.5 6,-5.5 0,-10.5Z',
};
// Clubs (fiori) are drawn from circles in suitShape().
function suitShape(s, x, y, sc, rot) {
  const name = ['quadri', 'cuori', 'picche', 'fiori'][s];
  const col = s <= 1 ? RED : BLACK;
  const tf = `translate(${x},${y}) scale(${sc})${rot ? ' rotate(180)' : ''}`;
  if (name === 'fiori') {
    return `<g transform="${tf}" fill="${col}"><circle cx="0" cy="-5.6" r="4.7"/><circle cx="-5.3" cy="1.6" r="4.7"/><circle cx="5.3" cy="1.6" r="4.7"/>` +
      `<path d="M-1.6,-1 L1.6,-1 L1.6,1 C1.2,6 2.2,9 3.8,11 L-3.8,11 C-2.2,9 -1.2,6 -1.6,1Z"/><circle cx="0" cy="0" r="2.6"/></g>`;
  }
  return `<path transform="${tf}" d="${SHAPE[name]}" fill="${col}"/>`;
}

const PIPS = {
  2: [[50, 34, 0], [50, 116, 1]],
  3: [[50, 34, 0], [50, 75, 0], [50, 116, 1]],
  4: [[31, 34, 0], [69, 34, 0], [31, 116, 1], [69, 116, 1]],
  5: [[31, 34, 0], [69, 34, 0], [50, 75, 0], [31, 116, 1], [69, 116, 1]],
  6: [[31, 34, 0], [69, 34, 0], [31, 75, 0], [69, 75, 0], [31, 116, 1], [69, 116, 1]],
  7: [[31, 34, 0], [69, 34, 0], [50, 54.5, 0], [31, 75, 0], [69, 75, 0], [31, 116, 1], [69, 116, 1]],
  8: [[31, 34, 0], [69, 34, 0], [50, 54.5, 0], [31, 75, 0], [69, 75, 0], [50, 95.5, 1], [31, 116, 1], [69, 116, 1]],
  9: [[31, 34, 0], [69, 34, 0], [31, 61.3, 0], [69, 61.3, 0], [50, 75, 0], [31, 88.7, 1], [69, 88.7, 1], [31, 116, 1], [69, 116, 1]],
  10: [[31, 34, 0], [69, 34, 0], [50, 47.7, 0], [31, 61.3, 0], [69, 61.3, 0], [31, 88.7, 1], [69, 88.7, 1], [50, 102.3, 1], [31, 116, 1], [69, 116, 1]],
};
const PIP_SCALE = {8: 1.0, 9: 0.92, 10: 0.92};
const RANK_TXT = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

function milaneseSVG(id) {
  const s = Math.floor(id / 10), r = id % 10 + 1;
  const col = s <= 1 ? RED : BLACK;
  let body = '';
  if (r === 1) {
    body = suitShape(s, 50, 75, s === 0 ? 3.0 : 2.6, 0);
  } else {
    const sc = PIP_SCALE[r] || 1.05;
    body = PIPS[r].map(([x, y, rot]) => suitShape(s, x, y, sc, rot)).join('');
  }
  const idx = `<text x="9.5" y="16" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-weight="bold" font-size="${r === 10 ? 11.5 : 13}" fill="${col}">${RANK_TXT[r]}</text>${suitShape(s, 9.5, 24, 0.42, 0)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
    <rect x=".75" y=".75" width="98.5" height="148.5" rx="6" fill="#fffef9" stroke="#2a2a2a" stroke-width="1.5"/>
    ${body}
    ${idx}
    <g transform="rotate(180 50 75)">${idx}</g>
  </svg>`;
}

function milaneseBack() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
    <defs><pattern id="mb" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="${BLUE}"/><path d="M4,0 L8,4 L4,8 L0,4Z" fill="none" stroke="#9db7e6" stroke-width=".7"/>
      <circle cx="4" cy="4" r=".8" fill="#ffffff"/></pattern></defs>
    <rect x=".75" y=".75" width="98.5" height="148.5" rx="6" fill="#ffffff" stroke="#2a2a2a" stroke-width="1.5"/>
    <rect x="6" y="6" width="88" height="138" rx="3" fill="url(#mb)"/>
    <rect x="6" y="6" width="88" height="138" rx="3" fill="none" stroke="#0f2a66" stroke-width="1.2"/>
  </svg>`;
}

for (let id = 0; id < 40; id++) write('milanese', fileName(id, 'svg'), milaneseSVG(id));
write('milanese', 'back.svg', milaneseBack());

// ------------------------------------------------------------------ originale back (scan has none)

write('originale', 'back.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
  <defs><pattern id="ob" width="22" height="22" patternUnits="userSpaceOnUse">
    <rect width="22" height="22" fill="#a3201f"/>
    <path d="M11,1 L21,11 L11,21 L1,11Z" fill="none" stroke="#e8c15a" stroke-width="1.6"/>
    <circle cx="11" cy="11" r="3" fill="#1d3f8a" stroke="#e8c15a" stroke-width="1"/></pattern></defs>
  <rect x="2" y="2" width="316" height="508" rx="16" fill="#fcfcfc" stroke="#b9b2a0" stroke-width="2"/>
  <rect x="16" y="16" width="288" height="480" rx="8" fill="url(#ob)"/>
  <rect x="16" y="16" width="288" height="480" rx="8" fill="none" stroke="#1d3f8a" stroke-width="5"/>
</svg>`);

console.log('wrote skins/alternative, skins/milanese, skins/originale/back.svg');
