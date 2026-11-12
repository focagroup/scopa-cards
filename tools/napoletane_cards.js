'use strict';
// Generator for the "alternative" skin (hand-drawn Napoletane style). Run via tools/gen_skins.js.
/*
 * Napoletane-style card faces drawn as inline SVG (no image files, no network).
 * Card id = suit * 10 + rank - 1. Suits: 0 Denari, 1 Coppe, 2 Spade, 3 Bastoni.
 */
const SUIT_SYM = ['den', 'cop', 'spa', 'bas'];
const SUIT_LABEL = ['Denari', 'Coppe', 'Spade', 'Bastoni'];
const RANK_LABEL = ['', 'Asso', '2', '3', '4', '5', '6', '7', 'Fante', 'Cavallo', 'Re'];
const cardRank = id => id % 10 + 1;
const cardSuit = id => Math.floor(id / 10);
const cardName = id => RANK_LABEL[cardRank(id)] + ' ' + SUIT_LABEL[cardSuit(id)];

const GOLD = '#e3b23c', GOLD_L = '#f3d36b', INK = '#4a2c06', RED = '#b8282e', GREEN = '#2f7a3b', BLUE = '#2a5caa';

const CARD_DEFS = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<defs>
  <g id="s-den">
    <circle r="18" fill="${GOLD}" stroke="${INK}" stroke-width="1.4"/>
    <circle r="14.5" fill="${RED}" stroke="${INK}" stroke-width=".8"/>
    <circle r="11.5" fill="${GOLD_L}" stroke="${INK}" stroke-width=".8"/>
    <g fill="${GREEN}" stroke="${INK}" stroke-width=".4">
      ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse cy="-6.3" rx="2.1" ry="4.4" transform="rotate(${a})"/>`).join('')}
    </g>
    <circle r="2.8" fill="${RED}" stroke="${INK}" stroke-width=".6"/>
  </g>
  <g id="s-cop">
    <path d="M-14,-19 h28 c0,11 -5,17 -14,18.5 c-9,-1.5 -14,-7.5 -14,-18.5z" fill="${GOLD}" stroke="${INK}" stroke-width="1.2"/>
    <path d="M-13.2,-12 h26.4 c-.6,3 -1.5,5 -2.5,6.5 h-21.4 c-1,-1.5 -1.9,-3.5 -2.5,-6.5z" fill="${RED}"/>
    <ellipse cy="-19" rx="14" ry="3" fill="${GOLD_L}" stroke="${INK}" stroke-width="1"/>
    <rect x="-2.2" y="-1" width="4.4" height="13" fill="${GOLD}" stroke="${INK}" stroke-width=".8"/>
    <ellipse cy="3.5" rx="4.6" ry="3" fill="${BLUE}" stroke="${INK}" stroke-width=".8"/>
    <path d="M-11,19 q11,-10 22,0z" fill="${GOLD}" stroke="${INK}" stroke-width="1"/>
    <ellipse cy="19" rx="11" ry="2.2" fill="${GOLD_L}" stroke="${INK}" stroke-width=".8"/>
  </g>
  <g id="s-spa">
    <path d="M0,-32 C4.2,-20 4.2,0 2.6,14 L-2.6,14 C-4.2,0 -4.2,-20 0,-32Z" fill="#8fb1d4" stroke="#22344f" stroke-width="1"/>
    <path d="M0,-27 L0,12" stroke="#e6f0fa" stroke-width="1"/>
    <rect x="-10" y="13.5" width="20" height="4" rx="2" fill="${GOLD}" stroke="${INK}" stroke-width=".8"/>
    <rect x="-2.2" y="17.5" width="4.4" height="10" fill="${RED}" stroke="${INK}" stroke-width=".7"/>
    <circle cy="30" r="3.2" fill="${GOLD}" stroke="${INK}" stroke-width=".8"/>
  </g>
  <g id="s-bas">
    <path d="M-3.2,31 C-4.5,12 -7.5,-10 -6.2,-25 C-5.2,-33 5.2,-33 6.2,-25 C7.5,-10 4.5,12 3.2,31Z" fill="#9a6631" stroke="#3d2408" stroke-width="1"/>
    <g fill="${GREEN}" stroke="#1e3d17" stroke-width=".5">
      <ellipse cx="-5.8" cy="-14" rx="2.4" ry="3.2"/><ellipse cx="5.6" cy="-4" rx="2.4" ry="3.2"/>
      <ellipse cx="-4.6" cy="7" rx="2.1" ry="2.8"/><ellipse cx="4.6" cy="-22" rx="2" ry="2.8"/>
    </g>
    <rect x="-4" y="20" width="8" height="3.4" fill="${RED}" stroke="${INK}" stroke-width=".6"/>
  </g>
  <pattern id="backpat" width="12" height="12" patternUnits="userSpaceOnUse">
    <rect width="12" height="12" fill="#7a1e1e"/>
    <path d="M6,0 L12,6 L6,12 L0,6Z" fill="#9b2c2c"/>
    <circle cx="6" cy="6" r="1.4" fill="${GOLD}"/>
  </pattern>
</defs>
</svg>`;

