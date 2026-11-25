/* BuckMe – Logo & Maskottchen (alles selbst gezeichnete SVGs) */
const Logo = {
  svg(cls = '') {
    return `<svg class="${cls}" viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
        <path class="speed" d="M24 16H34M15 30H42M21 44H34"/>
        <path d="M44 16H57Q61 16 58.5 21.5L40 61"/>
        <circle cx="57" cy="64" r="18"/>
      </g></svg>`;
  },
  dataUri(color) {
    const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path d="M24 16H34M15 30H42M21 44H34"/><path d="M44 16H57Q61 16 58.5 21.5L40 61"/><circle cx="57" cy="64" r="18"/></g></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(s)}")`;
  }
};

const Mascot = (() => {
  let uid = 0;
  const INK = '#2a2140';

  /* ---- Gesichter (lokale Koordinaten des "b") ---- */
  function face(mood, color, dark) {
    switch (mood) {
      case 'sad': return `
        <path d="M50 108 Q58 113 66 108M80 108 Q88 113 96 108" stroke="${dark}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"/>
        <ellipse cx="58" cy="94" rx="10" ry="11" fill="#fff"/><ellipse cx="88" cy="94" rx="10" ry="11" fill="#fff"/>
        <circle cx="59" cy="99" r="4.5" fill="${INK}"/><circle cx="87" cy="99" r="4.5" fill="${INK}"/>
        <path d="M46 93 Q58 87 70 93 V80 H46Z M76 93 Q88 87 100 93 V80 H76Z" fill="${color}"/>
        <path d="M47 93 Q58 87 69 93M77 93 Q88 87 99 93" stroke="${dark}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M60 127 Q66 119 73 122 Q80 118 87 126" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      case 'meh': return `
        <ellipse cx="58" cy="94" rx="10" ry="11" fill="#fff"/><ellipse cx="88" cy="94" rx="10" ry="11" fill="#fff"/>
        <circle cx="59" cy="96" r="4.5" fill="${INK}"/><circle cx="87" cy="96" r="4.5" fill="${INK}"/>
        <circle cx="61" cy="94" r="1.5" fill="#fff"/><circle cx="89" cy="94" r="1.5" fill="#fff"/>
        <path d="M62 121 Q73 125 84 120" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      case 'happy': return `
        <ellipse cx="58" cy="94" rx="10" ry="11" fill="#fff"/><ellipse cx="88" cy="94" rx="10" ry="11" fill="#fff"/>
        <circle cx="59" cy="93" r="5" fill="${INK}"/><circle cx="87" cy="93" r="5" fill="${INK}"/>
        <circle cx="61" cy="91" r="1.8" fill="#fff"/><circle cx="89" cy="91" r="1.8" fill="#fff"/>
        <ellipse cx="46" cy="112" rx="7" ry="4.5" fill="#ff7fb0" opacity=".55"/><ellipse cx="100" cy="112" rx="7" ry="4.5" fill="#ff7fb0" opacity=".55"/>
        <path d="M58 113 Q73 135 88 113Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M64 123 Q73 131 82 123 Q73 120 64 123Z" fill="#ff7f9e"/>`;
      case 'cool': return `
        <path d="M42 86 H104" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
        <path d="M44 85 H70 V93 Q70 104 57 104 Q44 104 44 93Z M76 85 H102 V93 Q102 104 89 104 Q76 104 76 93Z" fill="${INK}"/>
        <path d="M49 89 L56 89M81 89 L88 89" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>
        <ellipse cx="44" cy="114" rx="7" ry="4.5" fill="#ff7fb0" opacity=".5"/><ellipse cx="102" cy="114" rx="7" ry="4.5" fill="#ff7fb0" opacity=".5"/>
        <path d="M55 112 Q73 138 93 112Z" fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M58 114 H90 L88 119 H60Z" fill="#fff"/>`;
    }
    return '';
  }

  /* ---- Das "b" Maskottchen. Lokale Box ca. 0..120 x 0..155 (Boden bei y=152) ---- */
  function bChar(o) {
    const { x = 0, y = 0, s = 1, color = '#a77be0', dark = '#6d3fc4', mood = 'happy',
      drool = false, stitches = false, bandaid = false, bow = false, outfit = false, bag = false,
      tear = false, anim = 'bob', hair = false } = o;
    const id = 'bc' + (++uid);
    let g = `<g transform="translate(${x},${y}) scale(${s})"><g class="${anim}">`;
    g += `<ellipse cx="62" cy="152" rx="48" ry="6" fill="rgba(0,0,0,.14)"/>`;
    // Körper
    g += `<rect x="14" y="0" width="32" height="120" rx="16" fill="${color}"/>`;
    g += `<circle cx="66" cy="100" r="50" fill="${color}"/>`;
    // Kontur wie im Original-Style (dunkler Rand links)
    g += `<path d="M20 14 V96" stroke="${dark}" stroke-width="6" stroke-linecap="round" opacity=".55"/>`;
    g += `<path d="M24 120 A46 46 0 0 0 108 128" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".35"/>`;
    // Glanz
    g += `<path d="M34 10 V30" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/>`;
    g += `<path d="M96 66 Q106 74 108 86" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".3"/>`;
    if (stitches) {
      g += `<path d="M16 46 L44 38" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>
            <path d="M21 38 L23 50M28 36 L31 48M35 34 L38 46" stroke="${dark}" stroke-width="2.5" stroke-linecap="round"/>`;
    }
    if (bandaid) {
      g += `<g transform="rotate(-25 104 72)"><rect x="92" y="66" width="26" height="11" rx="5" fill="#f3c9a1" stroke="#cf9d72" stroke-width="1.5"/>
            <rect x="101" y="66" width="8" height="11" fill="#e8b48a"/></g>`;
    }
    if (outfit) {
      // Fake-Luxus Outfit: "Louis Buckton" Monogramm
      g += `<clipPath id="${id}c"><circle cx="66" cy="100" r="50"/></clipPath>
            <g clip-path="url(#${id}c)"><rect x="10" y="118" width="120" height="40" fill="url(#lbPat)"/>
            <path d="M14 118 H120" stroke="#d9b35c" stroke-width="3"/></g>`;
    }
    g += face(mood, color, dark);
    if (tear) g += `<path d="M98 100 q4 7 0 10 q-4 -3 0 -10z" fill="#9fd8ff"/>`;
    if (drool) g += `<path class="drool" d="M84 124 q3 9 1 17 q-3 5 -6 0 q-1 -8 5 -17z" fill="#c9ecff" stroke="#8cc8ea" stroke-width="1.5"/>`;
    if (bow) {
      g += `<g transform="translate(30 2)"><path d="M0 0 L-16 -10 L-16 10Z M0 0 L16 -10 L16 10Z" fill="#ff5fa8" stroke="#d63a86" stroke-width="2" stroke-linejoin="round"/><circle r="5" fill="#ff8cc2" stroke="#d63a86" stroke-width="2"/></g>`;
    }
    if (hair) {
      g += `<path d="M22 4 Q30 -10 38 4" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    }
    if (bag) {
      g += `<g transform="translate(108 112)"><path d="M4 0 Q12 -16 20 0" stroke="#5b3a1e" stroke-width="3" fill="none"/>
            <rect x="0" y="0" width="24" height="20" rx="4" fill="url(#lbPat)" stroke="#3e2712" stroke-width="1.5"/>
            <rect x="9" y="5" width="6" height="5" rx="1" fill="#e6c36a"/></g>`;
    }
    g += `</g></g>`;
    return g;
  }

  function fly(cx, cy, rx, ry, dur, delay) {
    return `<g transform="translate(${cx} ${cy})"><g>
      <animateMotion dur="${dur}s" begin="${delay}s" repeatCount="indefinite"
        path="M${-rx},0 a${rx},${ry} 0 1,0 ${2 * rx},0 a${rx},${ry} 0 1,0 ${-2 * rx},0"/>
      <ellipse cx="-2" cy="-3.5" rx="3.6" ry="2.2" fill="rgba(255,255,255,.85)" stroke="#666" stroke-width=".6">
        <animate attributeName="ry" values="2.2;.6;2.2" dur=".12s" repeatCount="indefinite"/></ellipse>
      <ellipse cx="2" cy="-3.5" rx="3.6" ry="2.2" fill="rgba(255,255,255,.85)" stroke="#666" stroke-width=".6">
        <animate attributeName="ry" values=".6;2.2;.6" dur=".12s" repeatCount="indefinite"/></ellipse>
      <circle r="3" fill="#1f1f1f"/></g></g>`;
  }

  function stink(x, y, strength = 1) {
    const p = (dx) => `<path class="stink" d="M${x + dx} ${y} q-6 -8 0 -16 q6 -8 0 -16" stroke="#8fb33a" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="${strength}"/>`;
    return `<g>${p(0)}${p(14)}${p(28)}</g>`;
  }

  function coinStack(x, y, n) {
    let g = '';
    for (let i = 0; i < n; i++) {
      g += `<ellipse cx="${x}" cy="${y - i * 5}" rx="13" ry="5" fill="#f2b821" stroke="#b9820c" stroke-width="1.5"/>`;
    }
    g += `<ellipse cx="${x}" cy="${y - (n - 1) * 5}" rx="9" ry="3" fill="none" stroke="#ffe07a" stroke-width="1.2"/>`;
    return g;
  }
  function coin(x, y, r = 9) {
    return `<g><circle cx="${x}" cy="${y}" r="${r}" fill="#f6c232" stroke="#b9820c" stroke-width="1.8"/>
      <circle cx="${x}" cy="${y}" r="${r - 3}" fill="none" stroke="#ffe07a" stroke-width="1"/>
      <text x="${x}" y="${y + r * .38}" font-size="${r * 1.05}" font-weight="900" text-anchor="middle" fill="#a26f05" font-family="Arial">€</text></g>`;
  }
  function bill(x, y, rot) {
    return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-17" y="-8" width="34" height="16" rx="2" fill="#86c97f" stroke="#3f8a3d" stroke-width="1.5"/>
      <rect x="-13" y="-5" width="26" height="10" rx="1.5" fill="none" stroke="#5aa557" stroke-width="1"/>
      <circle r="4.5" fill="#bfe6b9" stroke="#3f8a3d" stroke-width="1"/><text y="3" font-size="7" font-weight="900" text-anchor="middle" fill="#2f6e2d" font-family="Arial">€</text></g>`;
  }
  function palm(x, y, s, flip = false) {
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><g class="sway">
      <path d="M0 0 Q6 -50 22 -96" stroke="#8a5a2b" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M2 -20 l7 -3M5 -40 l7 -2M9 -60 l7 -2M14 -78 l7 -1" stroke="#6d4520" stroke-width="2.5" stroke-linecap="round"/>
      <g fill="#3fa55a" stroke="#2c7d41" stroke-width="2" stroke-linejoin="round">
        <path d="M22 -96 Q-6 -112 -30 -86 Q-4 -100 22 -96Z"/>
        <path d="M22 -96 Q48 -118 76 -96 Q46 -104 22 -96Z"/>
        <path d="M22 -96 Q10 -126 -12 -128 Q12 -116 22 -96Z"/>
        <path d="M22 -96 Q46 -132 66 -124 Q40 -118 22 -96Z"/>
        <path d="M22 -96 Q30 -70 18 -50 Q30 -72 22 -96Z"/>
      </g>
      <circle cx="20" cy="-92" r="5" fill="#7a4a1c"/><circle cx="28" cy="-90" r="5" fill="#6b3f17"/></g></g>`;
  }

  const DEFS = `<defs>
    <pattern id="lbPat" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="16" height="16" fill="#6b4626"/>
      <text x="1" y="7" font-size="6.5" font-weight="900" fill="#d9b35c" font-family="Georgia,serif">LB</text>
      <path d="M12 11 l1.6 1.6 l-1.6 1.6 l-1.6 -1.6z M4 12 l1 1 l-1 1 l-1 -1z" fill="#d9b35c"/>
    </pattern>
    <linearGradient id="skyPoor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfcbd6"/><stop offset="1" stop-color="#e3dfe8"/></linearGradient>
    <linearGradient id="skyMid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2d7f3"/><stop offset="1" stop-color="#efe9f7"/></linearGradient>
    <linearGradient id="skyRich" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cd3ff"/><stop offset=".6" stop-color="#ffd7a8"/><stop offset="1" stop-color="#ffc48a"/></linearGradient>
  </defs>`;

  const GREY = { color: '#a3a5b1', dark: '#6f7180' };
  const LAV = { color: '#b2a9c4', dark: '#7c7193' };
  const PURPLE = { color: '#a77be0', dark: '#6232c0' };

  /* ---- Szenen pro Stufe (0 = arm, 5 = Millionär) ---- */
  function scene(stage) {
    uid = 0;
    let bg, body = '';
    const W = 320, H = 190;
    switch (stage) {
      case 0:
        bg = `<rect width="${W}" height="${H}" fill="url(#skyPoor)"/><rect y="168" width="${W}" height="22" fill="#bdb8c6"/>
              <path d="M30 172 l10 -3 M250 176 l14 2 M200 180 l8 -2" stroke="#9e98a9" stroke-width="2"/>
              <g transform="translate(232 140)"><rect width="30" height="30" rx="2" fill="#b7966a" stroke="#8c6f48" stroke-width="2"/><path d="M0 8 H30" stroke="#8c6f48" stroke-width="2"/><text x="15" y="22" font-size="7" text-anchor="middle" fill="#5d4527" font-weight="900" font-family="Arial">PLEITE</text></g>`;
        body += stink(150, 62);
        body += bChar({ x: 98, y: 16, ...GREY, mood: 'sad', drool: true, stitches: true, tear: true, anim: 'bob-sad' });
        body += fly(118, 34, 28, 12, 1.6, 0) + fly(190, 64, 20, 26, 2.1, -.7) + fly(96, 92, 16, 22, 1.8, -1.1) + fly(214, 112, 22, 14, 2.4, -.3);
        break;
      case 1:
        bg = `<rect width="${W}" height="${H}" fill="url(#skyPoor)"/><rect y="168" width="${W}" height="22" fill="#c3bfcc"/>`;
        body += stink(150, 62, .6);
        body += bChar({ x: 98, y: 16, ...GREY, mood: 'sad', drool: true, stitches: true, bandaid: true, anim: 'bob-sad' });
        body += fly(124, 36, 26, 12, 1.9, 0) + fly(206, 96, 20, 24, 2.3, -.8);
        break;
      case 2:
        bg = `<rect width="${W}" height="${H}" fill="url(#skyMid)"/><rect y="168" width="${W}" height="22" fill="#cdc4dc"/>`;
        body += bChar({ x: 98, y: 16, ...LAV, mood: 'sad', drool: true, bandaid: true, anim: 'bob-sad' });
        body += `<text x="226" y="56" font-size="13" font-weight="900" fill="#9a8fb0" font-family="Nunito,Arial">✓ fliegenfrei</text>`;
        break;
      case 3:
        bg = `<rect width="${W}" height="${H}" fill="url(#skyMid)"/><rect y="168" width="${W}" height="22" fill="#d2c3ec"/>`;
        body += bChar({ x: 92, y: 16, ...PURPLE, mood: 'meh' });
        body += coinStack(236, 170, 3) + coin(262, 164, 8) + coin(70, 166, 8);
        break;
      case 4:
        bg = `<rect width="${W}" height="${H}" fill="url(#skyMid)"/><rect y="168" width="${W}" height="22" fill="#d2c3ec"/>
              <g opacity=".55"><path d="M250 40 c-6 -8 -18 -2 -12 8 l12 10 l12 -10 c6 -10 -6 -16 -12 -8z" fill="#ff7fb0"/></g>`;
        body += bChar({ x: 30, y: 31, ...PURPLE, mood: 'happy' });
        body += bChar({ x: 160, y: 61, s: .8, color: '#c995e8', dark: '#8a4fb8', mood: 'happy', bow: true });
        body += bChar({ x: 252, y: 107, s: .5, color: '#b796f2', dark: '#7a52c7', mood: 'happy', hair: true });
        body += coinStack(150, 176, 4) + coin(132, 174, 7) + coin(20, 172, 7);
        break;
      default: // 5 – Millionär
        bg = `<rect width="${W}" height="${H}" fill="url(#skyRich)"/>
              <circle cx="262" cy="40" r="26" fill="#ffe26b" opacity=".95"/><circle cx="262" cy="40" r="36" fill="#ffe26b" opacity=".25"/>
              <rect y="120" width="${W}" height="20" fill="#3fb6d8"/><path d="M0 124 q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#bff0ff" stroke-width="2" fill="none" opacity=".7"/>
              <path d="M0 140 Q160 126 320 140 V190 H0Z" fill="#f6d79c"/>`;
        body += palm(16, 176, .95) + palm(306, 176, .8, true);
        body += bill(60, 178, -12) + bill(118, 182, 18) + bill(196, 179, -28) + bill(262, 182, 8) + bill(292, 172, -40) + bill(30, 168, 30) + bill(160, 186, -4);
        body += bChar({ x: 34, y: 31, ...PURPLE, mood: 'cool' });
        body += bChar({ x: 158, y: 61, s: .8, color: '#c995e8', dark: '#8a4fb8', mood: 'happy', bow: true, outfit: true, bag: true });
        body += bChar({ x: 264, y: 107, s: .5, color: '#b796f2', dark: '#7a52c7', mood: 'cool' });
        body += coin(140, 170, 8) + coin(236, 176, 7);
        body += `<g class="sparkle"><path d="M84 40 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3z" fill="#fff"/></g>
                 <g class="sparkle" style="animation-delay:.8s"><path d="M210 30 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2z" fill="#fff"/></g>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${DEFS}${bg}${body}</svg>`;
  }

  return { scene };
})();
