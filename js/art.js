/* =========================================================
   MOMO · 毛毛的小日子 —— 美术资源
   所有画面都由 SVG 手绘生成：毛绒兔子、装扮、小窝、地图、场景
   ========================================================= */
const ART = (() => {

  /* ---------- 小工具 ---------- */
  const rng = (seed) => () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const svg = (vb, inner, extra = '') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${extra}>${inner}</svg>`;

  /* ---------- 全局渐变 / 滤镜 / 图案 ---------- */
  const DEFS = `
  <radialGradient id="g-fur" cx=".38" cy=".3" r=".8">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#fffaf4"/>
    <stop offset=".78" stop-color="#f3e5d8"/><stop offset="1" stop-color="#d9c0ae"/></radialGradient>
  <radialGradient id="g-fur-d" cx=".42" cy=".24" r=".86">
    <stop offset="0" stop-color="#fffaf4"/><stop offset=".62" stop-color="#efe0d2"/><stop offset="1" stop-color="#cdb19d"/></radialGradient>
  <linearGradient id="g-ear" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffdcd4"/><stop offset=".55" stop-color="#f8b5ae"/><stop offset="1" stop-color="#ec9d98"/></linearGradient>
  <radialGradient id="g-eye" cx=".36" cy=".3" r=".8">
    <stop offset="0" stop-color="#714c43"/><stop offset=".5" stop-color="#2b1a16"/><stop offset="1" stop-color="#0e0806"/></radialGradient>
  <radialGradient id="g-blush"><stop offset="0" stop-color="#ff9a98" stop-opacity=".8"/><stop offset=".6" stop-color="#ffa8a4" stop-opacity=".35"/><stop offset="1" stop-color="#ffb0aa" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-hl"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-ao"><stop offset="0" stop-color="#bf9f8a" stop-opacity=".75"/><stop offset="1" stop-color="#bf9f8a" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-shadow"><stop offset="0" stop-color="#1e0f09" stop-opacity=".5"/><stop offset="1" stop-color="#1e0f09" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-glow"><stop offset="0" stop-color="#ffe3b8" stop-opacity=".95"/><stop offset=".45" stop-color="#ffcf98" stop-opacity=".35"/><stop offset="1" stop-color="#ffc58a" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-glow-pink"><stop offset="0" stop-color="#ffd0c4" stop-opacity=".9"/><stop offset="1" stop-color="#ffb4a0" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-glow-blue"><stop offset="0" stop-color="#cfe0ff" stop-opacity=".9"/><stop offset="1" stop-color="#a8c0ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-firefly"><stop offset="0" stop-color="#fff7c2"/><stop offset=".3" stop-color="#ffe680" stop-opacity=".8"/><stop offset="1" stop-color="#ffd84a" stop-opacity="0"/></radialGradient>
  <linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff0b0"/><stop offset=".45" stop-color="#f8c64c"/><stop offset="1" stop-color="#d48b20"/></linearGradient>
  <linearGradient id="g-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ad774f"/><stop offset="1" stop-color="#7b4a2c"/></linearGradient>
  <linearGradient id="g-wood-l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5636"/><stop offset=".5" stop-color="#b07a50"/><stop offset="1" stop-color="#7f4d2f"/></linearGradient>
  <linearGradient id="g-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a86f48"/><stop offset="1" stop-color="#7d4b2e"/></linearGradient>
  <linearGradient id="g-ped-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9a487"/><stop offset="1" stop-color="#b47a61"/></linearGradient>
  <linearGradient id="g-ped-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6e4334"/><stop offset=".45" stop-color="#9a654f"/><stop offset="1" stop-color="#5d382b"/></linearGradient>
  <linearGradient id="g-home-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6c4536"/><stop offset="1" stop-color="#3f271f"/></linearGradient>
  <linearGradient id="g-arch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b47a5f"/><stop offset=".6" stop-color="#8f5c46"/><stop offset="1" stop-color="#6a4233"/></linearGradient>
  <linearGradient id="g-sky-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7c9"/><stop offset=".7" stop-color="#fcd2ae"/><stop offset="1" stop-color="#f6c39d"/></linearGradient>
  <linearGradient id="g-sky-sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7a98c"/><stop offset=".55" stop-color="#ffcf9c"/><stop offset="1" stop-color="#ffe6bf"/></linearGradient>
  <linearGradient id="g-sky-sakura" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0f2"/><stop offset="1" stop-color="#fde2e4"/></linearGradient>
  <linearGradient id="g-sky-rain" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7e8aa3"/><stop offset="1" stop-color="#a7b0bf"/></linearGradient>
  <linearGradient id="g-sky-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1d3f"/><stop offset=".7" stop-color="#3a3866"/><stop offset="1" stop-color="#5d4f7a"/></linearGradient>
  <linearGradient id="g-sky-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d2a52"/><stop offset=".55" stop-color="#6c5684"/><stop offset=".85" stop-color="#d79a8a"/><stop offset="1" stop-color="#efbf98"/></linearGradient>
  <linearGradient id="g-forest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1d3a0"/><stop offset=".45" stop-color="#b4b47a"/><stop offset="1" stop-color="#6d8550"/></linearGradient>
  <linearGradient id="g-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7f86b8"/><stop offset="1" stop-color="#4b5788"/></linearGradient>
  <linearGradient id="g-map" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#211f3c"/><stop offset=".2" stop-color="#3a335a"/><stop offset=".31" stop-color="#5a4f66"/>
    <stop offset=".35" stop-color="#4d6342"/><stop offset=".62" stop-color="#58744a"/><stop offset=".68" stop-color="#93a86a"/>
    <stop offset="1" stop-color="#bcc387"/></linearGradient>
  <linearGradient id="g-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2e2" stop-opacity="0"/><stop offset=".5" stop-color="#fff2e2" stop-opacity=".22"/><stop offset="1" stop-color="#fff2e2" stop-opacity="0"/></linearGradient>
  <linearGradient id="g-pot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8603f"/><stop offset=".45" stop-color="#d98a62"/><stop offset="1" stop-color="#9c4e33"/></linearGradient>
  <linearGradient id="g-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3df"/><stop offset="1" stop-color="#f4cfa4"/></linearGradient>
  <radialGradient id="g-bubble" cx=".35" cy=".3" r=".75">
    <stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".25" stop-color="#fff" stop-opacity=".15"/>
    <stop offset=".75" stop-color="#d7ecff" stop-opacity=".25"/><stop offset=".92" stop-color="#ffd6f0" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity=".9"/></radialGradient>
  <radialGradient id="g-vignette" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#2a140c" stop-opacity="0"/><stop offset="1" stop-color="#2a140c" stop-opacity=".55"/></radialGradient>

  <pattern id="p-floral" width="36" height="36" patternUnits="userSpaceOnUse">
    <g transform="translate(9 9)"><circle r="2.6" cx="0" cy="-3.4" fill="#f4a9a2"/><circle r="2.6" cx="3.4" cy="0" fill="#f4a9a2"/><circle r="2.6" cx="0" cy="3.4" fill="#f4a9a2"/><circle r="2.6" cx="-3.4" cy="0" fill="#f4a9a2"/><circle r="1.8" fill="#f7cf6a"/></g>
    <g transform="translate(27 27)"><circle r="2.2" cx="0" cy="-2.8" fill="#fff3e4"/><circle r="2.2" cx="2.8" cy="0" fill="#fff3e4"/><circle r="2.2" cx="0" cy="2.8" fill="#fff3e4"/><circle r="2.2" cx="-2.8" cy="0" fill="#fff3e4"/><circle r="1.4" fill="#f2a78f"/></g>
    <ellipse cx="25" cy="10" rx="3.2" ry="1.4" fill="#a9bf86" transform="rotate(-30 25 10)"/><ellipse cx="11" cy="26" rx="3.2" ry="1.4" fill="#a9bf86" transform="rotate(30 11 26)"/>
  </pattern>
  <pattern id="p-stripes" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="15" height="30" fill="#efc6a8"/><rect x="15" width="1.4" height="30" fill="#fff" opacity=".35"/></pattern>
  <pattern id="p-cream" width="22" height="22" patternUnits="userSpaceOnUse"><rect x="10" width="1.2" height="22" fill="#fff" opacity=".22"/></pattern>
  <pattern id="p-stars" width="60" height="60" patternUnits="userSpaceOnUse">
    <path d="M14 10 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6Z" fill="#f8d98a" opacity=".85"/>
    <circle cx="44" cy="22" r="1.4" fill="#fff4cc" opacity=".8"/><circle cx="30" cy="48" r="1.1" fill="#fff4cc" opacity=".7"/>
    <path d="M48 44 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1Z" fill="#f2b8c0" opacity=".8"/></pattern>
  <pattern id="p-plaid" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#f3e2c8"/>
    <rect width="24" height="8" y="8" fill="#d9645b" opacity=".55"/><rect width="8" height="24" x="8" fill="#d9645b" opacity=".45"/>
    <rect width="24" height="1.5" y="3" fill="#8f3c2e" opacity=".3"/><rect width="1.5" height="24" x="3" fill="#8f3c2e" opacity=".3"/></pattern>
  <pattern id="p-paw" width="40" height="40" patternUnits="userSpaceOnUse">
    <g fill="#e4b49c" opacity=".55" transform="translate(12 14) scale(.5)"><ellipse cx="0" cy="6" rx="8" ry="6.5"/><circle cx="-8" cy="-5" r="3.4"/><circle cx="-2.5" cy="-9" r="3.4"/><circle cx="3.5" cy="-9" r="3.4"/><circle cx="9" cy="-5" r="3.4"/></g>
    <g fill="#e4b49c" opacity=".55" transform="translate(32 34) scale(.42) rotate(18)"><ellipse cx="0" cy="6" rx="8" ry="6.5"/><circle cx="-8" cy="-5" r="3.4"/><circle cx="-2.5" cy="-9" r="3.4"/><circle cx="3.5" cy="-9" r="3.4"/><circle cx="9" cy="-5" r="3.4"/></g></pattern>

  <clipPath id="cp-window"><path d="M228 158 V86 Q228 42 268 42 Q308 42 308 86 V158Z"/></clipPath>

  <filter id="f-plush" x="-8%" y="-8%" width="116%" height="116%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="3.6" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 .8  0 0 0 0 .68  0 0 0 0 .6  1.25 0 0 0 -.64" result="s"/>
    <feComposite in="s" in2="d" operator="in" result="s2"/>
    <feMerge><feMergeNode in="d"/><feMergeNode in="s2"/></feMerge>
  </filter>
  <filter id="f-fuzz" x="-6%" y="-6%" width="112%" height="112%">
    <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="f-b3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="f-b6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="f-drop" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#2a1208" flood-opacity=".35"/></filter>
  `;

  /* =========================================================
     毛绒兔子
     ========================================================= */
  const EYE = (x, s = 1) => `<ellipse cx="${x}" cy="104" rx="${7.8 * s}" ry="${9.4 * s}" fill="url(#g-eye)"/>
    <ellipse cx="${x + 2.6 * s}" cy="${104 - 4.4 * s}" rx="${3.1 * s}" ry="${3.3 * s}" fill="#fff"/>
    <circle cx="${x - 2.6 * s}" cy="${104 + 4.2 * s}" r="${1.4 * s}" fill="#fff" opacity=".75"/>`;
  const ARC_UP = (x) => `<path d="M${x - 8} 106 Q${x} 96 ${x + 8} 106"/>`;
  const HEART = (x, y, s = 1, c = '#ff7f8a') =>
    `<path transform="translate(${x} ${y}) scale(${s})" d="M0 6 C-11 -2 -8 -11 0 -5 C8 -11 11 -2 0 6Z" fill="${c}"/>`;
  const stroke = (inner, w = 3.6) => `<g fill="none" stroke="#2b1a16" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;

  const EYES = {
    normal: `<g class="b-eyes">${EYE(73)}${EYE(127)}</g>`,
    happy: stroke(ARC_UP(73) + ARC_UP(127)),
    eat: stroke(ARC_UP(73) + ARC_UP(127)),
    sleep: stroke(`<path d="M65 103 Q73 110 81 103"/><path d="M119 103 Q127 110 135 103"/>`, 3.2),
    wink: `<g class="b-eyes">${EYE(73)}</g>` + stroke(ARC_UP(127)),
    surprised: `<g class="b-eyes">${EYE(73, 1.12)}${EYE(127, 1.12)}</g>`,
    sad: `<g class="b-eyes">${EYE(73, .9)}${EYE(127, .9)}</g>` +
      stroke(`<path d="M64 89 Q71 86 79 90"/><path d="M136 89 Q129 86 121 90"/>`, 2.4) +
      `<path d="M83 110 q3 6 0 9 q-3 -3 0 -9Z" fill="#a8d6f2" opacity=".9"/>`,
    love: `<g>${HEART(73, 104, 1.05)}${HEART(127, 104, 1.05)}<circle cx="70" cy="100" r="2" fill="#fff" opacity=".85"/><circle cx="124" cy="100" r="2" fill="#fff" opacity=".85"/></g>`,
    ouch: stroke(`<path d="M66 98 L80 104 L66 110"/><path d="M134 98 L120 104 L134 110"/>`, 3.2),
  };
  const M_SMILE = `<path d="M93 116.5 Q96.5 121 100 117 Q103.5 121 107 116.5" fill="none" stroke="#7a4238" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  const M_OPEN = `<path d="M92.5 116 Q100 118 107.5 116 Q106.5 127 100 127.5 Q93.5 127 92.5 116Z" fill="#a33f3d"/><path d="M95.5 123 Q100 120 104.5 123 Q102.5 126.6 100 126.8 Q97.5 126.6 95.5 123Z" fill="#f28c8e"/>`;
  const MOUTH = {
    normal: M_SMILE, happy: M_OPEN, wink: M_OPEN, love: M_OPEN,
    eat: `<g class="b-chew"><ellipse cx="100" cy="119.5" rx="5.4" ry="4.4" fill="#a33f3d"/><ellipse cx="100" cy="121.5" rx="3" ry="1.8" fill="#f28c8e"/></g>`,
    sad: `<path d="M94 121.5 Q100 115.5 106 121.5" fill="none" stroke="#7a4238" stroke-width="2.2" stroke-linecap="round"/>`,
    surprised: `<ellipse cx="100" cy="120.5" rx="4.4" ry="5.4" fill="#a33f3d"/>`,
    sleep: `<ellipse cx="100" cy="118.5" rx="3" ry="2.4" fill="#b0605a"/>`,
    ouch: `<path d="M92 120 q2 -3 4 0 q2 3 4 0 q2 -3 4 0 q2 3 4 0" fill="none" stroke="#7a4238" stroke-width="2.2" stroke-linecap="round"/>`,
  };

  /* ---------- 装扮 ---------- */
  function scarf(c, d, l) {
    let ribs = '';
    for (let i = 1; i < 12; i++) {
      const t = i / 12, x = 50 + 100 * t, top = 141 + 60 * t * (1 - t), bot = 162 + 56 * t * (1 - t);
      ribs += `<path d="M${x.toFixed(1)} ${(top + 5).toFixed(1)} Q${(x + 2).toFixed(1)} ${((top + bot) / 2).toFixed(1)} ${x.toFixed(1)} ${(bot - 4).toFixed(1)}"/>`;
    }
    return `<g class="acc acc-scarf">
      <path d="M50 141 Q100 171 150 141 Q157 152 149 162 Q100 190 51 162 Q43 152 50 141Z" fill="${c}"/>
      <path d="M50 141 Q100 171 150 141 Q151 145 150 148 Q100 177 50 148 Q49 145 50 141Z" fill="${l}" opacity=".6"/>
      <path d="M49 156 Q100 183 151 156 Q151 159 149 162 Q100 190 51 162 Q49 159 49 156Z" fill="${d}" opacity=".55"/>
      <g stroke="${d}" stroke-width="1.6" fill="none" opacity=".5" stroke-linecap="round">${ribs}</g>
      <path d="M119 166 Q124 184 115 201 L133 204 Q139 185 137 166Z" fill="${c}"/>
      <path d="M128 168 Q135 184 133 204 L137 203 Q141 185 137 166Z" fill="${d}" opacity=".55"/>
      <g stroke="${c}" stroke-width="2.6" stroke-linecap="round"><path d="M117 202 l-1.5 6M121.5 202.8 l-.5 6M126 203.4 l0 6M130.5 204 l.8 6"/></g>
      <ellipse cx="129" cy="165" rx="12.5" ry="10.5" fill="${c}"/>
      <ellipse cx="131" cy="169" rx="9" ry="6" fill="${d}" opacity=".5"/>
      <ellipse cx="125.5" cy="160.5" rx="5.5" ry="3" fill="${l}" opacity=".8"/>
    </g>`;
  }
  const daisy = (x, y, s = 1, petal = '#fffdf6', core = '#f6c34a') => {
    let p = '';
    for (let i = 0; i < 8; i++) p += `<ellipse cx="0" cy="-5.2" rx="2.6" ry="5" transform="rotate(${i * 45})" fill="${petal}" stroke="#ead6c2" stroke-width=".5"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${p}<circle r="3.4" fill="${core}"/><circle r="1.4" cx="-1" cy="-1" fill="#fff3b8"/></g>`;
  };
  const blossom = (x, y, s = 1, c = '#f6a5b0') => {
    let p = '';
    for (let i = 0; i < 5; i++) p += `<circle cx="0" cy="-4" r="3.6" transform="rotate(${i * 72})" fill="${c}"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${p}<circle r="2.2" fill="#fff1c4"/></g>`;
  };
  const leaf = (x, y, r, s = 1, c = '#8dbb72') =>
    `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 0 Q5 -6 12 0 Q5 6 0 0Z" fill="${c}"/>`;

  function flowerCrown() {
    const pts = [[44, 64], [58, 51], [73, 43], [88, 39], [100, 38], [112, 39], [127, 43], [142, 51], [156, 64]];
    let lv = '', fl = '';
    pts.forEach(([x, y], i) => { lv += leaf(x - 6, y + 2, -20 + i * 6, 1, i % 2 ? '#7fae68' : '#9cc47f'); });
    pts.forEach(([x, y], i) => { fl += i % 2 ? blossom(x, y - 1, .78, i % 4 === 1 ? '#f6a5b0' : '#f7c3a0') : daisy(x, y - 2, .9); });
    return `<g class="acc">${lv}${fl}</g>`;
  }

  const ACC = {
    scarf_mint: scarf('#a6dcc2', '#73b598', '#dcf4e8'),
    scarf_lav: scarf('#cdb5ec', '#a08bcf', '#ece1fa'),
    scarf_berry: scarf('#f39aa2', '#d46b77', '#ffd3d6'),
    bowtie: `<g class="acc">
      <path d="M100 160 L79 148 Q72 160 79 172Z" fill="#f0837a"/><path d="M100 160 L121 148 Q128 160 121 172Z" fill="#f0837a"/>
      <path d="M100 160 L79 166 Q77 170 79 172Z" fill="#c95b54" opacity=".7"/><path d="M100 160 L121 166 Q123 170 121 172Z" fill="#c95b54" opacity=".7"/>
      <g fill="#fff" opacity=".85"><circle cx="84" cy="155" r="1.6"/><circle cx="88" cy="163" r="1.6"/><circle cx="116" cy="155" r="1.6"/><circle cx="112" cy="163" r="1.6"/><circle cx="82" cy="166" r="1.3"/><circle cx="118" cy="166" r="1.3"/></g>
      <rect x="93.5" y="153.5" width="13" height="13" rx="4.5" fill="#e06a61"/><rect x="95.5" y="155" width="6" height="3" rx="1.5" fill="#fff" opacity=".45"/></g>`,
    cape: `<g class="acc">
      <path d="M46 149 Q100 179 154 149 Q160 159 156 169 Q150 181 138 175 Q130 189 116 181 Q100 193 84 181 Q70 189 62 175 Q50 181 44 169 Q40 159 46 149Z" fill="#c9ad8c" opacity=".55"/>
      <path d="M46 145 Q100 175 154 145 Q160 155 156 165 Q150 177 138 171 Q130 185 116 177 Q100 189 84 177 Q70 185 62 171 Q50 177 44 165 Q40 155 46 145Z" fill="#fff5e4"/>
      <path d="M48 147 Q100 176 152 147 Q154 152 153 155 Q100 182 47 155 Q46 151 48 147Z" fill="#fff" opacity=".6"/>
      <path d="M50 162 Q58 172 64 166 Q72 178 84 172 Q100 182 116 172 Q128 178 136 166 Q142 172 150 162" fill="none" stroke="#e4c9a7" stroke-width="1.4" stroke-dasharray="2.5 3"/>
      <path d="M100 160 l-9 -6 q-3 6 0 12Z M100 160 l9 -6 q3 6 0 12Z" fill="#f2a1a0"/><circle cx="100" cy="160" r="3.2" fill="#e88584"/>
      <circle cx="100" cy="174" r="3.6" fill="#e2b276"/><circle cx="99" cy="173" r="1.2" fill="#fff" opacity=".7"/></g>`,
    bell: `<g class="acc">
      <path d="M51 147 Q100 175 149 147 L150 155 Q100 184 50 155Z" fill="#e2625c"/>
      <path d="M51 147 Q100 175 149 147 L149.5 150 Q100 178 50.5 150Z" fill="#fff" opacity=".28"/>
      <circle cx="100" cy="172" r="9" fill="url(#g-gold)"/><path d="M92 174 h16" stroke="#b97a1a" stroke-width="1.5"/>
      <circle cx="100" cy="178" r="1.8" fill="#8a5410"/><ellipse cx="97" cy="168" rx="3" ry="2" fill="#fff" opacity=".7"/>
      <rect x="97" y="161" width="6" height="3" rx="1.5" fill="#d79a2a"/></g>`,

    bow_coral: `<g class="acc"><g transform="translate(137 49) rotate(14)">
      <path d="M0 0 Q-21 -17 -23 -2 Q-21 13 0 0Z" fill="#f4887f"/><path d="M0 0 Q21 -17 23 -2 Q21 13 0 0Z" fill="#f4887f"/>
      <path d="M0 0 Q-13 -8 -15 -2 Q-13 5 0 0Z" fill="#d9625b" opacity=".75"/><path d="M0 0 Q13 -8 15 -2 Q13 5 0 0Z" fill="#d9625b" opacity=".75"/>
      <path d="M-18 -9 Q-14 -12 -10 -9" stroke="#fff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>
      <path d="M-3 3 L-11 19 L-5 17 L-1 21Z" fill="#e8736a"/><path d="M3 3 L10 19 L4 17Z" fill="#e8736a"/>
      <ellipse rx="5.5" ry="6" fill="#e5675f"/><ellipse cx="-1.5" cy="-2" rx="2" ry="1.4" fill="#fff" opacity=".55"/></g></g>`,
    beret: `<g class="acc"><g transform="rotate(-10 100 46)">
      <path d="M52 55 Q48 28 96 21 Q144 18 148 46 Q146 62 100 64 Q58 64 52 55Z" fill="#b8553f"/>
      <path d="M53 52 Q100 68 147 48 Q146 61 100 64 Q58 64 53 52Z" fill="#8a3a2b" opacity=".75"/>
      <ellipse cx="86" cy="31" rx="24" ry="6" fill="#fff" opacity=".16"/>
      <path d="M99 22 q1 -9 7 -9" stroke="#8a3a2b" stroke-width="4.5" stroke-linecap="round" fill="none"/></g></g>`,
    flower_crown: flowerCrown(),
    straw_hat: `<g class="acc"><g transform="rotate(-6 100 50)">
      <ellipse cx="100" cy="57" rx="80" ry="17" fill="#d6ad62"/>
      <ellipse cx="100" cy="54" rx="77" ry="14" fill="#f0d394"/>
      <g fill="none" stroke="#d7b26b" stroke-width="1.1" opacity=".8"><ellipse cx="100" cy="54" rx="66" ry="11"/><ellipse cx="100" cy="54" rx="54" ry="8.5" stroke-dasharray="3 3"/></g>
      <path d="M63 54 Q60 22 100 19 Q140 22 137 54 Q100 63 63 54Z" fill="#efcf8a"/>
      <path d="M70 40 Q100 30 130 40" stroke="#d7b26b" stroke-width="1.2" fill="none" stroke-dasharray="3 3"/>
      <path d="M63 45 Q100 54 137 45 L137 54 Q100 63 63 54Z" fill="#f29a8f"/>
      <ellipse cx="80" cy="28" rx="12" ry="5" fill="#fff" opacity=".3"/>
      ${daisy(128, 50, .85)}${leaf(118, 52, 160, .9)}</g></g>`,
    berry_hat: `<g class="acc"><g transform="rotate(9 104 40)">
      <path d="M68 55 Q64 21 102 14 Q140 21 136 55 Q102 64 68 55Z" fill="#ee5c62"/>
      <path d="M70 52 Q102 62 134 52 Q133 57 102 63 Q70 57 70 52Z" fill="#c43f48" opacity=".6"/>
      <ellipse cx="86" cy="28" rx="10" ry="6" fill="#fff" opacity=".28"/>
      <g fill="#ffe79c">${[[84, 40], [98, 30], [112, 40], [124, 30], [92, 50], [118, 50], [106, 46], [80, 30]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.4"/>`).join('')}</g>
      <path d="M102 17 L88 9 L96 17 L84 19 L97 22 L102 18 L107 22 L120 19 L108 17 L116 9Z" fill="#6fb35a"/>
      <path d="M102 16 q1 -9 5 -12" stroke="#5d9a4a" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>`,
    party_hat: `<g class="acc"><g transform="rotate(13 104 40)">
      <path d="M85 47 L104 -4 L123 47 Q104 53 85 47Z" fill="#a6dcc2"/>
      <path d="M90.5 32 L95 20 L113 20 L117.5 32Z" fill="#f4a6a6" opacity=".9"/><path d="M98.5 10 L101 4 L107 4 L109.5 10Z" fill="#f4a6a6" opacity=".9"/>
      <g fill="#fff" opacity=".9"><circle cx="96" cy="41" r="1.8"/><circle cx="112" cy="40" r="1.8"/><circle cx="104" cy="27" r="1.6"/></g>
      <path d="M84 47 q5 4 10 0 q5 4 10 0 q5 4 10 0 q5 4 10 0" stroke="#fff6e4" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="104" cy="-5" r="6.5" fill="#f7c453"/><circle cx="102" cy="-7" r="2" fill="#fff" opacity=".6"/></g></g>`,
    star_crown: `<g class="acc"><g transform="rotate(-8 100 40)">
      <path d="M77 47 L72 21 L88 34 L100 11 L112 34 L128 21 L123 47 Q100 53 77 47Z" fill="url(#g-gold)" stroke="#c4841f" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M78 44 Q100 50 122 44" stroke="#fff3c4" stroke-width="1.6" fill="none" opacity=".7"/>
      <path d="M100 30 l2.6 5.4 5.8 .8 -4.2 4 1 5.8 -5.2 -2.8 -5.2 2.8 1 -5.8 -4.2 -4 5.8 -.8Z" fill="#f48ca0"/>
      <circle cx="72" cy="21" r="3.2" fill="#a6dcc2"/><circle cx="100" cy="11" r="3.6" fill="#fff4cc"/><circle cx="128" cy="21" r="3.2" fill="#c9b2ea"/></g></g>`,

    glasses: `<g class="acc"><g fill="rgba(255,255,255,.14)" stroke="#8a5a40" stroke-width="3"><circle cx="73" cy="104" r="14.5"/><circle cx="127" cy="104" r="14.5"/></g>
      <path d="M87.5 101 Q100 94 112.5 101" stroke="#8a5a40" stroke-width="3" fill="none"/>
      <path d="M65 97 q4 -5 10 -5 M119 97 q4 -5 10 -5" stroke="#fff" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/></g>`,
    shades: `<g class="acc">${HEART(73, 103, 1.75, 'rgba(225,80,112,.88)')}${HEART(127, 103, 1.75, 'rgba(225,80,112,.88)')}
      <path d="M88 99 Q100 94 112 99" stroke="#c94a6a" stroke-width="3" fill="none"/>
      <path d="M64 97 q3 -3 7 -3 M118 97 q3 -3 7 -3" stroke="#fff" stroke-width="2.2" fill="none" opacity=".75" stroke-linecap="round"/></g>`,
    sticker: `<g class="acc"><path transform="translate(146 124) rotate(14)" d="M0 -8 l2.4 5 5.4 .8 -3.9 3.8 .9 5.4 -4.8 -2.6 -4.8 2.6 .9 -5.4 -3.9 -3.8 5.4 -.8Z" fill="#f8cf5a" stroke="#e3a832" stroke-width=".8"/>
      <path d="M156 112 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1Z" fill="#fff4cc"/></g>`,
    hearts: `<g class="acc">${HEART(60, 121, .85, '#ff8a9a')}${HEART(140, 121, .85, '#ff8a9a')}</g>`,
  };

  const BASKET = `<g>
    <ellipse cx="100" cy="173" rx="47" ry="8" fill="#6a3d22"/>
    <path d="M58 175 Q78 168 86 175 Q90 162 98 168 Q106 160 112 172 Q122 166 132 174Z" fill="#f59a46"/>
    <path d="M90 166 q-4 -10 -2 -14 q3 6 4 12Z M108 164 q2 -10 6 -12 q-1 7 -4 13Z" fill="#7fbf6a"/>
    <path d="M52 173 Q100 184 148 173 L140 203 Q100 215 60 203Z" fill="#c78a50"/>
    <g stroke="#9e6334" stroke-width="1.5" fill="none" opacity=".75"><path d="M56 183 Q100 193 144 183"/><path d="M58 192 Q100 202 142 192"/>
      ${[66, 78, 90, 102, 114, 126, 136].map(x => `<path d="M${x} 177 l-1 25"/>`).join('')}</g>
    <path d="M50 171 Q100 183 150 171 Q151 176 149 179 Q100 191 51 179 Q49 176 50 171Z" fill="#a8693a"/>
    <path d="M52 172 Q100 183 148 172" stroke="#e2ae76" stroke-width="1.6" fill="none"/>
    <ellipse cx="63" cy="176" rx="10" ry="7.5" fill="url(#g-fur)"/><ellipse cx="137" cy="176" rx="10" ry="7.5" fill="url(#g-fur)"/></g>`;

  function bunnyInner(o = {}) {
    const ex = o.expr || 'normal', of = o.outfit || {};
    const acc = s => (of[s] && ACC[of[s]]) || '';
    return `
    <ellipse cx="100" cy="220" rx="60" ry="9" fill="url(#g-shadow)"/>
    <g class="b-all">
      <g class="b-ear b-ear-l"><g transform="rotate(-14 80 72)" filter="url(#f-plush)">
        <ellipse cx="80" cy="34" rx="17.5" ry="40" fill="url(#g-fur)"/>
        <ellipse cx="80.5" cy="38" rx="9.5" ry="29" fill="url(#g-ear)"/></g></g>
      <g class="b-ear b-ear-r"><g transform="rotate(14 120 72)" filter="url(#f-plush)">
        <ellipse cx="120" cy="34" rx="17.5" ry="40" fill="url(#g-fur)"/>
        <ellipse cx="119.5" cy="38" rx="9.5" ry="29" fill="url(#g-ear)"/></g></g>
      <g filter="url(#f-plush)">
        <ellipse cx="100" cy="166" rx="54" ry="47" fill="url(#g-fur-d)"/>
        <ellipse cx="100" cy="150" rx="50" ry="13" fill="url(#g-ao)"/>
        <ellipse cx="72" cy="208" rx="21" ry="13" fill="url(#g-fur)"/>
        <ellipse cx="128" cy="208" rx="21" ry="13" fill="url(#g-fur)"/>
        <g class="b-arm b-arm-l"><ellipse cx="58" cy="171" rx="12" ry="18" transform="rotate(26 58 171)" fill="url(#g-ao)"/><ellipse cx="57" cy="168" rx="13" ry="19.5" transform="rotate(26 57 168)" fill="url(#g-fur)"/></g>
        <g class="b-arm b-arm-r"><ellipse cx="142" cy="171" rx="12" ry="18" transform="rotate(-26 142 171)" fill="url(#g-ao)"/><ellipse cx="143" cy="168" rx="13" ry="19.5" transform="rotate(-26 143 168)" fill="url(#g-fur)"/></g>
        <ellipse cx="100" cy="96" rx="70" ry="58" fill="url(#g-fur)"/>
      </g>
      <ellipse cx="80" cy="66" rx="36" ry="19" fill="url(#g-hl)" opacity=".85"/>
      <ellipse cx="100" cy="186" rx="26" ry="15" fill="url(#g-hl)" opacity=".55"/>
      ${o.dirty ? `<g opacity=".55"><ellipse cx="140" cy="80" rx="8" ry="5" fill="#a98a6e"/><ellipse cx="66" cy="178" rx="7" ry="4.5" fill="#a98a6e"/><ellipse cx="128" cy="190" rx="5" ry="3.4" fill="#a98a6e"/></g>` : ''}
      ${acc('neck')}
      ${o.basket ? BASKET : ''}
      <g class="b-face">
        ${of.face === 'hearts' ? '' : `<ellipse cx="59" cy="121" rx="16" ry="10" fill="url(#g-blush)"/><ellipse cx="141" cy="121" rx="16" ry="10" fill="url(#g-blush)"/>`}
        ${EYES[ex] || EYES.normal}
        <path d="M97.4 110.6 Q100 109 102.6 110.6 Q101.6 113.4 100 113.6 Q98.4 113.4 97.4 110.6Z" fill="#e48c8b"/>
        ${MOUTH[ex] || MOUTH.normal}
      </g>
      ${acc('face')}
      ${acc('head')}
    </g>`;
  }

  function bunny(o = {}) {
    const size = o.size ? `width="${o.size}" height="${(o.size * 1.16).toFixed(0)}"` : '';
    return `<svg class="bunny ${o.cls || ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 232" ${size} overflow="visible">${o.standalone ? `<defs>${DEFS}</defs>` : ''}${bunnyInner(o)}</svg>`;
  }

  /* 单件装扮的展示图（衣橱卡片用） */
  const ACC_VIEW = { head: '30 -14 140 92', neck: '38 128 124 86', face: '46 76 108 60' };
  function accIcon(id, slot) {
    const ghost = slot === 'face'
      ? `<ellipse cx="100" cy="104" rx="66" ry="40" fill="url(#g-fur)" opacity=".18"/>`
      : slot === 'neck' ? `<ellipse cx="100" cy="150" rx="52" ry="14" fill="#000" opacity=".12"/>` : '';
    const VB = { bow_coral: '104 22 66 54', star_crown: '62 2 76 56', party_hat: '72 -16 64 72', berry_hat: '56 2 92 70', sticker: '126 100 40 40', hearts: '40 104 120 36' };
    return svg(VB[id] || ACC_VIEW[slot], (VB[id] ? '' : ghost) + (ACC[id] || ''), 'overflow="visible"');
  }

  /* =========================================================
     食物 / 道具 图标（64×64）
     ========================================================= */
  const carrot = (gold) => `<g transform="rotate(-35 32 32)">
      <path d="M23.5 20 Q32 15.5 40.5 20 Q40.5 40 33.5 58 Q32 61 30.5 58 Q23.5 40 23.5 20Z" fill="${gold ? 'url(#g-gold)' : '#f59a46'}"/>
      <path d="M26.5 22 Q28 40 31 55" stroke="${gold ? '#fff6cf' : '#ffc890'}" stroke-width="3" opacity=".7" fill="none" stroke-linecap="round"/>
      <path d="M25.5 28 h5 M34 34 h5.5 M27 42 h4 M33 48 h3.5" stroke="${gold ? '#c58a1c' : '#d4762a'}" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M32 20 Q25 8 20 6 Q29 7 32 15 Q32 3 36 1 Q37 10 33.5 18 Q40 8 45 8 Q41 14 33 20Z" fill="#7fbf6a"/>
      <path d="M32 19 Q33 10 35.5 4" stroke="#5f9e4c" stroke-width="1.2" fill="none"/></g>`;
  const FOOD = {
    carrot: carrot(false),
    gold: carrot(true) + `<path d="M50 10 l1.6 3.6 3.6 1.6 -3.6 1.6 -1.6 3.6 -1.6 -3.6 -3.6 -1.6 3.6 -1.6Z" fill="#fff6cf"/><path d="M12 44 l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1Z" fill="#fff6cf"/>`,
    strawberry: `<path d="M32 58 C15 50 11 33 16 25 C21 17 30 20 32 22 C34 20 43 17 48 25 C53 33 49 50 32 58Z" fill="#ef545c"/>
      <path d="M32 58 C40 52 48 42 48 30 C52 38 48 50 32 58Z" fill="#c63a45" opacity=".5"/>
      <ellipse cx="23" cy="33" rx="4.5" ry="8" fill="#fff" opacity=".35" transform="rotate(20 23 33)"/>
      <g fill="#ffe79c">${[[26, 30], [36, 29], [43, 35], [21, 40], [31, 38], [40, 44], [27, 47], [34, 51], [24, 34]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.3" ry="2"/>`).join('')}</g>
      <path d="M32 23 L21 16 L27 22 L17 23 L28 26 L32 23 L36 26 L47 23 L37 22 L43 16Z" fill="#6fb35a"/><path d="M32 22 q0 -8 4 -12" stroke="#5d9a4a" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
    clover: `<path d="M32 36 Q34 48 30 60" stroke="#6aa255" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${[0, 120, 240].map(r => `<path transform="translate(32 30) rotate(${r})" d="M0 0 C-12 -6 -12 -20 -3 -19 C0 -19 0 -16 0 -14 C0 -16 0 -19 3 -19 C12 -20 12 -6 0 0Z" fill="#8cc677"/>`).join('')}
      ${[0, 120, 240].map(r => `<path transform="translate(32 30) rotate(${r})" d="M0 -2 L0 -13" stroke="#6aa255" stroke-width="1.2"/>`).join('')}
      <circle cx="27" cy="18" r="3" fill="#fff" opacity=".35"/>`,
    cupcake: `<path d="M17 36 L47 36 L42 58 Q32 61 22 58Z" fill="#f4b2a6"/>
      <g stroke="#e08d81" stroke-width="2">${[22, 27, 32, 37, 42].map(x => `<path d="M${x} 37 L${x + (x - 32) * .12} 58"/>`).join('')}</g>
      <path d="M14 37 Q10 28 20 26 Q18 15 32 16 Q46 15 44 26 Q54 28 50 37 Q32 42 14 37Z" fill="#fff4ea"/>
      <path d="M18 31 Q32 36 46 31" stroke="#f2d9c6" stroke-width="2" fill="none"/>
      <g fill="#f7a6b6"><rect x="22" y="24" width="4" height="1.6" rx=".8" transform="rotate(30 24 25)"/><rect x="36" y="27" width="4" height="1.6" rx=".8" transform="rotate(-20 38 28)"/></g>
      <g fill="#a6dcc2"><rect x="30" y="29" width="4" height="1.6" rx=".8"/></g>
      <circle cx="33" cy="13" r="5.5" fill="#e3424f"/><circle cx="31" cy="11" r="1.8" fill="#fff" opacity=".6"/><path d="M33 8 q2 -6 7 -7" stroke="#6b8a3c" stroke-width="1.6" fill="none"/>`,
    rock: `<path d="M12 46 Q9 30 22 22 Q34 14 46 22 Q56 30 53 44 Q50 54 32 55 Q15 55 12 46Z" fill="#9b938c"/>
      <path d="M14 44 Q32 52 51 42 Q50 54 32 55 Q15 55 14 44Z" fill="#7a726b"/>
      <ellipse cx="25" cy="28" rx="7" ry="4" fill="#fff" opacity=".28" transform="rotate(-25 25 28)"/>
      <path d="M24 36 l5 3 M40 36 l-5 3" stroke="#3a302a" stroke-width="2.2" stroke-linecap="round"/><path d="M28 45 q4 -3 8 0" stroke="#3a302a" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    burr: `<g stroke="#7a4b26" stroke-width="2.4" stroke-linecap="round">${Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return `<path d="M${32 + Math.cos(a) * 15} ${33 + Math.sin(a) * 15} L${32 + Math.cos(a) * 25} ${33 + Math.sin(a) * 25}"/>`; }).join('')}</g>
      <circle cx="32" cy="33" r="17" fill="#9a6a3c"/><circle cx="32" cy="33" r="17" fill="url(#g-ao)" opacity=".5"/>
      <ellipse cx="26" cy="27" rx="6" ry="4" fill="#fff" opacity=".25"/>
      <path d="M25 31 l5 2.4 M39 31 l-5 2.4" stroke="#3a2412" stroke-width="2.2" stroke-linecap="round"/><path d="M28 40 q4 -3 8 0" stroke="#3a2412" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    bee: `<ellipse cx="22" cy="22" rx="9" ry="12" fill="#fff" opacity=".75" transform="rotate(-30 22 22)"/><ellipse cx="40" cy="20" rx="9" ry="12" fill="#fff" opacity=".75" transform="rotate(25 40 20)"/>
      <ellipse cx="32" cy="38" rx="18" ry="15" fill="#f8cb4a"/>
      <path d="M22 27 Q25 38 22 49 M32 23 Q35 38 32 53 M42 27 Q45 38 42 49" stroke="#3a2a1e" stroke-width="5" fill="none" opacity=".9"/>
      <ellipse cx="25" cy="32" rx="5" ry="3" fill="#fff" opacity=".4"/>
      <circle cx="44" cy="36" r="2.2" fill="#2b1a16"/><path d="M13 40 l-6 2 6 2Z" fill="#3a2a1e"/>
      <path d="M44 25 q2 -8 7 -10 M47 27 q5 -6 10 -6" stroke="#3a2a1e" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
    daisy: daisy(32, 32, 2.8),
    mushroom: `<path d="M24 36 L22 54 Q32 58 42 54 L40 36Z" fill="#fff1e2"/><path d="M36 36 L37 54 Q40 54 42 54 L40 36Z" fill="#e8d2bd"/>
      <path d="M8 38 Q8 12 32 10 Q56 12 56 38 Q32 44 8 38Z" fill="#e55a4e"/><path d="M8 38 Q32 44 56 38 Q55 42 32 46 Q9 42 8 38Z" fill="#b8423a"/>
      <g fill="#fff6ec"><circle cx="22" cy="24" r="4.4"/><circle cx="38" cy="18" r="3.6"/><circle cx="46" cy="30" r="3"/><circle cx="30" cy="33" r="2.6"/></g>
      <ellipse cx="18" cy="20" rx="5" ry="3" fill="#fff" opacity=".3" transform="rotate(-30 18 20)"/>`,
    star: `<path d="M32 6 l7.6 15.6 17.2 2.4 -12.4 12 3 17 -15.4 -8.2 -15.4 8.2 3 -17 -12.4 -12 17.2 -2.4Z" fill="url(#g-gold)" stroke="#d3901e" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M24 26 q3 -4 7 -5" stroke="#fff8d8" stroke-width="2.6" stroke-linecap="round" fill="none"/>
      <circle cx="26" cy="34" r="1.8" fill="#6b3d14"/><circle cx="38" cy="34" r="1.8" fill="#6b3d14"/><path d="M29.5 38.5 q2.5 2 5 0" stroke="#6b3d14" stroke-width="1.4" fill="none" stroke-linecap="round"/>`,
    moon: `<path d="M40 8 A24 24 0 1 0 56 44 A20 20 0 1 1 40 8Z" fill="#fde9a8"/><path d="M40 8 A24 24 0 0 0 20 50 A24 24 0 0 1 40 8Z" fill="#fff8dc" opacity=".6"/>
      <circle cx="27" cy="40" r="3" fill="#f2d283"/><circle cx="20" cy="28" r="2" fill="#f2d283"/>`,
    heart: `<path d="M32 54 C8 38 8 18 22 14 C28 12 32 18 32 20 C32 18 36 12 42 14 C56 18 56 38 32 54Z" fill="#f47f8c"/>
      <path d="M32 54 C46 44 54 32 50 20 C56 32 50 44 32 54Z" fill="#d85c6c" opacity=".55"/><ellipse cx="21" cy="24" rx="5" ry="3.4" fill="#fff" opacity=".45" transform="rotate(-35 21 24)"/>`,
    acorn: `<path d="M18 30 Q18 54 32 58 Q46 54 46 30Z" fill="#c78a50"/><path d="M38 30 Q44 50 32 58 Q46 54 46 30Z" fill="#a46a36"/>
      <path d="M14 30 Q14 16 32 15 Q50 16 50 30 Q32 35 14 30Z" fill="#7d5130"/><g stroke="#5b3a20" stroke-width="1.2" opacity=".6"><path d="M20 22 l24 0 M18 27 l28 0"/></g>
      <path d="M32 15 q0 -6 4 -8" stroke="#5b3a20" stroke-width="2.6" fill="none" stroke-linecap="round"/><ellipse cx="24" cy="40" rx="3" ry="6" fill="#fff" opacity=".25"/>`,
    coin: `<circle cx="32" cy="32" r="26" fill="#d48b20"/><circle cx="32" cy="30" r="26" fill="url(#g-gold)"/>
      <circle cx="32" cy="30" r="19" fill="none" stroke="#e0a234" stroke-width="2.4"/>
      <g fill="#e6a43a" transform="translate(32 33) scale(.9)"><ellipse cx="0" cy="5" rx="7.5" ry="6"/><circle cx="-8" cy="-4.5" r="3.2"/><circle cx="-2.6" cy="-8.5" r="3.2"/><circle cx="2.6" cy="-8.5" r="3.2"/><circle cx="8" cy="-4.5" r="3.2"/></g>
      <ellipse cx="22" cy="18" rx="7" ry="4" fill="#fff" opacity=".55" transform="rotate(-30 22 18)"/>`,
    gift: `<rect x="12" y="28" width="40" height="28" rx="4" fill="#f39aa2"/><rect x="12" y="28" width="40" height="7" fill="#d46b77" opacity=".5"/>
      <rect x="9" y="20" width="46" height="11" rx="3.5" fill="#ffb3b8"/><rect x="28" y="20" width="8" height="36" fill="#f7c453"/>
      <path d="M32 20 Q20 6 16 14 Q14 20 32 20Z M32 20 Q44 6 48 14 Q50 20 32 20Z" fill="#f7c453"/><ellipse cx="19" cy="23" rx="5" ry="2" fill="#fff" opacity=".5"/>`,
  };
  const icon = (k, extra = '') => svg('0 0 64 64', FOOD[k] || '', extra);

  /* =========================================================
     界面线性图标（24×24）
     ========================================================= */
  const ui = (d, sw = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const UI = {
    home: ui('<path d="M4 11 L12 4 L20 11 V19 Q20 20 19 20 H15 V14 H9 V20 H5 Q4 20 4 19Z"/>'),
    tasks: ui('<rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 4 V3 H15 V4"/><path d="M9 12 l2 2 4 -4"/>'),
    compass: ui('<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5 L13.3 13.3 L8.5 15.5 L10.7 10.7Z"/>'),
    room: ui('<path d="M5 20 V12 Q5 7 12 7 Q19 7 19 12 V20"/><path d="M3 20 H21"/><path d="M9 20 V15 H15 V20"/><path d="M12 3 V7"/>'),
    album: ui('<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 16 l4.5 -4 3.5 3 2.5 -2 5.5 4"/><circle cx="15" cy="9.5" r="1.6"/>'),
    paw: `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="15.5" rx="5.2" ry="4.4"/><ellipse cx="5.6" cy="10.4" rx="2.2" ry="2.7"/><ellipse cx="9.4" cy="6.6" rx="2.2" ry="2.7"/><ellipse cx="14.6" cy="6.6" rx="2.2" ry="2.7"/><ellipse cx="18.4" cy="10.4" rx="2.2" ry="2.7"/></svg>`,
    back: ui('<path d="M14.5 5 L8 12 L14.5 19"/>', 2.4),
    close: ui('<path d="M6 6 L18 18 M18 6 L6 18"/>', 2.4),
    arrow: ui('<path d="M9.5 5.5 L16 12 L9.5 18.5"/>', 2.6),
    plus: ui('<path d="M12 5 V19 M5 12 H19"/>', 2.8),
    check: ui('<path d="M5.5 12.5 L10 17 L18.5 7.5"/>', 2.8),
    lock: ui('<rect x="5.5" y="10.5" width="13" height="10" rx="2.6"/><path d="M8.5 10.5 V8 Q8.5 4.5 12 4.5 Q15.5 4.5 15.5 8 V10.5"/><circle cx="12" cy="15.5" r=".8" fill="currentColor"/>'),
    camera: ui('<path d="M4 9 Q4 7 6 7 H8 L9.5 5 H14.5 L16 7 H18 Q20 7 20 9 V17 Q20 19 18 19 H6 Q4 19 4 17Z"/><circle cx="12" cy="13" r="3.4"/>'),
    gear: ui('<circle cx="12" cy="12" r="3"/><path d="M12 3 V5.5 M12 18.5 V21 M3 12 H5.5 M18.5 12 H21 M5.6 5.6 L7.4 7.4 M16.6 16.6 L18.4 18.4 M5.6 18.4 L7.4 16.6 M16.6 7.4 L18.4 5.6"/>'),
    sound: ui('<path d="M4 10 V14 H7.5 L12 18 V6 L7.5 10Z"/><path d="M15.5 9 Q17.5 12 15.5 15 M18 6.5 Q22 12 18 17.5"/>'),
    mute: ui('<path d="M4 10 V14 H7.5 L12 18 V6 L7.5 10Z"/><path d="M16 9.5 L21 14.5 M21 9.5 L16 14.5"/>'),
    music: ui('<path d="M9 17.5 V6 L19 4 V15.5"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/>'),
    heart: ui('<path d="M12 19.5 C4 14 3.5 8.5 7 6.5 C9.5 5 11.5 6.5 12 8 C12.5 6.5 14.5 5 17 6.5 C20.5 8.5 20 14 12 19.5Z"/>'),
    heartFill: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20 C4 14.5 3 8.5 6.8 6.2 C9.4 4.7 11.4 6.2 12 7.6 C12.6 6.2 14.6 4.7 17.2 6.2 C21 8.5 20 14.5 12 20Z"/></svg>`,
    clock: ui('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5 V12 L15 14"/>'),
    bolt: ui('<path d="M13 3 L5.5 13.5 H11.5 L10.5 21 L18.5 10 H12.5Z"/>'),
    drop: ui('<path d="M12 3.5 Q18.5 11 18.5 14.5 Q18.5 20.5 12 20.5 Q5.5 20.5 5.5 14.5 Q5.5 11 12 3.5Z"/>'),
    smile: ui('<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14 Q12 17.5 15.5 14"/><circle cx="9" cy="10" r=".8" fill="currentColor"/><circle cx="15" cy="10" r=".8" fill="currentColor"/>'),
    bowl: ui('<path d="M3.5 11.5 H20.5 Q20 18.5 12 18.5 Q4 18.5 3.5 11.5Z"/><path d="M8 11.5 Q8 7 12 7 Q16 7 16 11.5"/><path d="M12 7 V5"/>'),
    game: ui('<path d="M7 8 H17 Q21 8 21 13 Q21 18 18 18 Q16 18 14.5 15.5 H9.5 Q8 18 6 18 Q3 18 3 13 Q3 8 7 8Z"/><path d="M7.5 11 V14 M6 12.5 H9"/><circle cx="16" cy="11.5" r=".9" fill="currentColor"/><circle cx="17.5" cy="13.8" r=".9" fill="currentColor"/>'),
    moon: ui('<path d="M19 14.5 A8 8 0 1 1 9.5 5 A6.5 6.5 0 0 0 19 14.5Z"/>'),
    sun: ui('<circle cx="12" cy="12" r="4"/><path d="M12 3 V5 M12 19 V21 M3 12 H5 M19 12 H21 M5.6 5.6 L7 7 M17 17 L18.4 18.4 M5.6 18.4 L7 17 M17 7 L18.4 5.6"/>'),
    bath: ui('<path d="M4 12 H20 V14 Q20 19 15 19 H9 Q4 19 4 14Z"/><path d="M6 12 V6.5 Q6 4.5 8 4.5 Q10 4.5 10 6.5"/><circle cx="14" cy="8" r="1.4"/><circle cx="17.5" cy="6" r="1"/>'),
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8 l2.8 5.8 6.3 .9 -4.6 4.4 1.1 6.3 -5.6 -3 -5.6 3 1.1 -6.3 -4.6 -4.4 6.3 -.9Z"/></svg>`,
    starLine: ui('<path d="M12 3.5 l2.6 5.3 5.8 .8 -4.2 4.1 1 5.8 -5.2 -2.7 -5.2 2.7 1 -5.8 -4.2 -4.1 5.8 -.8Z"/>'),
    sparkle: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 Q13 10 22 12 Q13 14 12 22 Q11 14 2 12 Q11 10 12 2Z"/></svg>`,
    hanger: ui('<path d="M12 7.5 Q12 5 14 5 Q16 5 16 7 Q16 8.5 12 10.5 L3.5 16 Q3 17.5 4.5 17.5 H19.5 Q21 17.5 20.5 16 L12 10.5"/>'),
    hat: ui('<path d="M3 16.5 Q12 20 21 16.5"/><path d="M6 16 Q6 7 12 7 Q18 7 18 16"/>'),
    scarf: ui('<path d="M4 8 Q12 13 20 8 V11 Q12 16 4 11Z"/><path d="M14 13 L13 20 H17 L16.5 12.5"/>'),
    glasses: ui('<circle cx="7" cy="13" r="3.5"/><circle cx="17" cy="13" r="3.5"/><path d="M10.5 12.5 Q12 11 13.5 12.5 M3.5 12 L2.5 9 M20.5 12 L21.5 9"/>'),
    sofa: ui('<path d="M5 11 V8 Q5 6 7 6 H17 Q19 6 19 8 V11"/><path d="M3 13 Q3 11 5 11 Q7 11 7 13 V14 H17 V13 Q17 11 19 11 Q21 11 21 13 V17 H3Z"/><path d="M5 17 V19 M19 17 V19"/>'),
    plant: ui('<path d="M8 15 H16 L15 20 H9Z"/><path d="M12 15 V9 M12 11 Q8 11 7 6 Q11 6 12 10 M12 9 Q13 4 17 4 Q17 8 12 10"/>'),
    sparkles: ui('<path d="M12 4 Q12.8 9.5 18 11 Q12.8 12.5 12 18 Q11.2 12.5 6 11 Q11.2 9.5 12 4Z"/><path d="M18.5 3 v3 M17 4.5 h3 M5 17 v3 M3.5 18.5 h3"/>'),
    gift: ui('<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M3 9 H21 M12 9 V20"/><path d="M12 9 Q8 3 6 6 Q5 9 12 9 Q19 9 18 6 Q16 3 12 9"/>'),
    trash: ui('<path d="M5 7 H19 M9.5 7 V5 H14.5 V7 M7 7 L8 20 H16 L17 7"/>'),
    flag: ui('<path d="M6 21 V4"/><path d="M6 4.5 Q10 2.5 13 4.5 Q16 6.5 19 4.5 V12.5 Q16 14.5 13 12.5 Q10 10.5 6 12.5"/>'),
    rocket: ui('<path d="M12 3 Q17 7 16 14 L13.5 16.5 H10.5 L8 14 Q7 7 12 3Z"/><circle cx="12" cy="9.5" r="1.8"/><path d="M8.5 14 L6 17 L8.5 17.5 M15.5 14 L18 17 L15.5 17.5 M11 19 L12 21 L13 19"/>'),
  };

  /* =========================================================
     首页舞台背景
     ========================================================= */
  function homeBg(night) {
    const r = rng(11);
    let bokeh = '';
    for (let i = 0; i < 14; i++) {
      const x = 20 + r() * 350, y = 30 + r() * 140, s = 2 + r() * 5;
      bokeh += `<circle class="twinkle" style="animation-delay:${(r() * 4).toFixed(2)}s" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s.toFixed(1)}" fill="${night ? '#cfd9ff' : '#ffd9a8'}" opacity="${(.25 + r() * .4).toFixed(2)}"/>`;
    }
    return svg('0 0 390 380', `
      <rect width="390" height="380" fill="url(#g-home-wall)"/>
      <rect width="390" height="380" fill="url(#p-cream)" opacity=".25"/>
      <path d="M92 380 V170 Q92 68 195 68 Q298 68 298 170 V380Z" fill="${night ? '#3b3458' : 'url(#g-arch)'}"/>
      ${night ? `<path d="M92 380 V170 Q92 68 195 68 Q298 68 298 170 V380Z" fill="url(#p-stars)" opacity=".8"/><circle cx="246" cy="128" r="16" fill="#fff3c9"/><circle cx="254" cy="122" r="14" fill="#3b3458"/>` : ''}
      <path d="M92 380 V170 Q92 68 195 68 Q298 68 298 170 V380" fill="none" stroke="#c99178" stroke-width="5" opacity=".45"/>
      <path d="M80 380 V170 Q80 56 195 56 Q310 56 310 170 V380" fill="none" stroke="#2d1a14" stroke-width="10" opacity=".35"/>
      <ellipse cx="195" cy="230" rx="170" ry="140" fill="url(${night ? '#g-glow-blue' : '#g-glow'})" opacity="${night ? .18 : .42}"/>
      ${bokeh}
      <g transform="translate(36 236)">
        <path d="M18 48 Q-14 30 -6 -2 Q14 18 22 46Z" fill="#5f7d4c"/><path d="M26 46 Q6 0 30 -30 Q44 4 30 46Z" fill="#6f8f57"/>
        <path d="M30 46 Q50 6 80 0 Q74 34 36 50Z" fill="#587548"/><path d="M28 30 Q30 0 30 -26" stroke="#8fae73" stroke-width="1.4" fill="none"/>
        <path d="M2 64 L56 64 L50 100 Q29 106 8 100Z" fill="url(#g-pot)"/><rect x="-1" y="58" width="60" height="10" rx="4" fill="#c6704c"/></g>
      <g transform="translate(330 200)" opacity=".95">
        <rect x="-6" y="40" width="12" height="70" rx="3" fill="#6a4232"/>
        <path d="M-24 40 L-16 8 H16 L24 40Z" fill="url(#g-shade)"/>
        <ellipse cx="0" cy="40" rx="24" ry="4" fill="#e9b98a"/>
        <ellipse cx="0" cy="34" rx="60" ry="50" fill="url(#g-glow)" opacity="${night ? .7 : .45}"/></g>
      <ellipse cx="195" cy="372" rx="210" ry="40" fill="#24140f" opacity=".5"/>
      <g transform="translate(195 318)">
        <ellipse cx="0" cy="34" rx="132" ry="28" fill="#3a2219"/>
        <path d="M-132 0 V30 Q-132 58 0 58 Q132 58 132 30 V0Z" fill="url(#g-ped-side)"/>
        <ellipse cx="0" cy="0" rx="132" ry="28" fill="url(#g-ped-top)"/>
        <ellipse cx="0" cy="-2" rx="122" ry="23" fill="none" stroke="#f2c3a6" stroke-width="1.6" opacity=".55"/>
        <ellipse cx="-34" cy="-8" rx="60" ry="9" fill="#fff" opacity=".12"/></g>
      <rect width="390" height="380" fill="url(#g-vignette)"/>
      ${night ? '<rect width="390" height="380" fill="#1a1a40" opacity=".38"/>' : ''}
    `, 'preserveAspectRatio="xMidYMax slice"');
  }

  /* =========================================================
     小窝
     ========================================================= */
  const WALL = {
    wall_cream: `<rect width="390" height="250" fill="#efd3b9"/><rect width="390" height="250" fill="url(#p-cream)"/>`,
    wall_floral: `<rect width="390" height="250" fill="#f3d9c6"/><rect width="390" height="250" fill="url(#p-floral)" opacity=".9"/>`,
    wall_stripe: `<rect width="390" height="250" fill="#f6dcc6"/><rect width="390" height="250" fill="url(#p-stripes)" opacity=".75"/>`,
    wall_night: `<rect width="390" height="250" fill="#3c3659"/><rect width="390" height="250" fill="url(#p-stars)"/>`,
  };
  const cloud = (x, y, s = 1, c = '#fff', o = .9) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}" opacity="${o}"><circle cx="0" cy="0" r="9"/><circle cx="11" cy="-5" r="11"/><circle cx="24" cy="0" r="9"/><rect x="0" y="0" width="24" height="9"/></g>`;
  const WINDOW_VIEW = {
    win_sunset: `<rect x="220" y="36" width="96" height="130" fill="url(#g-sky-sunset)"/>
      <circle cx="270" cy="128" r="34" fill="url(#g-glow)"/><circle cx="270" cy="130" r="13" fill="#fff2cf"/>
      ${cloud(236, 76, .7)}${cloud(276, 62, .55, '#ffe9de')}
      <path d="M220 150 Q246 128 270 142 Q292 126 316 140 V166 H220Z" fill="#c98a76"/><path d="M220 158 Q260 144 316 156 V166 H220Z" fill="#a8705f"/>`,
    win_sakura: `<rect x="220" y="36" width="96" height="130" fill="url(#g-sky-sakura)"/>
      ${cloud(250, 120, .7)}
      <path d="M316 54 Q290 66 270 64 Q256 64 240 80 M290 64 Q286 82 296 92" stroke="#7b4f3c" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${[[302, 52], [286, 60], [270, 58], [258, 70], [244, 78], [292, 80], [296, 94], [312, 66], [278, 70]].map(([x, y], i) => blossom(x, y, .9 + (i % 3) * .15, i % 2 ? '#f8b8c4' : '#fbcfd6')).join('')}
      <g class="petals">${[[236, 100], [262, 118], [290, 130], [250, 140], [300, 112]].map(([x, y], i) => `<ellipse class="petal" style="animation-delay:${i * .9}s" cx="${x}" cy="${y}" rx="2.4" ry="1.4" fill="#f9bcc6"/>`).join('')}</g>`,
    win_rain: `<rect x="220" y="36" width="96" height="130" fill="url(#g-sky-rain)"/>
      ${cloud(232, 64, .9, '#cfd5df', .9)}${cloud(268, 54, .8, '#dfe3ea', .9)}
      <path d="M220 152 Q260 140 316 150 V166 H220Z" fill="#6c7a74"/>
      <g class="rain" stroke="#e8eef8" stroke-width="1.3" stroke-linecap="round" opacity=".75">${Array.from({ length: 16 }, (_, i) => `<path d="M${224 + i * 6} ${40 + (i * 37) % 90} l-3 9"/>`).join('')}</g>
      <g fill="#fff" opacity=".5"><circle cx="240" cy="120" r="1.8"/><circle cx="296" cy="96" r="1.4"/><circle cx="262" cy="140" r="1.6"/></g>`,
    win_night: `<rect x="220" y="36" width="96" height="130" fill="url(#g-sky-night)"/>
      ${Array.from({ length: 12 }, (_, i) => `<circle class="twinkle" style="animation-delay:${(i * .37).toFixed(2)}s" cx="${226 + (i * 53) % 86}" cy="${46 + (i * 29) % 80}" r="${1 + (i % 3) * .5}" fill="#fff4cc"/>`).join('')}
      <circle cx="290" cy="74" r="13" fill="#fdf0c2"/><circle cx="296" cy="70" r="11" fill="#2a2a52"/>
      <path d="M220 150 Q250 136 280 148 Q300 140 316 146 V166 H220Z" fill="#2c2b4a"/>`,
  };
  const SEAT = {
    seat_beanbag: `<g transform="translate(80 248)" filter="url(#f-fuzz)">
      <ellipse cx="0" cy="40" rx="70" ry="10" fill="#4a2a1c" opacity=".35"/>
      <path d="M-62 30 Q-72 -10 -40 -38 Q-6 -62 30 -44 Q66 -26 64 14 Q62 40 0 42 Q-58 42 -62 30Z" fill="#f6ebdc"/>
      <path d="M-62 30 Q-40 8 0 14 Q44 8 64 14 Q62 40 0 42 Q-58 42 -62 30Z" fill="#e6d4be"/>
      <ellipse cx="-20" cy="-30" rx="26" ry="10" fill="#fff" opacity=".7" transform="rotate(-18 -20 -30)"/>
      <path d="M-30 -2 Q-34 -26 -6 -30 Q22 -30 20 -6 Q16 10 -6 10 Q-28 10 -30 -2Z" fill="#f2a9a0"/>
      <path d="M-24 -10 Q-6 -2 14 -10" stroke="#e08c84" stroke-width="1.4" fill="none"/></g>`,
    seat_arm: `<g transform="translate(80 244)">
      <ellipse cx="0" cy="44" rx="68" ry="9" fill="#4a2a1c" opacity=".35"/>
      <rect x="-48" y="30" width="7" height="16" rx="3" fill="#6b4029"/><rect x="41" y="30" width="7" height="16" rx="3" fill="#6b4029"/>
      <path d="M-44 0 Q-46 -54 0 -56 Q46 -54 44 0Z" fill="#d79b45"/><path d="M-30 -6 Q-32 -42 0 -44 Q32 -42 30 -6Z" fill="#e8b25a"/>
      <g stroke="#c08534" stroke-width="1.4" opacity=".6"><path d="M-14 -44 V-8 M14 -44 V-8 M0 -46 V-8"/></g>
      <path d="M-50 34 Q-62 34 -62 14 Q-62 -6 -46 -6 Q-36 -6 -36 10 V34Z" fill="#c98b3c"/><path d="M50 34 Q62 34 62 14 Q62 -6 46 -6 Q36 -6 36 10 V34Z" fill="#c98b3c"/>
      <path d="M-38 6 Q0 -2 38 6 Q42 30 38 34 H-38 Q-42 30 -38 6Z" fill="#e7ad55"/>
      <ellipse cx="-14" cy="-40" rx="14" ry="5" fill="#fff" opacity=".22"/></g>`,
    seat_mush: `<g transform="translate(78 250)">
      <ellipse cx="0" cy="38" rx="44" ry="8" fill="#4a2a1c" opacity=".35"/>
      <path d="M-18 -4 Q-22 30 -16 38 H16 Q22 30 18 -4Z" fill="#fff1e2"/><path d="M6 -4 Q10 30 16 38 Q22 30 18 -4Z" fill="#e7d0bb"/>
      <path d="M-46 -2 Q-44 -46 0 -48 Q44 -46 46 -2 Q0 8 -46 -2Z" fill="#e35a4f"/><path d="M-46 -2 Q0 8 46 -2 Q44 4 0 10 Q-44 4 -46 -2Z" fill="#b8423a"/>
      <g fill="#fff6ec"><circle cx="-22" cy="-24" r="7"/><circle cx="6" cy="-36" r="5.4"/><circle cx="28" cy="-18" r="5"/><circle cx="-2" cy="-14" r="3.6"/></g>
      <ellipse cx="-24" cy="-36" rx="10" ry="4" fill="#fff" opacity=".3" transform="rotate(-20 -24 -36)"/></g>`,
    seat_cloud: `<g transform="translate(80 252)" filter="url(#f-fuzz)">
      <ellipse cx="0" cy="38" rx="72" ry="9" fill="#4a2a1c" opacity=".3"/>
      <path d="M-64 30 Q-78 6 -56 -6 Q-56 -40 -22 -36 Q-6 -60 22 -42 Q56 -46 56 -10 Q78 2 64 30 Q0 42 -64 30Z" fill="#fde7ea"/>
      <path d="M-64 30 Q-40 14 0 18 Q40 12 64 30 Q0 42 -64 30Z" fill="#f4c9d0"/>
      <ellipse cx="-24" cy="-26" rx="20" ry="8" fill="#fff" opacity=".8"/>
      <circle cx="-14" cy="-4" r="2" fill="#7a4a46"/><circle cx="10" cy="-4" r="2" fill="#7a4a46"/><path d="M-6 2 q4 3 8 0" stroke="#7a4a46" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <ellipse cx="-22" cy="4" rx="5" ry="3" fill="#f7a7b0" opacity=".7"/><ellipse cx="18" cy="4" rx="5" ry="3" fill="#f7a7b0" opacity=".7"/></g>`,
  };
  const RUG = {
    rug_round: `<g filter="url(#f-fuzz)"><ellipse cx="200" cy="296" rx="150" ry="30" fill="#e9a99d"/><ellipse cx="200" cy="295" rx="128" ry="24" fill="#f4c0b2"/>
      <ellipse cx="200" cy="294" rx="100" ry="17" fill="none" stroke="#fff1e6" stroke-width="2" stroke-dasharray="4 5" opacity=".8"/></g>`,
    rug_plaid: `<ellipse cx="200" cy="296" rx="150" ry="30" fill="#c95a50"/><ellipse cx="200" cy="295" rx="142" ry="26" fill="url(#p-plaid)"/>
      <ellipse cx="200" cy="295" rx="142" ry="26" fill="none" stroke="#fff4e4" stroke-width="2" stroke-dasharray="2 4"/>`,
    rug_cloud: `<g filter="url(#f-fuzz)"><path d="M60 300 Q48 284 74 280 Q86 264 120 270 Q150 258 190 266 Q236 256 270 268 Q310 262 326 280 Q352 286 340 302 Q320 322 200 322 Q78 322 60 300Z" fill="#fbf6f0"/>
      <path d="M70 302 Q130 312 200 312 Q280 312 334 300 Q320 322 200 322 Q78 322 70 302Z" fill="#eadfd3"/></g>`,
    rug_berry: `<g filter="url(#f-fuzz)"><path d="M200 324 Q80 320 62 294 Q60 276 120 270 Q160 262 200 268 Q240 262 280 270 Q340 276 338 294 Q320 320 200 324Z" fill="#ec6a6e"/>
      <g fill="#ffe8a6">${Array.from({ length: 16 }, (_, i) => `<ellipse cx="${84 + (i * 61) % 232}" cy="${280 + (i * 13) % 34}" rx="2.4" ry="3.4"/>`).join('')}</g>
      <path d="M150 272 Q200 256 250 272 L236 278 L222 270 L200 280 L178 270 L164 278Z" fill="#7cbf68"/></g>`,
  };
  const LAMP = {
    lamp_floor: (on) => `<g data-hit="lamp" class="hit">
      ${on ? `<ellipse cx="350" cy="150" rx="120" ry="110" fill="url(#g-glow)" opacity=".75"/><path d="M328 140 L300 290 H400 L372 140Z" fill="#ffe3b6" opacity=".14"/>` : ''}
      <ellipse cx="350" cy="292" rx="24" ry="6" fill="#4a2a1c" opacity=".4"/><ellipse cx="350" cy="288" rx="18" ry="5" fill="#6b4029"/>
      <rect x="347" y="140" width="6" height="150" rx="3" fill="#8a5a3c"/>
      <path d="M324 140 L332 98 H368 L376 140Z" fill="${on ? '#fff3df' : '#e8d3bd'}"/><path d="M324 140 L332 98 H344 L338 140Z" fill="#fff" opacity="${on ? .5 : .2}"/>
      <ellipse cx="350" cy="140" rx="26" ry="4.5" fill="${on ? '#ffe2a8' : '#c7ad92'}"/>
      <path d="M362 140 v14" stroke="#c99a6e" stroke-width="1.4"/><circle cx="362" cy="156" r="2.4" fill="#d9a36d"/></g>`,
    lamp_mush: (on) => `<g data-hit="lamp" class="hit">
      ${on ? `<ellipse cx="346" cy="244" rx="100" ry="80" fill="url(#g-glow-pink)" opacity=".75"/>` : ''}
      <ellipse cx="346" cy="294" rx="30" ry="6" fill="#4a2a1c" opacity=".4"/>
      <path d="M334 256 Q330 284 336 292 H356 Q362 284 358 256Z" fill="#fff1e2"/>
      <path d="M314 258 Q314 220 346 218 Q378 220 378 258 Q346 266 314 258Z" fill="${on ? '#ff9c8a' : '#d9675a'}"/>
      <path d="M314 258 Q346 266 378 258 Q377 262 346 268 Q315 262 314 258Z" fill="#b8423a"/>
      <g fill="${on ? '#fffbe8' : '#fff1e2'}"><circle cx="332" cy="236" r="5"/><circle cx="352" cy="228" r="4"/><circle cx="366" cy="244" r="3.4"/><circle cx="342" cy="248" r="2.6"/></g>
      ${on ? '<path d="M314 258 Q314 220 346 218 Q378 220 378 258" fill="none" stroke="#fff3d4" stroke-width="2" opacity=".6"/>' : ''}</g>`,
    lamp_string: (on) => {
      const cols = ['#f7c453', '#f39aa2', '#a6dcc2', '#c9b2ea', '#ffd7a0'];
      let b = '';
      for (let i = 0; i < 13; i++) {
        const x = 12 + i * 30, y = 18 + Math.sin(i / 12 * Math.PI) * 26 + (i % 2) * 3, c = cols[i % 5];
        b += `${on ? `<circle cx="${x}" cy="${y + 7}" r="11" fill="${c}" opacity=".28" class="twinkle" style="animation-delay:${i * .23}s"/>` : ''}<rect x="${x - 2}" y="${y - 2}" width="4" height="4" fill="#6b4a3a"/><ellipse cx="${x}" cy="${y + 6}" rx="3.6" ry="5" fill="${on ? c : '#bca898'}"/>`;
      }
      return `<g data-hit="lamp" class="hit"><path d="M0 14 Q195 66 390 14" stroke="#6b4a3a" stroke-width="1.4" fill="none"/>${b}
        <path d="M0 14 Q195 66 390 14 V40 H0Z" fill="transparent"/></g>`;
    },
    lamp_moon: (on) => `<g data-hit="lamp" class="hit">
      ${on ? `<ellipse cx="350" cy="236" rx="96" ry="84" fill="url(#g-glow-blue)" opacity=".6"/><ellipse cx="350" cy="236" rx="56" ry="50" fill="url(#g-glow)" opacity=".7"/>` : ''}
      <ellipse cx="350" cy="294" rx="24" ry="5" fill="#4a2a1c" opacity=".4"/>
      <path d="M338 292 L344 262 H356 L362 292Z" fill="#8a5a3c"/>
      <circle cx="350" cy="238" r="27" fill="${on ? '#fff6d6' : '#e5dccb'}"/>
      <g fill="${on ? '#f4e2a4' : '#cfc3ad'}"><circle cx="340" cy="230" r="5"/><circle cx="358" cy="246" r="4"/><circle cx="356" cy="224" r="2.6"/></g>
      <ellipse cx="340" cy="222" rx="9" ry="5" fill="#fff" opacity=".5"/></g>`,
  };
  const PLANT = {
    plant_monstera: `<g data-hit="plant" class="hit" transform="translate(292 248)">
      <ellipse cx="0" cy="46" rx="26" ry="5" fill="#4a2a1c" opacity=".4"/>
      <path d="M-4 10 Q-36 0 -40 -26 Q-14 -24 -2 6Z" fill="#5f8a4e"/><path d="M2 8 Q8 -30 -6 -54 Q20 -44 10 8Z" fill="#6f9d5a"/>
      <path d="M4 10 Q30 -18 46 -16 Q42 10 8 14Z" fill="#567f46"/>
      <path d="M-30 -14 L-20 -4 M-34 -22 L-14 -6 M0 -40 L4 -20 M6 -46 L6 -24 M30 -10 L18 2" stroke="#3f6634" stroke-width="2" stroke-linecap="round"/>
      <path d="M-20 12 L20 12 L16 44 Q0 48 -16 44Z" fill="url(#g-pot)"/><rect x="-23" y="8" width="46" height="8" rx="3.5" fill="#c6704c"/></g>`,
    plant_tulip: `<g data-hit="plant" class="hit" transform="translate(292 250)">
      <ellipse cx="0" cy="44" rx="22" ry="5" fill="#4a2a1c" opacity=".4"/>
      <path d="M-8 4 Q-14 -24 -18 -40 M0 4 Q2 -30 0 -50 M8 4 Q14 -22 20 -36" stroke="#6fa356" stroke-width="2.6" fill="none"/>
      <path d="M-4 0 Q-22 -12 -24 -30 Q-10 -18 -2 -2Z M4 0 Q22 -14 26 -26 Q12 -18 4 -2Z" fill="#7cb362"/>
      ${[[-18, -44, '#f39aa2'], [0, -54, '#f7c453'], [20, -40, '#f4887f']].map(([x, y, c]) => `<path transform="translate(${x} ${y})" d="M-7 0 Q-8 -12 -4 -14 L0 -8 L4 -14 Q8 -12 7 0 Q0 7 -7 0Z" fill="${c}"/>`).join('')}
      <path d="M-14 4 Q-16 30 -10 42 H10 Q16 30 14 4Z" fill="#cfe6ee" opacity=".85"/><path d="M-14 4 H14" stroke="#fff" stroke-width="2"/><ellipse cx="-6" cy="22" rx="3" ry="10" fill="#fff" opacity=".55"/></g>`,
    plant_cactus: `<g data-hit="plant" class="hit" transform="translate(292 254)">
      <ellipse cx="0" cy="40" rx="22" ry="5" fill="#4a2a1c" opacity=".4"/>
      <path d="M-10 10 V-30 Q-10 -42 0 -42 Q10 -42 10 -30 V10Z" fill="#7fb57a"/><path d="M10 -14 H18 Q24 -14 24 -22 V-30 Q24 -36 19 -36 Q15 -36 15 -30 V-22 H10Z" fill="#7fb57a"/>
      <path d="M-10 -6 H-18 Q-24 -6 -24 -14 V-18 Q-24 -24 -19 -24 Q-15 -24 -15 -18 V-14 H-10Z" fill="#7fb57a"/>
      <path d="M-3 -38 V8 M4 -36 V8" stroke="#5f9a5c" stroke-width="1.4"/>${blossom(0, -44, .8, '#f39aa2')}
      <path d="M-16 10 L16 10 L13 38 Q0 41 -13 38Z" fill="#f2c9a8"/><rect x="-18" y="6" width="36" height="7" rx="3" fill="#e9b48e"/>
      <circle cx="-5" cy="24" r="1.6" fill="#7a4a46"/><circle cx="5" cy="24" r="1.6" fill="#7a4a46"/><path d="M-2 28 q2 2 4 0" stroke="#7a4a46" stroke-width="1.2" fill="none"/></g>`,
    plant_pothos: `<g data-hit="plant" class="hit" transform="translate(176 0)">
      <path d="M0 0 V34" stroke="#8a6a4a" stroke-width="1.4"/><path d="M-16 34 Q0 30 16 34 L12 54 Q0 58 -12 54Z" fill="#e7d3bd"/><path d="M-16 34 H16" stroke="#cdb59b" stroke-width="2"/>
      <path d="M-10 50 Q-26 80 -18 120 M8 52 Q22 90 14 136 M0 54 Q-4 80 2 100" stroke="#6f9d5a" stroke-width="1.6" fill="none"/>
      ${[[-12, 60, -30], [-20, 78, 20], [-22, 96, -10], [-18, 116, 30], [12, 64, 30], [18, 84, -20], [20, 104, 20], [16, 126, -10], [-2, 72, 0], [2, 94, 10], [-8, 44, -50], [10, 44, 40]].map(([x, y, r], i) =>
        `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 -8 Q8 -6 7 2 Q4 8 0 9 Q-4 8 -7 2 Q-8 -6 0 -8Z" fill="${i % 2 ? '#7fb362' : '#6a9d50'}"/>`).join('')}</g>`,
  };
  function clockDeco() {
    const d = new Date(), h = d.getHours() % 12 + d.getMinutes() / 60, m = d.getMinutes();
    return `<g data-hit="deco" class="hit" transform="translate(86 96)">
      <path d="M0 -44 l-8 -10 h16Z" fill="#8a5a3c"/>
      <circle r="38" fill="#8a5a3c"/><circle r="32" fill="#fff6e6"/><circle r="32" fill="url(#g-ao)" opacity=".25"/>
      ${Array.from({ length: 12 }, (_, i) => `<circle cx="${Math.sin(i / 6 * Math.PI) * 26}" cy="${-Math.cos(i / 6 * Math.PI) * 26}" r="${i % 3 ? 1.4 : 2.4}" fill="#c08a64"/>`).join('')}
      <path d="M0 0 L${(Math.sin(h / 6 * Math.PI) * 15).toFixed(1)} ${(-Math.cos(h / 6 * Math.PI) * 15).toFixed(1)}" stroke="#5a3424" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M0 0 L${(Math.sin(m / 30 * Math.PI) * 23).toFixed(1)} ${(-Math.cos(m / 30 * Math.PI) * 23).toFixed(1)}" stroke="#e07d63" stroke-width="2" stroke-linecap="round"/>
      <circle r="3" fill="#5a3424"/>
      <g transform="translate(0 48)"><path d="M0 -10 V8" stroke="#8a5a3c" stroke-width="2"/><circle cy="12" r="7" fill="url(#g-gold)" class="swing"/></g></g>`;
  }
  const DECO = {
    deco_frame: () => `<g data-hit="deco" class="hit" transform="translate(52 52)">
      <rect x="0" y="0" width="76" height="88" rx="4" fill="#8a5a3c" filter="url(#f-drop)"/><rect x="7" y="7" width="62" height="74" rx="2" fill="#f8e7d4"/>
      <g fill="#d99a7c" transform="translate(38 46) scale(1.25)"><ellipse cx="0" cy="5" rx="9" ry="7.5"/><circle cx="-9" cy="-6" r="3.8"/><circle cx="-3" cy="-11" r="3.8"/><circle cx="3" cy="-11" r="3.8"/><circle cx="9" cy="-6" r="3.8"/></g>
      <rect x="7" y="7" width="62" height="20" fill="#fff" opacity=".18"/></g>`,
    deco_shelf: () => `<g data-hit="deco" class="hit" transform="translate(30 60)">
      <rect x="0" y="56" width="120" height="8" rx="2" fill="url(#g-wood)" filter="url(#f-drop)"/><rect x="0" y="116" width="120" height="8" rx="2" fill="url(#g-wood)" filter="url(#f-drop)"/>
      ${[[8, 22, 34, '#c86a5a'], [22, 18, 40, '#e7b35a'], [34, 14, 30, '#8fb38a'], [48, 20, 36, '#c9b2ea']].map(([x, w, h, c]) => `<rect x="${x}" y="${56 - h}" width="${w - 4}" height="${h}" rx="2" fill="${c}"/><rect x="${x + 2}" y="${60 - h}" width="${w - 8}" height="3" fill="#fff" opacity=".35"/>`).join('')}
      <g transform="translate(92 40)"><path d="M-8 0 L8 0 L6 16 H-6Z" fill="url(#g-pot)"/><circle cx="-5" cy="-4" r="7" fill="#7fb362"/><circle cx="5" cy="-6" r="7" fill="#6a9d50"/><circle cx="0" cy="-12" r="6" fill="#86ba6a"/></g>
      <rect x="10" y="98" width="40" height="18" rx="3" fill="#f4c0b2"/><rect x="10" y="88" width="40" height="10" rx="3" fill="#f7d2c6"/>
      <g transform="translate(84 104)"><circle r="12" fill="#3a2a24"/><circle r="4" fill="#e07d63"/></g></g>`,
    deco_record: (on) => `<g data-hit="deco" class="hit" transform="translate(40 92)">
      <rect x="0" y="40" width="104" height="44" rx="6" fill="url(#g-wood)" filter="url(#f-drop)"/>
      <rect x="6" y="46" width="92" height="6" rx="3" fill="#c48b5c"/>
      <rect x="6" y="20" width="92" height="22" rx="4" fill="#d6a46e"/>
      <g transform="translate(46 30)"><ellipse rx="30" ry="8" fill="#2e2320"/><ellipse rx="10" ry="2.8" fill="#e07d63"/>
        <ellipse rx="22" ry="5.6" fill="none" stroke="#4a3a34" stroke-width="1"/>${on ? '<ellipse rx="26" ry="7" fill="none" stroke="#fff" stroke-width="1" opacity=".25" class="spin-sheen"/>' : ''}</g>
      <path d="M84 24 L76 30" stroke="#e9e1d6" stroke-width="2.4" stroke-linecap="round"/><circle cx="86" cy="24" r="3" fill="#e9e1d6"/>
      <circle cx="24" cy="66" r="6" fill="#f3e2c8"/><circle cx="80" cy="66" r="6" fill="#f3e2c8"/><rect x="38" y="62" width="28" height="8" rx="4" fill="#3e2a20" opacity=".5"/>
      ${on ? `<g class="notes" fill="#ffe2b0"><path d="M108 10 v-14 l8 -2 v12" stroke="#ffe2b0" stroke-width="1.6" fill="none"/><circle cx="106" cy="10" r="2.6"/><circle cx="114" cy="8" r="2.6"/></g>` : ''}</g>`,
    deco_clock: () => clockDeco(),
    deco_bunting: () => {
      const cols = ['#f39aa2', '#f7c453', '#a6dcc2', '#c9b2ea', '#f4887f', '#ffd7a0'];
      let f = '';
      for (let i = 0; i < 6; i++) { const x = 18 + i * 26, y = 26 + Math.sin((i + .5) / 6 * Math.PI) * 18; f += `<path d="M${x} ${y} L${x + 22} ${y + 1} L${x + 11} ${y + 24}Z" fill="${cols[i]}"/><path d="M${x + 4} ${y + 3} L${x + 18} ${y + 3}" stroke="#fff" stroke-width="1.4" opacity=".5"/>`; }
      return `<g data-hit="deco" class="hit"><path d="M10 22 Q90 62 180 22" stroke="#8a6a4a" stroke-width="1.5" fill="none"/>${f}
        <g transform="translate(60 110)"><rect x="-24" y="-30" width="48" height="60" rx="3" fill="#8a5a3c"/><rect x="-19" y="-25" width="38" height="50" fill="#a6c7d8"/><path d="M-19 25 L-6 4 L4 14 L10 6 L19 18 V25Z" fill="#8fb38a"/><circle cx="8" cy="-10" r="5" fill="#fff2cf"/></g></g>`;
    },
  };

  function roomSVG(cfg, o = {}) {
    const lampOn = cfg.lampOn !== false;
    const night = cfg.wall === 'wall_night' || cfg.window === 'win_night';
    const bx = o.bunnyX ?? 140, by = o.bunnyY ?? 152;
    return svg(o.vb || '0 0 390 330', `
      <g data-hit="wall">${WALL[cfg.wall] || WALL.wall_cream}</g>
      <rect y="190" width="390" height="60" fill="${night ? '#2f2a48' : '#c99876'}" opacity=".55"/>
      <path d="M0 190 H390" stroke="${night ? '#5a5280' : '#e6bf9c'}" stroke-width="3"/>
      ${[30, 110, 190, 270, 350].map(x => `<rect x="${x - 30}" y="200" width="60" height="40" rx="4" fill="none" stroke="${night ? '#5a5280' : '#ad7c5c'}" stroke-width="1.5" opacity=".6"/>`).join('')}
      <rect y="244" width="390" height="10" fill="#6b3f28"/>
      <g data-hit="window" class="hit">
        <g clip-path="url(#cp-window)">${WINDOW_VIEW[cfg.window] || WINDOW_VIEW.win_sunset}</g>
        <path d="M228 158 V86 Q228 42 268 42 Q308 42 308 86 V158Z" fill="none" stroke="#8a5a3c" stroke-width="8"/>
        <path d="M268 44 V158 M230 104 H306" stroke="#8a5a3c" stroke-width="4"/>
        <path d="M236 92 Q240 56 266 50" stroke="#fff" stroke-width="3" opacity=".35" fill="none" stroke-linecap="round"/>
        <rect x="218" y="156" width="100" height="10" rx="3" fill="#a06a46"/>
        <path d="M222 40 Q214 100 226 160 Q232 120 236 40Z" fill="#f6c9bd" opacity=".85"/><path d="M314 40 Q322 100 310 160 Q304 120 300 40Z" fill="#f6c9bd" opacity=".85"/>
        <path d="M215 36 H321" stroke="#7a4a32" stroke-width="4" stroke-linecap="round"/></g>
      ${(DECO[cfg.deco] || DECO.deco_frame)(o.music)}
      <rect y="250" width="390" height="80" fill="url(#g-floor)"/>
      <g stroke="#6e4128" stroke-width="1.2" opacity=".55"><path d="M0 266 H390 M0 286 H390 M0 310 H390"/>
        ${[[40, 250], [140, 250], [260, 250], [360, 250], [90, 266], [210, 266], [320, 266], [30, 286], [170, 286], [300, 286], [110, 310], [250, 310]].map(([x, y]) => `<path d="M${x} ${y} v${y === 250 ? 16 : y === 266 ? 20 : y === 286 ? 24 : 20}"/>`).join('')}</g>
      <g data-hit="rug" class="hit">${RUG[cfg.rug] || RUG.rug_round}</g>
      <g data-hit="seat" class="hit">${SEAT[cfg.seat] || SEAT.seat_beanbag}</g>
      ${cfg.lamp === 'lamp_string' ? '' : (LAMP[cfg.lamp] || LAMP.lamp_floor)(lampOn)}
      ${PLANT[cfg.plant] || ''}
      ${o.noBunny ? '' : `<g class="room-bunny" data-hit="bunny" style="transform:translate(${bx}px,${by}px)"><svg width="118" height="137" viewBox="0 0 200 232" overflow="visible">${bunnyInner({ expr: o.expr, outfit: o.outfit })}</svg></g>`}
      ${cfg.lamp === 'lamp_string' ? LAMP.lamp_string(lampOn) : ''}
      ${!lampOn ? '<rect width="390" height="330" fill="#1a1530" opacity=".42" pointer-events="none"/>' : ''}
      ${night && lampOn ? '<rect width="390" height="330" fill="#2a2450" opacity=".18" pointer-events="none"/>' : ''}
      <rect width="390" height="330" fill="url(#g-vignette)" opacity=".7" pointer-events="none"/>
    `, o.extra || 'preserveAspectRatio="xMidYMid slice"');
  }

  /* 小窝物品图标：用对应局部放大展示 */
  const ROOM_ICON_VB = {
    wall: '0 0 120 120', window: '208 30 120 140', seat: '0 180 160 128', rug: '40 250 320 80',
    lamp: '290 80 100 230', plant: '252 180 80 130', deco: '20 30 150 150'
  };
  function roomItemIcon(slot, id) {
    let inner = '';
    if (slot === 'wall') inner = (WALL[id] || '');
    else if (slot === 'window') return svg('208 30 120 140', `<g clip-path="url(#cp-window)">${WINDOW_VIEW[id]}</g>
        <path d="M228 158 V86 Q228 42 268 42 Q308 42 308 86 V158Z" fill="none" stroke="#8a5a3c" stroke-width="8"/>
        <path d="M268 44 V158 M230 104 H306" stroke="#8a5a3c" stroke-width="4"/><rect x="218" y="156" width="100" height="10" rx="3" fill="#a06a46"/>`);
    else if (slot === 'seat') inner = SEAT[id];
    else if (slot === 'rug') inner = RUG[id];
    else if (slot === 'lamp') {
      if (id === 'lamp_string') return svg('0 0 390 80', LAMP.lamp_string(true));
      inner = LAMP[id](true);
    } else if (slot === 'plant') {
      if (id === 'plant_pothos') return svg('130 0 92 150', PLANT[id]);
      inner = PLANT[id];
    } else if (slot === 'deco') {
      const vb = { deco_frame: '40 40 100 112', deco_shelf: '20 20 140 172', deco_record: '30 60 136 124', deco_clock: '36 34 100 140', deco_bunting: '0 10 190 170' }[id];
      return svg(vb, DECO[id](true));
    }
    return svg(ROOM_ICON_VB[slot], inner);
  }

  /* =========================================================
     场景（相册 / 小游戏 / 冒险卡片）300×300
     ========================================================= */
  function scatterDaisies(seed, n, y0, y1) {
    const r = rng(seed); let s = '';
    for (let i = 0; i < n; i++) s += daisy((r() * 300).toFixed(0), (y0 + r() * (y1 - y0)).toFixed(0), .45 + r() * .4);
    return s;
  }
  function tree(x, y, s = 1, c1 = '#6f8f57', c2 = '#87a768') {
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-6" width="8" height="26" rx="3" fill="#7b5236"/>
      <circle cx="0" cy="-22" r="20" fill="${c1}"/><circle cx="-12" cy="-12" r="13" fill="${c1}"/><circle cx="12" cy="-12" r="13" fill="${c1}"/>
      <circle cx="-5" cy="-28" r="9" fill="${c2}" opacity=".85"/></g>`;
  }
  function pine(x, y, s = 1, c = '#4f6f45') {
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="-4" width="6" height="14" fill="#6b4a32"/>
      <path d="M0 -48 L-16 -20 H-9 L-20 0 H20 L9 -20 H16Z" fill="${c}"/><path d="M0 -48 L-6 -36 L0 -38Z M0 -26 L-8 -14 L0 -16Z" fill="#fff" opacity=".12"/></g>`;
  }
  function mushroom(x, y, s = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-4 -2 Q-5 8 -3 10 H3 Q5 8 4 -2Z" fill="#fff1e2"/>
      <path d="M-12 -1 Q-12 -14 0 -15 Q12 -14 12 -1 Q0 2 -12 -1Z" fill="#e35a4f"/><circle cx="-5" cy="-8" r="2" fill="#fff6ec"/><circle cx="4" cy="-10" r="1.6" fill="#fff6ec"/></g>`;
  }
  function stars(seed, n, h, c = '#fff4cc') {
    const r = rng(seed); let s = '';
    for (let i = 0; i < n; i++) s += `<circle class="twinkle" style="animation-delay:${(r() * 3).toFixed(2)}s" cx="${(r() * 300).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(.6 + r() * 1.4).toFixed(1)}" fill="${c}"/>`;
    return s;
  }
  const SCENES = {
    meadow: () => `<rect width="300" height="300" fill="url(#g-sky-day)"/>
      <circle cx="226" cy="74" r="70" fill="url(#g-glow)"/><circle cx="226" cy="74" r="20" fill="#fff4d6"/>
      ${cloud(40, 60, 1.1)}${cloud(150, 40, .8, '#fff', .8)}
      <path d="M0 176 Q60 140 130 166 Q200 134 300 170 V300 H0Z" fill="#c6cd92"/>
      <path d="M0 206 Q80 178 160 204 Q230 190 300 210 V300 H0Z" fill="#a9bd74"/>
      <path d="M0 246 Q150 230 300 248 V300 H0Z" fill="#94ab62"/>
      ${tree(40, 186, .9)}${tree(262, 180, .75, '#7a9a5e', '#93b374')}
      <g stroke="#9a7650" stroke-width="3" stroke-linecap="round"><path d="M196 218 v-22 M216 220 v-22 M236 222 v-22 M190 204 H242 M190 212 H242"/></g>
      ${scatterDaisies(3, 18, 214, 296)}`,
    forest: () => `<rect width="300" height="300" fill="url(#g-forest)"/>
      <g opacity=".18" fill="#fff6d8"><path d="M120 0 L80 300 H120 L150 0Z"/><path d="M190 0 L170 300 H196 L210 0Z"/></g>
      ${pine(30, 190, 1.6, '#5a7a4e')}${pine(270, 180, 1.8, '#4f6f45')}${pine(80, 160, 1.1, '#6a8a58')}${pine(220, 150, 1.2, '#6a8a58')}
      <path d="M0 224 Q150 200 300 226 V300 H0Z" fill="#6d8a4f"/><path d="M0 262 Q150 246 300 262 V300 H0Z" fill="#5d7a44"/>
      ${mushroom(44, 250, 1.6)}${mushroom(70, 262, 1.1)}${mushroom(250, 256, 1.4)}
      <g fill="url(#g-firefly)">${[[60, 120], [240, 100], [150, 80], [200, 160], [100, 190]].map(([x, y], i) => `<circle class="twinkle" style="animation-delay:${i * .6}s" cx="${x}" cy="${y}" r="7"/>`).join('')}</g>`,
    pond: () => `<rect width="300" height="300" fill="url(#g-sky-dusk)"/>${stars(5, 30, 140)}
      <circle cx="232" cy="64" r="18" fill="#fdf0c2"/><circle cx="232" cy="64" r="44" fill="url(#g-glow)" opacity=".45"/>
      <path d="M0 176 Q30 150 60 168 Q90 140 130 164 Q170 146 210 166 Q250 150 300 168 V200 H0Z" fill="#3b4058"/>
      <rect y="190" width="300" height="110" fill="url(#g-water)"/>
      <g stroke="#c9cff0" stroke-width="1.6" opacity=".45" stroke-linecap="round"><path d="M40 214 h40 M150 230 h60 M90 256 h50 M210 272 h40 M222 206 h22"/></g>
      <ellipse cx="232" cy="214" rx="10" ry="30" fill="#fdf0c2" opacity=".25"/>
      ${[[60, 240], [120, 280], [240, 252]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 0 A18 7 0 1 1 0.1 0 L0 -4Z" fill="#6f9a5a"/>${blossom(6, -4, .8, '#f8b8c4')}</g>`).join('')}
      <g fill="url(#g-firefly)">${[[40, 150], [270, 140], [180, 120], [110, 110]].map(([x, y], i) => `<circle class="twinkle" style="animation-delay:${i * .7}s" cx="${x}" cy="${y}" r="8"/>`).join('')}</g>
      <g stroke="#4c6a48" stroke-width="2.4" stroke-linecap="round"><path d="M14 300 Q16 250 10 222 M24 300 Q24 260 30 236 M276 300 Q280 256 290 236"/></g>`,
    night: () => `<rect width="300" height="300" fill="url(#g-sky-night)"/>${stars(9, 60, 220)}
      <circle cx="80" cy="76" r="22" fill="#fdf0c2"/><circle cx="90" cy="70" r="19" fill="#26264d"/>
      <path d="M180 40 L250 70" stroke="#fff4cc" stroke-width="2" stroke-linecap="round" opacity=".8"/><circle cx="250" cy="70" r="3" fill="#fff"/>
      <path d="M0 230 Q100 196 180 220 Q240 206 300 222 V300 H0Z" fill="#2f2e52"/><path d="M0 262 Q150 240 300 260 V300 H0Z" fill="#25244a"/>`,
    party: () => `<rect width="300" height="300" fill="#f2cfb4"/><rect width="300" height="300" fill="url(#p-floral)" opacity=".55"/>
      <rect y="236" width="300" height="64" fill="url(#g-floor)"/>
      ${DECO.deco_bunting().replace('data-hit="deco" class="hit"', '').replace(/<g transform="translate\(60 110\)">[\s\S]*<\/g><\/g>$/, '</g>')}
      <g transform="translate(250 60)"><path d="M0 0 Q-4 60 4 130" stroke="#c9a78a" stroke-width="1" fill="none"/><ellipse cx="0" cy="-6" rx="18" ry="22" fill="#f39aa2"/><ellipse cx="-6" cy="-14" rx="5" ry="8" fill="#fff" opacity=".4"/></g>
      <g transform="translate(276 90)"><path d="M0 0 Q4 60 -6 110" stroke="#c9a78a" stroke-width="1" fill="none"/><ellipse cx="0" cy="-6" rx="15" ry="19" fill="#a6dcc2"/><ellipse cx="-5" cy="-12" rx="4" ry="7" fill="#fff" opacity=".4"/></g>
      <g transform="translate(46 222)"><rect x="-26" y="0" width="52" height="30" rx="6" fill="#fff4ea"/><rect x="-26" y="0" width="52" height="10" rx="5" fill="#f4b2a6"/>
        <rect x="-2" y="-16" width="4" height="16" fill="#f7c453"/><path d="M0 -24 q4 4 0 8 q-4 -4 0 -8Z" fill="#ffb347"/></g>`,
    bath: () => `<rect width="300" height="300" fill="#e7eef0"/>
      <g stroke="#cfdade" stroke-width="2">${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 32} 0 V300"/><path d="M0 ${i * 32} H300"/>`).join('')}</g>
      <rect y="220" width="300" height="80" fill="#f4dccb"/>
      ${Array.from({ length: 16 }, (_, i) => { const r = rng(i + 4); return `<circle cx="${(r() * 300).toFixed(0)}" cy="${(r() * 220).toFixed(0)}" r="${(6 + r() * 14).toFixed(0)}" fill="url(#g-bubble)"/>`; }).join('')}`,
    boutique: () => `<rect width="300" height="300" fill="#6c4536"/><rect width="300" height="300" fill="url(#p-cream)" opacity=".2"/>
      <ellipse cx="150" cy="170" rx="160" ry="130" fill="url(#g-glow)" opacity=".4"/>
      <g transform="translate(14 60)"><path d="M0 0 H70 M8 0 V180 M62 0 V180" stroke="#8a5a3c" stroke-width="4"/>
        ${[['#f2a9a0', 10], ['#a6dcc2', 26], ['#f7c453', 40], ['#c9b2ea', 54]].map(([c, x]) => `<path d="M${x} 2 l-8 10 v40 h18 v-40Z" fill="${c}"/>`).join('')}</g>
      <g transform="translate(232 70)"><path d="M0 120 V30 Q0 0 30 0 Q60 0 60 30 V120Z" fill="#a7b9c4" stroke="#c99a6e" stroke-width="5"/><path d="M12 40 Q16 16 34 12" stroke="#fff" stroke-width="3" opacity=".5" fill="none"/></g>
      <rect y="250" width="300" height="50" fill="#3d241b"/>`,
    garden: () => `<rect width="300" height="300" fill="url(#g-sky-day)"/>${cloud(40, 40, 1)}${cloud(200, 30, .8)}
      <path d="M0 110 Q150 80 300 110 V300 H0Z" fill="#a9bd74"/><path d="M0 130 Q150 110 300 130 V300 H0Z" fill="#94ab62"/>
      ${scatterDaisies(21, 10, 120, 140)}`,
    room: () => roomSVG({ wall: 'wall_cream', window: 'win_sunset', seat: 'seat_beanbag', rug: 'rug_round', lamp: 'lamp_floor', plant: 'plant_monstera', deco: 'deco_frame' }, { noBunny: true, vb: '45 30 300 300' }).replace(/^<svg[^>]*>|<\/svg>$/g, ''),
  };

  function scene(kind, o = {}) {
    let inner;
    if (kind === 'room' && o.room) inner = roomSVG(o.room, { noBunny: true, vb: '45 30 300 300' }).replace(/^<svg[^>]*>|<\/svg>$/g, '');
    else if (kind === 'home') inner = homeBg(false).replace(/^<svg[^>]*>|<\/svg>$/g, '').replace('<rect width="390"', '<rect x="0" width="390"');
    else inner = (SCENES[kind] || SCENES.meadow)();
    const vb = kind === 'home' ? '45 70 300 300' : (kind === 'room' ? '45 30 300 300' : '0 0 300 300');
    const b = o.bunny ? `<svg x="${kind === 'home' ? 120 : (kind === 'room' ? 136 : 80)}" y="${kind === 'home' ? 186 : (kind === 'room' ? 154 : 120)}" width="${kind === 'home' || kind === 'room' ? 150 : 140}" height="${kind === 'home' || kind === 'room' ? 174 : 162}" viewBox="0 0 200 232" overflow="visible">${bunnyInner(o.bunny)}</svg>` : '';
    return svg(vb, inner + b + (o.overlay || ''), `preserveAspectRatio="${o.par || 'xMidYMid slice'}"`);
  }

  /* =========================================================
     冒险地图
     ========================================================= */
  const MAP_W = 390, MAP_H = 1560;
  const NODES = [[300, 1520], [110, 1440], [272, 1342], [134, 1214], [258, 968], [112, 836], [262, 700], [118, 452], [276, 330], [178, 168]];
  function catmull(pts, seg = 16) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      for (let t = 0; t < 1; t += 1 / seg) {
        const t2 = t * t, t3 = t2 * t;
        out.push([0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }
  function mapSVG() {
    const path = catmull(NODES);
    const d = 'M' + path.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
    const r = rng(42);
    const far = (x, y, min) => path.every(p => (p[0] - x) ** 2 + (p[1] - y) ** 2 > min * min);
    const items = [];
    const place = (n, y0, y1, fn, min = 40) => {
      let k = 0, guard = 0;
      while (k < n && guard++ < 600) {
        const x = 12 + r() * (MAP_W - 24), y = y0 + r() * (y1 - y0);
        if (!far(x, y, min)) continue;
        if (y > 230 && y < 350 && x < 200 && x > 0 && y0 < 520) { /* 池塘区域 */ if (Math.abs(x - 96) < 100 && Math.abs(y - 290) < 50) continue; }
        items.push([y, fn(x, y, r)]); k++;
      }
    };
    // 草地
    place(10, 1080, 1550, (x, y, r) => tree(x, y, .8 + r() * .5, '#7a9a5e', '#9ab87a'), 46);
    place(16, 1060, 1550, (x, y, r) => `<g transform="translate(${x} ${y})"><circle r="${8 + r() * 6}" fill="#86a564"/><circle cx="9" cy="2" r="${6 + r() * 4}" fill="#7a9a5a"/><circle cx="-3" cy="-4" r="4" fill="#a3c07f"/></g>`, 30);
    place(40, 1050, 1555, (x, y, r) => daisy(x, y, .5 + r() * .4), 22);
    // 森林
    place(26, 540, 1040, (x, y, r) => pine(x, y, .9 + r() * .7, r() > .5 ? '#3f5f3c' : '#4c6e45'), 40);
    place(8, 560, 1040, (x, y, r) => tree(x, y, .8 + r() * .4, '#4f7046', '#62854f'), 44);
    place(16, 540, 1040, (x, y, r) => mushroom(x, y, .9 + r() * .8), 24);
    // 池塘夜空
    place(12, 340, 520, (x, y, r) => pine(x, y, .8 + r() * .5, '#2f3b4a'), 40);
    let sky = '';
    for (let i = 0; i < 70; i++) sky += `<circle class="twinkle" style="animation-delay:${(r() * 4).toFixed(2)}s" cx="${(r() * MAP_W).toFixed(0)}" cy="${(r() * 300).toFixed(0)}" r="${(.6 + r() * 1.5).toFixed(1)}" fill="#fff4cc"/>`;
    let ff = '';
    for (let i = 0; i < 14; i++) ff += `<circle class="twinkle" style="animation-delay:${(r() * 3).toFixed(2)}s" cx="${(r() * MAP_W).toFixed(0)}" cy="${(260 + r() * 260).toFixed(0)}" r="${(4 + r() * 4).toFixed(1)}" fill="url(#g-firefly)"/>`;
    items.sort((a, b) => a[0] - b[0]);
    const sign = (x, y, t, flip) => `<g transform="translate(${x} ${y})"><rect x="-2" y="0" width="5" height="28" fill="#6b4a32"/>
      <g transform="rotate(${flip ? 4 : -4})"><rect x="${flip ? -78 : -8}" y="-24" width="86" height="28" rx="6" fill="#a4724c" filter="url(#f-drop)"/>
      <text x="${flip ? -35 : 35}" y="-5" text-anchor="middle" font-family="ZCOOL KuaiLe, PingFang SC, sans-serif" font-size="14" fill="#fff4e4">${t}</text></g></g>`;
    return svg(`0 0 ${MAP_W} ${MAP_H}`, `
      <rect width="${MAP_W}" height="${MAP_H}" fill="url(#g-map)"/>
      ${sky}
      <circle cx="320" cy="74" r="26" fill="#fdf0c2"/><circle cx="320" cy="74" r="70" fill="url(#g-glow)" opacity=".35"/><circle cx="331" cy="67" r="23" fill="#242242"/>
      <path d="M0 320 Q60 280 120 300 Q190 270 260 300 Q330 280 390 300 V520 H0Z" fill="#2f3a4c" opacity=".7"/>
      <g transform="translate(96 290)"><ellipse rx="98" ry="44" fill="#3d4b78"/><ellipse rx="90" ry="38" fill="url(#g-water)"/>
        <g stroke="#c9cff0" stroke-width="1.6" opacity=".4" stroke-linecap="round"><path d="M-50 -10 h30 M10 6 h40 M-30 18 h26"/></g>
        ${[[-40, 0], [30, -14], [50, 16], [-10, 22]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 0 A12 5 0 1 1 .1 0 L0 -3Z" fill="#6f9a5a"/>${blossom(4, -3, .6, '#f8b8c4')}</g>`).join('')}</g>
      ${ff}
      <rect y="470" width="${MAP_W}" height="110" fill="url(#g-mist)"/>
      <rect y="990" width="${MAP_W}" height="110" fill="url(#g-mist)"/>
      <path d="${d}" fill="none" stroke="#5a3a26" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" opacity=".35" transform="translate(0 4)"/>
      <path d="${d}" fill="none" stroke="#e9cf9f" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="#f6e3bf" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>
      <path d="${d}" fill="none" stroke="#c9a273" stroke-width="2.6" stroke-dasharray="2 12" stroke-linecap="round"/>
      ${items.map(i => i[1]).join('')}
      <g transform="translate(330 1500)"><path d="M-30 20 Q-34 -24 0 -28 Q34 -24 30 20Z" fill="#7d9a5e"/><path d="M-26 -6 Q0 -36 26 -6" fill="#8fae6c"/>
        <path d="M-12 20 V4 Q-12 -8 0 -8 Q12 -8 12 4 V20Z" fill="#a4724c" stroke="#7a4a32" stroke-width="2"/><circle cx="6" cy="8" r="1.6" fill="#f7c453"/>
        <circle cx="-22" cy="-4" r="4" fill="#fdf0c2" opacity=".85"/></g>
      ${sign(40, 1490, '雏菊草地')}${sign(352, 1030, '蘑菇森林', true)}${sign(40, 520, '星光池塘')}
      <g transform="translate(178 96)" opacity=".9"><path d="M0 -20 l5 12 13 1 -10 8 3 13 -11 -7 -11 7 3 -13 -10 -8 13 -1Z" fill="#fff4cc" class="twinkle"/></g>
    `, 'preserveAspectRatio="xMidYMin meet"');
  }

  return {
    DEFS, rng, svg, bunny, bunnyInner, accIcon, ACC, icon, FOOD, UI,
    homeBg, roomSVG, roomItemIcon, scene, mapSVG, NODES, MAP_W, MAP_H, daisy, blossom, HEART,
  };
})();