const PIP_POS = {
  1: [[50, 86]],
  2: [[50, 48], [50, 124]],
  3: [[50, 38], [50, 86], [50, 134]],
  4: [[30, 50], [70, 50], [30, 122], [70, 122]],
  5: [[30, 42], [70, 42], [50, 86], [30, 130], [70, 130]],
  6: [[30, 40], [70, 40], [30, 86], [70, 86], [30, 132], [70, 132]],
  7: [[30, 40], [70, 40], [50, 63], [30, 86], [70, 86], [30, 132], [70, 132]],
};
const SCALE_ROUND = {1: 1.9, 2: 1.1, 3: 0.95, 4: 1.05, 5: 0.9, 6: 0.9, 7: 0.78};
const SCALE_TALL = {1: 1.75, 2: 1.1, 3: 0.7, 4: 1.0, 5: 0.66, 6: 0.68, 7: 0.62};
const ROBE = [RED, BLUE, GREEN, '#7b4a1e'];
const ROBE2 = [BLUE, RED, '#7b4a1e', GREEN];
const SKIN = '#f2cfa5';

function use(sym, x, y, s, rot) {
  const r = rot ? ` rotate(${rot})` : '';
  return `<use href="#s-${sym}" xlink:href="#s-${sym}" transform="translate(${x},${y}) scale(${s})${r}"/>`;
}

function pips(suit, rank) {
  const sym = SUIT_SYM[suit];
  const tall = suit >= 2;
  const sc = (tall ? SCALE_TALL : SCALE_ROUND)[rank];
  let out = '';
  if (rank === 1) {
    if (suit === 0) out += `<circle cx="50" cy="86" r="40" fill="none" stroke="${RED}" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    out += use(sym, 50, 86, sc, tall ? 18 : 0);
    return out;
  }
  for (const [x, y] of PIP_POS[rank]) out += use(sym, x, y, sc);
  return out;
}

function figure(suit, rank) {
  const robe = ROBE[suit], robe2 = ROBE2[suit], sym = SUIT_SYM[suit];
  let g = '';
  if (rank === 8) { // Fante: standing page
    g += `<rect x="40" y="116" width="8" height="34" fill="${robe2}" stroke="${INK}" stroke-width=".8"/>
          <rect x="52" y="116" width="8" height="34" fill="${robe2}" stroke="${INK}" stroke-width=".8"/>
          <path d="M38,150 h11 v5 h-13z M51,150 h11 l2,5 h-13z" fill="#3b2a1a"/>
          <path d="M37,64 h26 l7,56 h-40z" fill="${robe}" stroke="${INK}" stroke-width="1"/>
          <rect x="33" y="96" width="34" height="4" fill="${GOLD}" stroke="${INK}" stroke-width=".6"/>
          <path d="M50,64 v56" stroke="${GOLD}" stroke-width="2"/>
          <path d="M62,68 l14,-6 l2,5 l-13,7z" fill="${robe}" stroke="${INK}" stroke-width=".8"/>
          <path d="M38,68 l-8,24 l5,2 l8,-20z" fill="${robe}" stroke="${INK}" stroke-width=".8"/>
          <circle cx="50" cy="50" r="10" fill="${SKIN}" stroke="${INK}" stroke-width=".8"/>
          <path d="M39,46 q11,-16 22,0 q-4,-4 -11,-4 q-7,0 -11,4z" fill="#6b3d14"/>
          <path d="M38,42 q12,-14 25,-2 l-3,2 q-9,-6 -19,1z" fill="${robe2}" stroke="${INK}" stroke-width=".7"/>
          <path d="M60,38 q10,-8 12,-18 q-2,10 -9,20z" fill="${GOLD}"/>
          <circle cx="46" cy="50" r="1" fill="${INK}"/><circle cx="54" cy="50" r="1" fill="${INK}"/>
          <path d="M47,55 q3,2 6,0" stroke="${INK}" stroke-width=".8" fill="none"/>`;
    g += use(sym, 78, 58, suit >= 2 ? 0.55 : 0.5, suit >= 2 ? 25 : 0);
  } else if (rank === 9) { // Cavallo: rider on horse
    g += `<path d="M24,108 q-10,8 -8,24 q4,-12 10,-16z" fill="#5a3a1a"/>
          <ellipse cx="48" cy="112" rx="27" ry="14" fill="#f4efe4" stroke="${INK}" stroke-width="1"/>
          <rect x="27" y="118" width="6" height="32" fill="#f4efe4" stroke="${INK}" stroke-width=".8"/>
          <rect x="37" y="120" width="6" height="30" fill="#f4efe4" stroke="${INK}" stroke-width=".8"/>
          <rect x="56" y="120" width="6" height="30" fill="#f4efe4" stroke="${INK}" stroke-width=".8"/>
          <rect x="65" y="118" width="6" height="32" fill="#f4efe4" stroke="${INK}" stroke-width=".8"/>
          <path d="M64,104 l12,-22 l12,6 l-4,8 l-6,-2 l-6,18z" fill="#f4efe4" stroke="${INK}" stroke-width="1"/>
          <path d="M74,84 q-6,6 -10,18" stroke="#5a3a1a" stroke-width="3" fill="none"/>
          <circle cx="82" cy="88" r="1.2" fill="${INK}"/>
          <path d="M32,104 h34 v8 h-34z" fill="${robe2}" stroke="${INK}" stroke-width=".8"/>
          <path d="M40,72 h16 l4,34 h-24z" fill="${robe}" stroke="${INK}" stroke-width="1"/>
          <path d="M46,104 l-4,20 h6 l3,-20z" fill="${robe}" stroke="${INK}" stroke-width=".8"/>
          <path d="M42,78 l-14,-6 l-2,5 l14,8z" fill="${robe}" stroke="${INK}" stroke-width=".8"/>
          <circle cx="48" cy="62" r="9" fill="${SKIN}" stroke="${INK}" stroke-width=".8"/>
          <path d="M38,58 q10,-16 21,0 q-10,-6 -21,0z" fill="${robe2}" stroke="${INK}" stroke-width=".7"/>
          <circle cx="45" cy="62" r=".9" fill="${INK}"/><circle cx="51" cy="62" r=".9" fill="${INK}"/>`;
    g += use(sym, 24, 62, suit >= 2 ? 0.5 : 0.45, suit >= 2 ? -25 : 0);
  } else { // Re: crowned king
    g += `<path d="M36,64 h28 l12,88 h-52z" fill="${robe}" stroke="${INK}" stroke-width="1"/>
          <path d="M45,64 h10 l3,88 h-16z" fill="${GOLD}" stroke="${INK}" stroke-width=".7"/>
          <path d="M24,140 h52 l1,12 h-54z" fill="#fbf8f0" stroke="${INK}" stroke-width=".8"/>
          <g fill="${INK}"><circle cx="32" cy="146" r="1"/><circle cx="42" cy="146" r="1"/><circle cx="58" cy="146" r="1"/><circle cx="68" cy="146" r="1"/></g>
          <path d="M36,66 q-10,10 -12,28 l6,1 q2,-14 8,-22z" fill="${robe2}" stroke="${INK}" stroke-width=".8"/>
          <path d="M64,66 q8,6 10,16 l-5,2 q-3,-8 -7,-12z" fill="${robe2}" stroke="${INK}" stroke-width=".8"/>
          <circle cx="50" cy="50" r="10" fill="${SKIN}" stroke="${INK}" stroke-width=".8"/>
          <path d="M41,52 q9,18 18,0 q-2,6 -9,7 q-7,-1 -9,-7z" fill="#e8e2d4" stroke="${INK}" stroke-width=".6"/>
          <circle cx="46" cy="48" r="1" fill="${INK}"/><circle cx="54" cy="48" r="1" fill="${INK}"/>
          <path d="M39,42 l-1,-12 l5,6 l4,-9 l3,8 l3,-8 l4,9 l5,-6 l-1,12z" fill="${GOLD}" stroke="${INK}" stroke-width=".8"/>
          <circle cx="50" cy="35" r="1.6" fill="${RED}"/>`;
    g += use(sym, 26, 96, suit >= 2 ? 0.55 : 0.5, suit >= 2 ? -15 : 0);
  }
  return g;
}

const _cardCache = {};
function cardSVG(id) {
  if (id < 0) return backSVG();
  if (_cardCache[id]) return _cardCache[id];
  const s = cardSuit(id), r = cardRank(id);
  const idx = r <= 7 ? String(r) : ['F', 'C', 'R'][r - 8];
  const idxCol = s === 0 || s === 1 ? '#8a1a1a' : '#1e3a5f';
  let body = r <= 7 ? pips(s, r) : figure(s, r);
  if (r >= 8) body = `<rect x="12" y="20" width="76" height="140" rx="4" fill="#fbf3dc" stroke="${ROBE[s]}" stroke-width="1"/>` + body;
  const svg = `<svg viewBox="0 0 100 172" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-label="${cardName(id)}">
    <rect x="1" y="1" width="98" height="170" rx="7" fill="#fbf6e8" stroke="#3a2a10" stroke-width="1.5"/>
    <rect x="5" y="5" width="90" height="162" rx="5" fill="none" stroke="${idxCol}" stroke-width=".6" opacity=".5"/>
    ${body}
    <text x="9" y="19" font-family="Georgia,serif" font-weight="bold" font-size="16" fill="${idxCol}">${idx}</text>
    <text x="9" y="19" font-family="Georgia,serif" font-weight="bold" font-size="16" fill="${idxCol}" transform="rotate(180 50 86)">${idx}</text>
  </svg>`;
  _cardCache[id] = svg;
  return svg;
}

function backSVG() {
  return `<svg viewBox="0 0 100 172" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="98" height="170" rx="7" fill="url(#backpat)" stroke="#2a0c0c" stroke-width="1.5"/>
    <rect x="7" y="7" width="86" height="158" rx="4" fill="none" stroke="${GOLD}" stroke-width="2"/>
    <circle cx="50" cy="86" r="17" fill="#7a1e1e" stroke="${GOLD}" stroke-width="2"/>
    <text x="50" y="94" text-anchor="middle" font-family="Georgia,serif" font-size="22" font-weight="bold" fill="${GOLD}">S</text>
  </svg>`;
}

module.exports = { CARD_DEFS, cardSVG, backSVG };
