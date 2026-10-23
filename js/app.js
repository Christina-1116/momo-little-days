/* =========================================================
   MOMO · 毛毛的小日子 —— 主逻辑
   养成 · 每日任务 · 冒险闯关 · 衣橱 · 小窝装扮 · 回忆相册
   ========================================================= */
const App = (() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const UI = ART.UI;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const fmtDate = (t) => { const d = new Date(t); return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`; };
  const KEY = 'momo-save-v1';

  /* ---------------- 存档 ---------------- */
  const fresh = () => ({
    v: 1, name: '毛毛', started: false, born: Date.now(), coins: 1240, level: 1, xp: 0,
    stats: { hunger: 70, mood: 78, energy: 86, clean: 58 },
    sleeping: false, last: Date.now(),
    owned: { scarf_mint: 1, seat_beanbag: 1, rug_round: 1, lamp_floor: 1, plant_monstera: 1, deco_frame: 1, wall_cream: 1, win_sunset: 1 },
    outfit: { head: null, neck: 'scarf_mint', face: null },
    room: { seat: 'seat_beanbag', rug: 'rug_round', lamp: 'lamp_floor', plant: 'plant_monstera', deco: 'deco_frame', wall: 'wall_cream', window: 'win_sunset', lampOn: true },
    food: { carrot: 5, strawberry: 3, clover: 3, cupcake: 1 },
    best: {}, unlocked: 1, moments: {}, photos: [],
    daily: { date: '', prog: {}, claimed: {}, chest: false, gift: false, water: false, petMood: 0 },
    cozy: 0, seenAlbum: 0, settings: { sfx: true, music: true },
  });
  let S;
  function load() {
    try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = fresh(); }
    S.stats = Object.assign(fresh().stats, S.stats);
  }
  let saveT = 0;
  const save = () => { clearTimeout(saveT); saveT = setTimeout(() => localStorage.setItem(KEY, JSON.stringify(S)), 120); };

  /* ---------------- 工具 ---------------- */
  const phone = () => $('#phone');
  const haptic = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) { } };
  const coinPill = () => `<button class="coin-pill" data-act="gift"><i class="coin-ic">${ART.icon('coin')}</i><b class="coin-val">${S.coins.toLocaleString()}</b><span class="coin-plus">${UI.plus}</span></button>`;
  const relPos = (x, y) => { const r = phone().getBoundingClientRect(); return [x - r.left, y - r.top]; };
  const centerOf = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const itemInfo = (id) => {
    for (const slot in DATA.WARDROBE) { const it = DATA.WARDROBE[slot].find(i => i.id === id); if (it) return { ...it, slot, kind: 'wear' }; }
    for (const slot in DATA.ROOM) { const it = DATA.ROOM[slot].items.find(i => i.id === id); if (it) return { ...it, slot, kind: 'room' }; }
    return null;
  };
  const itemArt = (id) => { const i = itemInfo(id); if (!i) return ''; return i.kind === 'wear' ? ART.accIcon(id, i.slot) : ART.roomItemIcon(i.slot, id); };
  const need = (l) => 80 + l * 40;
  const totalStars = () => Object.values(S.best).reduce((a, b) => a + b, 0);

  /* ---------------- 特效 ---------------- */
  function fx(kind, x, y, n = 6) {
    const layer = $('#fx');
    const [px, py] = relPos(x, y);
    for (let i = 0; i < n; i++) {
      const e = document.createElement('i');
      e.className = 'fx fx-' + kind;
      e.innerHTML = kind === 'heart' ? UI.heartFill : kind === 'star' ? UI.star : kind === 'note' ? UI.music : UI.sparkle;
      e.style.left = px + 'px'; e.style.top = py + 'px';
      e.style.setProperty('--dx', ((Math.random() - .5) * 120).toFixed(0) + 'px');
      e.style.setProperty('--dy', (-60 - Math.random() * 90).toFixed(0) + 'px');
      e.style.setProperty('--r', ((Math.random() - .5) * 60).toFixed(0) + 'deg');
      e.style.setProperty('--s', (.7 + Math.random() * .7).toFixed(2));
      e.style.animationDelay = (i * 40) + 'ms';
      layer.appendChild(e); setTimeout(() => e.remove(), 1400);
    }
  }
  function confetti(n = 50) {
    const layer = $('#fx'), cols = ['#f8b79f', '#f7c453', '#a6dcc2', '#c9b2ea', '#f39aa2', '#fff4ea'];
    const w = phone().clientWidth;
    for (let i = 0; i < n; i++) {
      const e = document.createElement('i'); e.className = 'confetti';
      e.style.left = (Math.random() * w) + 'px'; e.style.background = pick(cols);
      e.style.setProperty('--dx', ((Math.random() - .5) * 160).toFixed(0) + 'px');
      e.style.setProperty('--r', (Math.random() * 900).toFixed(0) + 'deg');
      e.style.animationDelay = (Math.random() * 400) + 'ms';
      e.style.animationDuration = (1.6 + Math.random() * 1.2) + 's';
      layer.appendChild(e); setTimeout(() => e.remove(), 3400);
    }
  }
  function coinsFly(n, fromEl) {
    const target = $('.screen.active .coin-pill .coin-ic') || $('.coin-pill .coin-ic');
    const from = fromEl ? centerOf(fromEl) : [innerWidth / 2, innerHeight / 2];
    if (!target) return;
    const to = centerOf(target);
    const layer = $('#fx');
    const k = Math.min(10, Math.max(3, Math.round(n / 15)));
    for (let i = 0; i < k; i++) {
      const e = document.createElement('i'); e.className = 'fly-coin'; e.innerHTML = ART.icon('coin');
      const [fx0, fy0] = relPos(from[0] + (Math.random() - .5) * 50, from[1] + (Math.random() - .5) * 30);
      const [tx, ty] = relPos(...to);
      e.style.left = fx0 + 'px'; e.style.top = fy0 + 'px';
      layer.appendChild(e);
      setTimeout(() => { e.style.transform = `translate(${tx - fx0}px, ${ty - fy0}px) scale(.6)`; e.style.opacity = '.4'; }, 30 + i * 70);
      setTimeout(() => { e.remove(); if (i === k - 1) bumpCoins(); Sound.play('coin'); }, 700 + i * 70);
    }
  }
  function bumpCoins() {
    $$('.coin-val').forEach(e => { e.textContent = S.coins.toLocaleString(); const p = e.closest('.coin-pill'); p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump'); });
  }
  function addCoins(n, fromEl) { S.coins += n; save(); if (fromEl !== false) coinsFly(n, fromEl); else bumpCoins(); }
  function spend(n) {
    if (S.coins < n) { toast(`金币不够啦，还差 ${n - S.coins} 枚`, 'coin'); Sound.play('fail'); $$('.coin-pill').forEach(p => { p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake'); }); return false; }
    S.coins -= n; bumpCoins(); save(); return true;
  }

  /* ---------------- Toast / Sheet / Modal ---------------- */
  function toast(html, ic) {
    const t = document.createElement('div'); t.className = 'toast';
    t.innerHTML = (ic ? `<i>${ART.FOOD[ic] ? ART.icon(ic) : UI[ic] || ''}</i>` : '') + `<span>${html}</span>`;
    $('#toasts').appendChild(t);
    setTimeout(() => t.classList.add('out'), 2300); setTimeout(() => t.remove(), 2700);
  }
  let sheetClose = null;
  function sheet(html, o = {}) {
    closeSheet(true);
    const root = $('#sheet-root');
    root.innerHTML = `<div class="sheet-bd ${o.light ? 'light' : ''}"></div><div class="sheet ${o.cls || ''}"><div class="sheet-grip"></div>${html}</div>`;
    requestAnimationFrame(() => root.classList.add('show'));
    $('.sheet-bd', root).onclick = () => closeSheet();
    sheetClose = o.onClose || null;
    o.onMount && o.onMount($('.sheet', root));
  }
  function closeSheet(instant) {
    const root = $('#sheet-root');
    if (!root.innerHTML) return;
    const cb = sheetClose; sheetClose = null;
    root.classList.remove('show');
    if (instant) root.innerHTML = ''; else setTimeout(() => { if (!root.classList.contains('show')) root.innerHTML = ''; }, 320);
    cb && cb();
  }
  const mq = []; let mOpen = false;
  function modal(html, o = {}) { mq.push({ html, o }); if (!mOpen) nextModal(); }
  function nextModal() {
    const m = mq.shift(); if (!m) { mOpen = false; return; }
    mOpen = true;
    const root = $('#modal-root');
    root.innerHTML = `<div class="modal-bd"></div><div class="modal ${m.o.cls || ''}">${m.html}</div>`;
    requestAnimationFrame(() => root.classList.add('show'));
    if (m.o.dismiss !== false) $('.modal-bd', root).onclick = () => closeModal();
    root._onClose = m.o.onClose;
    m.o.onMount && m.o.onMount($('.modal', root));
  }
  function closeModal() {
    const root = $('#modal-root');
    root.classList.remove('show');
    const cb = root._onClose; root._onClose = null;
    setTimeout(() => { root.innerHTML = ''; cb && cb(); nextModal(); }, 260);
  }
  function confirm(title, text, cancel, ok, cb) {
    modal(`<div class="dlg"><h3>${title}</h3><p>${text}</p><div class="dlg-btns"><button class="btn-ghost" data-c="0">${cancel}</button><button class="btn-primary sm" data-c="1">${ok}</button></div></div>`, {
      dismiss: false,
      onMount: (m) => $$('[data-c]', m).forEach(b => b.onclick = () => { const v = b.dataset.c === '1'; closeModal(); setTimeout(() => cb(v), 270); }),
    });
  }

  /* ---------------- 每日 / 数值 ---------------- */
  function checkDay() {
    if (S.daily.date !== dayKey()) { S.daily = { date: dayKey(), prog: {}, claimed: {}, chest: false, gift: false, water: false, petMood: 0 }; save(); }
  }
  function progress(id, n = 1) {
    checkDay();
    const t = DATA.TASKS.find(t => t.id === id); if (!t) return;
    const p = S.daily.prog[id] || 0;
    if (p >= t.goal) return;
    S.daily.prog[id] = Math.min(t.goal, p + n);
    if (S.daily.prog[id] >= t.goal) { setTimeout(() => toast(`任务完成：${t.name}`, 'check'), 500); Sound.play('match'); }
    save(); badges();
  }
  function gainXp(n) {
    S.xp += n;
    while (S.xp >= need(S.level)) {
      S.xp -= need(S.level); S.level++;
      const lv = S.level;
      S.coins += 100; S.food.cupcake = (S.food.cupcake || 0) + 1;
      modal(`<div class="levelup"><div class="lu-rays"></div><div class="lu-bunny">${ART.bunny({ expr: 'love', outfit: S.outfit })}</div>
        <div class="lu-badge">Lv.${lv}</div><h3>${S.name}长大啦！</h3><p>谢谢你的照顾，一起继续加油吧～</p>
        <div class="r-rewards"><span><i>${ART.icon('coin')}</i>+100</span><span><i>${ART.icon('cupcake')}</i>小蛋糕 ×1</span></div>
        <button class="btn-primary" data-close>好耶！<i class="arrow">${UI.arrow}</i></button></div>`, {
        cls: 'pop', onMount: (m) => { Sound.play('levelup'); confetti(70); $('[data-close]', m).onclick = () => { closeModal(); bumpCoins(); }; }
      });
      if (lv >= 3) unlockMoment('lv3');
    }
    save(); refreshLv();
  }
  function unlockMoment(id) {
    if (S.moments[id]) return;
    const m = DATA.MOMENTS.find(m => m.id === id); if (!m) return;
    S.moments[id] = { date: Date.now(), outfit: { ...S.outfit }, room: { ...S.room } };
    save(); badges();
    setTimeout(() => {
      const t = document.createElement('div'); t.className = 'memory-toast';
      t.innerHTML = `<div class="mt-pic">${ART.scene(m.scene, { bunny: { expr: m.expr, outfit: S.outfit }, room: S.room })}</div><div><small>解锁新回忆</small><b>${m.title}</b></div>`;
      t.onclick = () => go('album');
      $('#toasts').appendChild(t); Sound.play('happy');
      setTimeout(() => t.classList.add('out'), 3200); setTimeout(() => t.remove(), 3700);
    }, 900);
  }
  function badges() {
    checkDay();
    const anyClaim = DATA.TASKS.some(t => (S.daily.prog[t.id] || 0) >= t.goal && !S.daily.claimed[t.id]) || (allClaimed() && !S.daily.chest);
    $('[data-tab=tasks]')?.classList.toggle('has-dot', anyClaim);
    $('[data-tab=album]')?.classList.toggle('has-dot', Object.keys(S.moments).length + S.photos.length > S.seenAlbum);
  }
  const allClaimed = () => DATA.TASKS.every(t => S.daily.claimed[t.id]);

  /* 时间流逝 */
  function decay(sec, live) {
    const st = S.stats, k = sec;
    if (S.sleeping) {
      st.energy = clamp(st.energy + 1.4 * k);
      st.hunger = clamp(st.hunger - .006 * k);
      if (live && st.energy >= 100 && !S._fullNote) { S._fullNote = 1; speech('睡饱啦～', 2000); }
    } else {
      st.hunger = clamp(st.hunger - .012 * k);
      st.energy = clamp(st.energy - .005 * k);
      st.clean = clamp(st.clean - .008 * k);
      st.mood = clamp(st.mood - (.006 + (st.hunger < 25 || st.clean < 25 ? .01 : 0)) * k);
    }
  }
  function tick() {
    const now = Date.now(), dt = (now - S.last) / 1000; S.last = now;
    if (dt > 0 && dt < 30) decay(dt, true);
    checkDay();
    const sb = $('#sbTime'); if (sb) { const d = new Date(); sb.textContent = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`; }
    if (cur === 'home') updateStats();
    if (Math.random() < .2) save();
  }

  /* =========================================================
     首页（养成）
     ========================================================= */
  let tempExpr = null, tempT = 0, mode = null, speechT = 0;
  const STAT_META = [
    { k: 'hunger', n: '饱腹', ic: 'bowl', c: '#f6b26b' },
    { k: 'mood', n: '心情', ic: 'smile', c: '#f39aa2' },
    { k: 'energy', n: '精力', ic: 'bolt', c: '#c9b2ea' },
    { k: 'clean', n: '清洁', ic: 'drop', c: '#9cc9e6' },
  ];
  function baseExpr() {
    if (S.sleeping) return 'sleep';
    const s = S.stats;
    if (s.hunger < 22 || s.mood < 22 || s.clean < 18 || s.energy < 12) return 'sad';
    return 'normal';
  }
  function drawHomeBunny(force) {
    const box = $('#hbBob'); if (!box) return;
    const e = tempExpr || baseExpr();
    const key = e + JSON.stringify(S.outfit) + (S.stats.clean < 35);
    if (!force && box.dataset.key === key) return;
    box.dataset.key = key;
    box.innerHTML = ART.bunny({ expr: e, outfit: S.outfit, dirty: S.stats.clean < 35 });
  }
  function react(expr, ms = 1200, anim) {
    tempExpr = expr; drawHomeBunny();
    clearTimeout(tempT); if (ms) tempT = setTimeout(() => { tempExpr = null; drawHomeBunny(); }, ms);
    if (anim) playAnim(anim);
  }
  function playAnim(cls, el) {
    el = el || $('#hb'); if (!el) return;
    el.classList.remove('jump', 'squish', 'shake', 'wiggle', 'chew'); void el.offsetWidth; el.classList.add(cls);
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove(cls), 1600);
  }
  function speech(txt, ms = 2200, el) {
    const b = el || (cur === 'room' ? $('#roomSpeech') : $('#speech')); if (!b) return;
    b.textContent = txt; b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
    clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('on'), ms);
  }
  function contextLine() {
    const s = S.stats;
    if (s.hunger < 30) return pick(DATA.LINES.hungry);
    if (s.energy < 25) return pick(DATA.LINES.tired);
    if (s.clean < 30) return pick(DATA.LINES.dirty);
    if (s.mood < 30) return pick(DATA.LINES.sad);
    return pick(DATA.LINES.tap);
  }

  function renderHome() {
    const el = $('#s-home');
    el.innerHTML = `
      <header class="top">
        <div class="brand"><div class="logo">MOMO</div><div class="tag">${S.name}的小日子 · Little days</div></div>
        <div class="top-r"><button class="icon-btn" data-act="settings" aria-label="设置">${UI.gear}</button>${coinPill()}</div>
      </header>
      <div class="stage ${S.sleeping ? 'night' : ''}" id="stage">
        <div class="stage-bg" id="stageBg">${ART.homeBg(S.sleeping)}</div>
        <div class="motes">${Array.from({ length: 12 }, (_, i) => `<i style="left:${(8 + Math.random() * 84).toFixed(0)}%;top:${(10 + Math.random() * 70).toFixed(0)}%;animation-delay:${(Math.random() * 6).toFixed(1)}s;animation-duration:${(6 + Math.random() * 6).toFixed(1)}s"></i>`).join('')}</div>
        <div class="hero"><h1>每天一点点<br><em>小小的快乐。</em></h1><p>A little joy, every day.</p></div>
        <button class="lv-chip" data-act="lvinfo"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" class="lv-track"/><circle cx="20" cy="20" r="17" class="lv-ring" id="lvRing"/></svg><b id="lvNum">${S.level}</b><span>Lv</span></button>
        <div class="bunny-wrap" id="hb"><div class="bunny-bob" id="hbBob"></div><div class="bath-layer" id="bathLayer"></div></div>
        <div class="speech" id="speech"></div>
        <div class="thought" id="thought"></div>
        <div class="zzz"><i>z</i><i>z</i><i>Z</i></div>
        <button class="chip chip-look" data-go="wardrobe">${UI.hanger}<span>小小衣橱</span>${UI.arrow}</button>
        <button class="chip chip-cam" data-act="photo" aria-label="拍照">${UI.camera}</button>
      </div>
      <section class="card care">
        <div class="card-h"><b>今日照顾 <small>Today's care</small></b><button class="link" data-tab-go="tasks"><span id="taskSum"></span>${UI.arrow}</button></div>
        <div class="stats">${STAT_META.map(m => `
          <div class="stat" data-k="${m.k}" style="--c:${m.c}">
            <div class="st-top"><i>${UI[m.ic]}</i><span>${m.n}</span></div>
            <b>0</b><div class="st-bar"><i></i></div></div>`).join('')}</div>
      </section>
      <div class="actions">
        ${[['feed', '喂食', 'bowl'], ['play', '玩耍', 'game'], ['bath', '洗澡', 'bath'], ['sleep', S.sleeping ? '叫醒' : '睡觉', S.sleeping ? 'sun' : 'moon']].map(([a, n, ic]) =>
      `<button class="act" data-act="${a}"><span class="act-ic">${UI[ic]}</span><span class="act-n">${n}</span></button>`).join('')}
      </div>`;
    drawHomeBunny(true);
    updateStats(); refreshLv();
    bindPet();
  }
  function refreshLv() {
    const r = $('#lvRing'); if (!r) return;
    const c = 2 * Math.PI * 17; r.style.strokeDasharray = c; r.style.strokeDashoffset = c * (1 - S.xp / need(S.level));
    $('#lvNum').textContent = S.level;
  }
  function updateStats() {
    $$('#s-home .stat').forEach(e => {
      const v = Math.round(S.stats[e.dataset.k]);
      $('b', e).textContent = v; $('.st-bar i', e).style.width = v + '%';
      e.classList.toggle('low', v < 30);
    });
    const done = DATA.TASKS.filter(t => (S.daily.prog[t.id] || 0) >= t.goal).length;
    const ts = $('#taskSum'); if (ts) ts.textContent = `每日任务 ${done}/${DATA.TASKS.length}`;
    const th = $('#thought');
    if (th) {
      const s = S.stats; let k = '';
      if (!S.sleeping && mode !== 'bath') k = s.hunger < 30 ? 'carrot' : s.clean < 30 ? 'bath' : s.energy < 20 ? 'moon' : '';
      if (th.dataset.k !== k) { th.dataset.k = k; th.innerHTML = k ? (ART.FOOD[k] ? ART.icon(k) : `<span>${UI[k]}</span>`) : ''; th.classList.toggle('on', !!k); }
    }
    drawHomeBunny();
  }
  function addStat(k, v) { S.stats[k] = clamp(S.stats[k] + v); updateStats(); save(); }

  /* 抚摸 / 点击 */
  function bindPet() {
    const hb = $('#hb'); let p = null;
    hb.addEventListener('pointerdown', (e) => {
      Sound.init();
      if (mode === 'bath') return;
      if (S.sleeping) { speech('呼…呼…（嘘，它睡着了）'); Sound.play('snore'); return; }
      hb.setPointerCapture(e.pointerId);
      p = { x: e.clientX, y: e.clientY, t: Date.now(), dist: 0, acc: 0, rub: false };
    });
    hb.addEventListener('pointermove', (e) => {
      if (!p) return;
      const d = Math.hypot(e.clientX - p.x, e.clientY - p.y); p.x = e.clientX; p.y = e.clientY; p.dist += d; p.acc += d;
      if (p.dist > 26 && !p.rub) { p.rub = true; react('happy', 0); hb.classList.add('rub'); }
      if (p.rub && p.acc > 42) { p.acc = 0; fx('heart', e.clientX, e.clientY, 1); Sound.play('soft'); }
    });
    const up = () => {
      if (!p) return; const q = p; p = null; hb.classList.remove('rub');
      if (q.rub) {
        react('happy', 1400, 'wiggle');
        if (q.dist > 150) {
          speech(pick(DATA.LINES.rub)); Sound.play('giggle'); progress('pet');
          if (S.daily.petMood < 30) { S.daily.petMood += 6; addStat('mood', 6); gainXp(2); }
        }
      } else {
        const r = Math.random();
        const [ex, an] = r < .35 ? ['happy', 'jump'] : r < .6 ? ['wink', 'squish'] : r < .8 ? ['love', 'jump'] : ['surprised', 'shake'];
        react(ex, 1300, an); speech(contextLine());
        Sound.play(an === 'jump' ? 'giggle' : 'tap'); haptic(10);
        const [cx, cy] = centerOf(hb); fx('heart', cx, cy - 40, 3);
        progress('pet');
        if (S.daily.petMood < 30) { S.daily.petMood += 1; addStat('mood', 1); gainXp(1); }
      }
    };
    hb.addEventListener('pointerup', up); hb.addEventListener('pointercancel', up);
  }

  /* 喂食 */
  function openFeed() {
    if (mode === 'bath') endBath(false);
    if (S.sleeping) { toast('嘘～它在睡觉呢', 'moon'); return; }
    const row = () => DATA.FOODS.map(f => `
      <div class="food ${S.food[f.id] ? '' : 'empty'}" data-f="${f.id}">
        <div class="food-ic">${ART.icon(f.id)}</div>
        <b>${f.name}</b><small>饱腹+${f.hunger} · 心情+${f.mood}</small>
        <span class="cnt">×${S.food[f.id] || 0}</span>
        <button class="buy" data-buy="${f.id}"><i>${ART.icon('coin')}</i>${f.price}</button>
      </div>`).join('');
    sheet(`<div class="sheet-h"><b>给${S.name}吃点什么？</b><span>把食物<em>拖到它嘴边</em>，或者轻点一下</span></div><div class="food-row" id="foodRow">${row()}</div>`, {
      light: true, cls: 'feed-sheet',
      onMount: (sh) => {
        const rerender = () => { $('#foodRow').innerHTML = row(); bind(); };
        const bind = () => {
          $$('.buy', sh).forEach(b => b.onclick = (e) => {
            e.stopPropagation(); const f = DATA.FOODS.find(x => x.id === b.dataset.buy);
            if (!spend(f.price)) return;
            S.food[f.id] = (S.food[f.id] || 0) + 1; save(); Sound.play('buy'); rerender();
          });
          $$('.food', sh).forEach(card => card.onpointerdown = (e) => startDrag(e, card, rerender));
        };
        bind();
      },
    });
  }
  function startDrag(e, card, rerender) {
    if (e.target.closest('.buy')) return;
    Sound.init();
    const id = card.dataset.f;
    if (!S.food[id]) { toast('吃完啦，先买一个吧～', id); playAnim('shake', card); return; }
    e.preventDefault();
    card.setPointerCapture(e.pointerId);
    const g = document.createElement('div'); g.className = 'drag-ghost'; g.innerHTML = ART.icon(id);
    $('#fx').appendChild(g);
    const sx = e.clientX, sy = e.clientY; let moved = 0, over = false;
    const place = (x, y) => { const [px, py] = relPos(x, y); g.style.transform = `translate(${px - 32}px, ${py - 40}px)`; };
    place(sx, sy);
    const hb = $('#hb');
    const isOver = (x, y) => { const r = hb.getBoundingClientRect(); return x > r.left - 10 && x < r.right + 10 && y > r.top && y < r.bottom + 10; };
    const mv = (ev) => {
      moved = Math.max(moved, Math.hypot(ev.clientX - sx, ev.clientY - sy));
      place(ev.clientX, ev.clientY);
      const o = isOver(ev.clientX, ev.clientY);
      if (o !== over) { over = o; hb.classList.toggle('want', o); if (o) { react('surprised', 0); Sound.play('soft'); } else { tempExpr = null; drawHomeBunny(); } }
    };
    const end = (ev) => {
      card.removeEventListener('pointermove', mv); card.removeEventListener('pointerup', end); card.removeEventListener('pointercancel', end);
      hb.classList.remove('want');
      if (moved < 8 || over) { g.classList.add('eaten'); setTimeout(() => g.remove(), 300); feed(id); rerender(); }
      else { g.classList.add('back'); const [px, py] = relPos(...centerOf(card)); g.style.transform = `translate(${px - 32}px, ${py - 40}px) scale(.6)`; setTimeout(() => g.remove(), 350); tempExpr = null; drawHomeBunny(); }
    };
    card.addEventListener('pointermove', mv); card.addEventListener('pointerup', end); card.addEventListener('pointercancel', end);
  }
  function feed(id) {
    const f = DATA.FOODS.find(x => x.id === id);
    if (S.stats.hunger >= 96) { react('happy', 1200, 'shake'); speech(pick(DATA.LINES.full)); return; }
    S.food[id]--; addStat('hunger', f.hunger); addStat('mood', f.mood); if (f.energy) addStat('energy', f.energy);
    react('eat', 1500, 'chew'); Sound.play('eat'); haptic([8, 60, 8, 60, 8]);
    const [cx, cy] = centerOf($('#hb'));
    setTimeout(() => fx('sparkle', cx, cy, 4), 200);
    setTimeout(() => { react('love', 1200, 'jump'); speech(`好吃！饱腹 +${f.hunger}`); fx('heart', cx, cy - 30, 4); Sound.play('happy'); }, 1550);
    progress('feed'); gainXp(f.xp); unlockMoment('firstfeed');
  }

  /* 玩耍 */
  function openPlay() {
    if (mode === 'bath') endBath(false);
    sheet(`<div class="sheet-h"><b>和${S.name}玩点什么？</b><span>每局消耗 <em>8 精力</em> · 心情 +15 · 还能赚金币</span></div>
      <div class="play-list">${Object.entries(DATA.GAMES).map(([k, g]) => `
        <button class="play-card" data-game="${k}"><div class="pc-art">${ART.icon(g.icon)}</div>
          <div class="pc-tx"><b>${g.name}</b><small>${g.desc}</small></div><span class="pc-go">${UI.arrow}</span></button>`).join('')}</div>`, {
      onMount: (sh) => $$('[data-game]', sh).forEach(b => b.onclick = () => { closeSheet(); startFree(b.dataset.game); }),
    });
  }
  function wakeIfSleeping() { if (S.sleeping) { S.sleeping = false; save(); toast(`${S.name}揉揉眼睛醒来啦`, 'sun'); if (cur === 'home') renderHome(); } }
  function startFree(kind) {
    wakeIfSleeping();
    if (S.stats.energy < 8) return tired();
    S.stats.energy -= 8; save();
    const cfgs = { catch: { time: 30, p: { rate: .8, speed: 160, bad: .14 }, goals: [10, 18, 26] }, pull: { time: 30, p: { life: 1250, rate: 760, bee: .16 }, goals: [10, 18, 26] }, memory: { time: 70, p: { pairs: 6 } } };
    const cfg = { ...cfgs[kind], title: DATA.GAMES[kind].name, scene: kind === 'memory' ? 'room' : 'meadow', outfit: S.outfit };
    Sound.play('whoosh');
    Games.start(kind, cfg, (r) => onGameEnd(null, kind, cfg, r));
  }
  function tired() {
    modal(`<div class="dlg"><div class="dlg-bunny">${ART.bunny({ expr: 'sleep', outfit: S.outfit })}</div><h3>${S.name}有点累了…</h3><p>精力不够啦，先让它睡一觉，或者喂点三叶草补充体力吧。</p>
      <div class="dlg-btns"><button class="btn-ghost" data-c="0">等一下</button><button class="btn-primary sm" data-c="1">去睡觉</button></div></div>`, {
      onMount: (m) => $$('[data-c]', m).forEach(b => b.onclick = () => { closeModal(); if (b.dataset.c === '1') { Games.close(); go('home'); setTimeout(() => { if (!S.sleeping) toggleSleep(); }, 400); } }),
    });
  }

  /* 洗澡 */
  let bathPop = null;
  function startBath() {
    if (mode === 'bath') return endBath(false);
    if (S.sleeping) { toast('嘘～它在睡觉呢', 'moon'); return; }
    closeSheet(true);
    mode = 'bath';
    const layer = $('#bathLayer'), stage = $('#stage');
    stage.classList.add('bathing');
    $('[data-act=bath] .act-n').textContent = '取消';
    const pts = [];
    for (let i = 0; i < 13; i++) {
      let x, y, g = 0;
      do { x = 14 + Math.random() * 72; y = 6 + Math.random() * 80; g++; } while (g < 30 && pts.some(([a, b]) => Math.hypot(a - x, b - y) < 15));
      pts.push([x, y]);
    }
    layer.innerHTML = pts.map(([x, y], i) => `<i class="bub" style="left:${x}%;top:${y}%;--s:${(.7 + Math.random() * .7).toFixed(2)};animation-delay:${i * 50}ms"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="url(#g-bubble)"/></svg></i>`).join('');
    react('happy', 0); speech('用手指搓一搓，把泡泡都戳破吧～', 3000);
    Sound.play('bubble');
    let down = false;
    const tryPop = (x, y) => {
      $$('.bub:not(.popped)', layer).forEach(b => {
        const [bx, by] = centerOf(b), r = b.getBoundingClientRect().width / 2 + 12;
        if (Math.hypot(bx - x, by - y) < r) {
          b.classList.add('popped'); Sound.play('bubble'); haptic(6); fx('sparkle', bx, by, 2);
          if (!$$('.bub:not(.popped)', layer).length) setTimeout(() => endBath(true), 250);
        }
      });
    };
    bathPop = {
      d: (e) => { down = true; tryPop(e.clientX, e.clientY); },
      m: (e) => { if (down || e.pointerType === 'mouse' && e.buttons) tryPop(e.clientX, e.clientY); },
      u: () => { down = false; },
    };
    stage.addEventListener('pointerdown', bathPop.d); stage.addEventListener('pointermove', bathPop.m);
    window.addEventListener('pointerup', bathPop.u);
  }
  function endBath(ok) {
    const stage = $('#stage');
    mode = null;
    if (bathPop && stage) { stage.removeEventListener('pointerdown', bathPop.d); stage.removeEventListener('pointermove', bathPop.m); window.removeEventListener('pointerup', bathPop.u); }
    bathPop = null;
    if (stage) stage.classList.remove('bathing');
    const l = $('#bathLayer'); if (l) l.innerHTML = '';
    const b = $('[data-act=bath] .act-n'); if (b) b.textContent = '洗澡';
    if (ok) {
      S.stats.clean = 100; addStat('mood', 8); gainXp(8);
      react('love', 1600, 'jump'); speech('香喷喷的！谢谢你～'); Sound.play('success');
      const [cx, cy] = centerOf($('#hb')); fx('sparkle', cx, cy, 10);
      progress('bath'); unlockMoment('bath');
    } else { tempExpr = null; drawHomeBunny(); }
  }

  /* 睡觉 */
  function toggleSleep() {
    if (mode === 'bath') endBath(false);
    S.sleeping = !S.sleeping; S._fullNote = 0; save();
    const stage = $('#stage');
    stage.classList.toggle('night', S.sleeping);
    $('#stageBg').innerHTML = ART.homeBg(S.sleeping);
    const btn = $('[data-act=sleep]');
    btn.innerHTML = `<span class="act-ic">${UI[S.sleeping ? 'sun' : 'moon']}</span><span class="act-n">${S.sleeping ? '叫醒' : '睡觉'}</span>`;
    tempExpr = null; drawHomeBunny(true);
    if (S.sleeping) { Sound.play('snore'); speech('晚安…（精力恢复中）', 2400); unlockMoment('sleep'); }
    else { react(S.stats.energy > 60 ? 'happy' : 'sad', 1400, 'jump'); speech(S.stats.energy > 60 ? '早上好！精神满满～' : '再睡五分钟嘛…'); Sound.play('happy'); }
    updateStats();
  }

  /* 拍照 */
  function takePhoto(from) {
    Sound.init();
    const flash = document.createElement('div'); flash.className = 'flash'; phone().appendChild(flash);
    setTimeout(() => flash.remove(), 700);
    Sound.play('shutter'); haptic(15);
    const expr = pick(['happy', 'wink', 'love', 'normal']);
    const ph = { id: 'p' + Date.now(), date: Date.now(), scene: from === 'room' ? 'room' : 'home', room: { ...S.room }, outfit: { ...S.outfit }, expr, fav: false };
    S.photos.unshift(ph); S.photos = S.photos.slice(0, 40); save();
    if (from === 'room') { roomExpr = expr; drawRoom(); setTimeout(() => { roomExpr = null; drawRoom(); }, 1400); }
    else react(expr, 1400, 'squish');
    const fly = document.createElement('div'); fly.className = 'photo-fly';
    fly.innerHTML = `<div class="pf-pic">${ART.scene(ph.scene, { bunny: { expr, outfit: ph.outfit }, room: ph.room })}</div><span>${fmtDate(ph.date)}</span>`;
    phone().appendChild(fly);
    const tab = $('[data-tab=album]');
    setTimeout(() => {
      const [tx, ty] = relPos(...centerOf(tab)); const r = fly.getBoundingClientRect(), [fx0, fy0] = relPos(r.left + r.width / 2, r.top + r.height / 2);
      fly.style.transform = `translate(${tx - fx0}px, ${ty - fy0}px) scale(.12) rotate(20deg)`; fly.style.opacity = '.3';
    }, 1100);
    setTimeout(() => { fly.remove(); tab.classList.remove('bump'); void tab.offsetWidth; tab.classList.add('bump'); badges(); }, 1800);
    progress('photo');
    setTimeout(() => toast('已存进相册啦', 'camera'), 1200);
  }

  /* =========================================================
     每日任务
     ========================================================= */
  function renderTasks() {
    checkDay();
    const el = $('#s-tasks');
    const d = new Date(), wk = '日一二三四五六'[d.getDay()];
    const done = DATA.TASKS.filter(t => (S.daily.prog[t.id] || 0) >= t.goal).length;
    el.innerHTML = `
      <div class="tasks-glow"></div>
      <header class="top">
        <div><h2 class="title">小步走，<br><em>快乐爪爪。</em></h2><p class="subtitle">今天 · ${d.getMonth() + 1}月${d.getDate()}日 星期${wk}</p></div>
        <div class="top-r">${coinPill()}</div>
      </header>
      <div class="peek"><div class="peek-bunny">${ART.bunny({ expr: done >= 6 ? 'love' : 'happy', outfit: S.outfit })}</div></div>
      <section class="card prog-card">
        <span><b>${done}</b> / ${DATA.TASKS.length} 已完成</span>
        <div class="pips">${DATA.TASKS.map((t, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('')}</div>
      </section>
      <div class="task-list">${DATA.TASKS.map(t => {
      const p = S.daily.prog[t.id] || 0, ok = p >= t.goal, cl = S.daily.claimed[t.id];
      return `<div class="task ${cl ? 'claimed' : ok ? 'ready' : ''}">
          <div class="t-ic">${UI[t.icon]}</div>
          <div class="t-tx"><b>${t.name}</b><small>${t.sub} · <i class="t-coin">${ART.icon('coin')}</i>${t.coins}</small></div>
          <div class="t-r">${cl ? `<span class="t-check">${UI.check}</span>` : ok ? `<button class="btn-claim" data-claim="${t.id}">领取</button>` : `<span class="t-prog">${p}/${t.goal}</span><button class="t-go" data-gotask="${t.go}">${UI.arrow}</button>`}</div>
        </div>`;
    }).join('')}</div>
      <section class="card chest ${S.daily.chest ? 'claimed' : allClaimed() ? 'ready' : ''}">
        <div class="chest-ic">${ART.icon('gift')}</div>
        <div class="chest-tx"><small>每日宝箱 Daily bonus</small><b>+80 金币 · 小蛋糕</b></div>
        <button class="btn-chest" data-act="chest" ${allClaimed() && !S.daily.chest ? '' : 'disabled'}>${S.daily.chest ? '明天见～' : allClaimed() ? '打开宝箱' : '完成全部后领取'}</button>
      </section>
      <div class="pad-bottom"></div>`;
    $$('[data-claim]', el).forEach(b => b.onclick = () => {
      const t = DATA.TASKS.find(x => x.id === b.dataset.claim);
      S.daily.claimed[t.id] = 1; addCoins(t.coins, b); gainXp(10); Sound.play('buy');
      fx('sparkle', ...centerOf(b), 5);
      if (allClaimed()) unlockMoment('tasks');
      setTimeout(() => { renderTasks(); badges(); }, 500);
    });
    $$('[data-gotask]', el).forEach(b => b.onclick = () => {
      const g = b.dataset.gotask;
      if (g === 'adventure') go('adventure');
      else { go('home'); setTimeout(() => ({ feed: openFeed, play: openPlay, bath: startBath, photo: () => takePhoto('home'), home: () => speech('摸摸我嘛～') })[g](), 380); }
    });
  }

  /* =========================================================
     冒险地图
     ========================================================= */
  let selLv = null;
  function renderAdventure() {
    const el = $('#s-adventure');
    const curLv = Math.min(S.unlocked, 9);
    el.innerHTML = `
      <div class="map-scroll" id="mapScroll"><div class="map" id="map">
        ${ART.mapSVG()}
        ${DATA.LEVELS.map(L => {
      const [x, y] = ART.NODES[L.id], st = S.best[L.id] || 0, locked = L.id > S.unlocked;
      return `<button class="node ${locked ? 'locked' : ''} ${L.id === curLv && !st ? 'cur' : ''} ${st ? 'done' : ''} z-${L.zone}" style="left:${x / 3.9}%;top:${y / 15.6}%" data-lv="${L.id}">
            <span class="n-in">${locked ? UI.lock : L.id}</span>
            <span class="n-stars">${[1, 2, 3].map(i => `<i class="${i <= st ? 'on' : ''}">${UI.star}</i>`).join('')}</span></button>`;
    }).join('')}
        <div class="map-bunny" id="mapBunny" style="left:${ART.NODES[curLv][0] / 3.9}%;top:${ART.NODES[curLv][1] / 15.6}%">${ART.bunny({ expr: 'happy', outfit: S.outfit })}</div>
      </div></div>
      <header class="top adv-top">
        <div><h2 class="title sm">小小冒险</h2><p class="subtitle">Tiny adventures · <span class="star-ic">${UI.star}</span> ${totalStars()}/27</p></div>
        <div class="top-r">${coinPill()}</div>
      </header>
      <div class="energy-chip"><i>${UI.bolt}</i>精力 <b>${Math.round(S.stats.energy)}</b></div>
      <div class="level-card" id="levelCard"></div>`;
    const sc = $('#mapScroll');
    requestAnimationFrame(() => {
      const h = $('#map').clientHeight;
      sc.scrollTop = ART.NODES[curLv][1] / ART.MAP_H * h - sc.clientHeight * .52;
    });
    $$('.node', el).forEach(n => n.onclick = () => {
      const L = DATA.LEVELS[n.dataset.lv - 1];
      if (L.id > S.unlocked) { playAnim('shake', n); toast(`先通过第 ${L.id - 1} 关吧～`, 'lock'); Sound.play('bad'); return; }
      Sound.play('tap'); showLevel(L);
      const mb = $('#mapBunny'); mb.style.left = (ART.NODES[L.id][0] / 3.9) + '%'; mb.style.top = (ART.NODES[L.id][1] / 15.6) + '%';
      mb.classList.remove('hop'); void mb.offsetWidth; mb.classList.add('hop');
    });
  }
  function showLevel(L) {
    selLv = L;
    const z = DATA.ZONES.find(z => z.id === L.zone), st = S.best[L.id] || 0, g = DATA.GAMES[L.game];
    const giftHtml = L.gift && !S.owned[L.gift] ? `<div class="lc-gift"><i>${itemArt(L.gift)}</i><span>首通奖励 · <b>${itemInfo(L.gift).name}</b></span></div>` : '';
    const card = $('#levelCard');
    card.innerHTML = `<div class="lc card">
      <button class="lc-x" data-x>${UI.close}</button>
      <div class="lc-row">
        <div class="lc-thumb">${ART.scene(L.zone, { bunny: { expr: 'happy', outfit: S.outfit } })}</div>
        <div class="lc-info"><small>第 ${L.id} 关 · ${z.name}</small><b>${L.name}</b><p>${L.desc}</p>
          <div class="lc-meta"><span>${UI.game}${g.name}</span><span>${UI.clock}${L.time}s</span><span><i class="t-coin">${ART.icon('coin')}</i>+${L.coins}</span></div></div>
      </div>
      ${giftHtml}
      <div class="lc-bottom">
        <div class="lc-best">${[1, 2, 3].map(i => `<i class="${i <= st ? 'on' : ''}">${UI.star}</i>`).join('')}</div>
        <button class="btn-primary" data-start>开始探险<small>${UI.bolt}-15</small><i class="arrow">${UI.arrow}</i></button>
      </div></div>`;
    card.classList.add('show');
    $('[data-x]', card).onclick = () => card.classList.remove('show');
    $('[data-start]', card).onclick = () => startLevel(L);
  }
  function startLevel(L) {
    wakeIfSleeping();
    if (S.stats.energy < 15) return tired();
    S.stats.energy -= 15; save();
    $('#levelCard')?.classList.remove('show');
    const cfg = { title: `${L.id}. ${L.name}`, time: L.time, p: L.p, goals: L.goals, scene: L.zone, outfit: S.outfit };
    Sound.play('whoosh');
    Games.start(L.game, cfg, (r) => onGameEnd(L, L.game, cfg, r));
  }

  function onGameEnd(L, kind, cfg, r) {
    if (r.quit) { Games.close(); return; }
    let coins = 0, xp = 0, gift = null, first = false;
    if (L) {
      const prev = S.best[L.id] || 0; first = r.stars > 0 && !prev;
      if (r.stars > 0) {
        coins = Math.round(L.coins * (.5 + r.stars / 6) * (prev ? .5 : 1));
        xp = 15 + r.stars * 5;
        S.best[L.id] = Math.max(prev, r.stars);
        if (L.id >= S.unlocked) S.unlocked = Math.min(10, L.id + 1);
        if (first && L.gift && !S.owned[L.gift]) { S.owned[L.gift] = 1; gift = L.gift; }
        progress('adventure');
      } else { coins = 5; xp = 3; }
    } else {
      coins = r.stars > 0 || kind !== 'memory' ? Math.min(40, 6 + r.score) : 6; xp = 8;
    }
    progress('play');
    S.stats.mood = clamp(S.stats.mood + 12); S.stats.hunger = clamp(S.stats.hunger - 6); S.stats.clean = clamp(S.stats.clean - 5);
    S.coins += coins; save();
    const win = r.stars > 0;
    const title = win ? ['', '不错哦！', '太棒啦！', '完美通关！'][r.stars] : (kind === 'memory' ? '时间到啦～' : '差一点点～');
    Sound.play(win ? 'success' : 'fail');
    modal(`<div class="result ${win ? 'win' : 'lose'}">
      ${win ? '<div class="lu-rays"></div>' : ''}
      <div class="r-bunny">${ART.bunny({ expr: win ? (r.stars === 3 ? 'love' : 'happy') : 'sad', outfit: S.outfit })}</div>
      <h3>${title}</h3>
      <div class="r-stars">${[1, 2, 3].map(i => `<i class="${i <= r.stars ? 'on' : ''}" style="animation-delay:${.3 + i * .28}s">${UI.star}</i>`).join('')}</div>
      <p class="r-score">${kind === 'memory' ? '配对' : '得分'} <b>${r.score}</b></p>
      <div class="r-rewards"><span><i>${ART.icon('coin')}</i>+${coins}</span><span><i class="xp">XP</i>+${xp}</span><span><i>${UI.smile}</i>心情+12</span></div>
      ${gift ? `<div class="r-gift"><div class="rg-art">${itemArt(gift)}</div><div><small>首通奖励</small><b>${itemInfo(gift).name}</b><span>已放进${itemInfo(gift).kind === 'wear' ? '衣橱' : '小窝'}啦</span></div></div>` : ''}
      <div class="dlg-btns"><button class="btn-ghost" data-r="retry">再来一次</button><button class="btn-primary sm" data-r="ok">${L ? '继续冒险' : '回家'}</button></div>
    </div>`, {
      dismiss: false, cls: 'pop',
      onMount: (m) => {
        [1, 2, 3].forEach(i => { if (i <= r.stars) setTimeout(() => Sound.play('star', i - 1), 300 + i * 280); });
        if (r.stars === 3) setTimeout(() => confetti(60), 1100);
        $$('[data-r]', m).forEach(b => b.onclick = () => {
          closeModal();
          setTimeout(() => {
            gainXp(xp); bumpCoins();
            if (L && first && L.id % 3 === 0) unlockMoment(L.zone);
            if (totalStars() >= 27) unlockMoment('allstar');
            if (b.dataset.r === 'retry') { L ? startLevel(L) : startFree(kind); return; }
            Games.close();
            if (L) { go('adventure'); if (first && L.id < 9) setTimeout(() => { toast(`新关卡解锁：第 ${L.id + 1} 关`, 'flag'); }, 600); }
            else go('home');
          }, 280);
        });
      },
    });
  }

  /* =========================================================
     衣橱
     ========================================================= */
  let wdTab = 'head', tryOn = null;
  function renderWardrobe() {
    if (!tryOn) tryOn = { ...S.outfit };
    const el = $('#s-wardrobe');
    el.innerHTML = `
      <header class="top"><button class="icon-btn" data-back aria-label="返回">${UI.back}</button><h2 class="title-c">小小衣橱 <small>Little looks</small></h2>${coinPill()}</header>
      <div class="wd-stage">
        <div class="wd-bg">${ART.scene('boutique', { par: 'xMidYMax slice' })}</div>
        <div class="wd-mirror">Small looks,<br>big adventures ♡</div>
        <div class="wd-ped"></div>
        <div class="bunny-wrap wd-bunny" id="wdBunny"><div class="bunny-bob">${ART.bunny({ expr: 'normal', outfit: tryOn })}</div></div>
        <button class="chip wd-reset" data-act="wdreset">${UI.close}<span>全部脱下</span></button>
      </div>
      <section class="card wd-panel">
        <div class="tabs">${[['head', '帽饰', 'hat'], ['neck', '围巾', 'scarf'], ['face', '小物', 'glasses']].map(([k, n, ic]) => `<button class="tab ${wdTab === k ? 'on' : ''}" data-wt="${k}">${UI[ic]}${n}</button>`).join('')}</div>
        <div class="wd-grid">${DATA.WARDROBE[wdTab].map(it => {
      const owned = S.owned[it.id], on = tryOn[wdTab] === it.id, locked = !owned && it.reward;
      return `<button class="wi ${on ? 'on' : ''} ${owned ? 'owned' : ''} ${locked ? 'locked' : ''}" data-wi="${it.id}">
            <div class="wi-art">${ART.accIcon(it.id, wdTab)}</div>
            <b>${it.name}</b><small>${it.sub}</small>
            ${on ? `<span class="wi-check">${UI.check}</span>` : ''}
            ${owned ? '' : locked ? `<span class="wi-tag lock">${UI.lock}第${it.reward}关</span>` : `<span class="wi-tag"><i>${ART.icon('coin')}</i>${it.price}</span>`}
          </button>`;
    }).join('')}</div>
      </section>
      <div class="buy-bar" id="wdBar"></div>`;
    $$('[data-wt]', el).forEach(b => b.onclick = () => { wdTab = b.dataset.wt; Sound.play('tap'); renderWardrobe(); });
    $$('[data-wi]', el).forEach(b => b.onclick = () => {
      const id = b.dataset.wi;
      tryOn[wdTab] = tryOn[wdTab] === id ? null : id;
      Sound.play('pop'); renderWardrobe();
      const wb = $('#wdBunny'); wb.querySelector('.bunny-bob').innerHTML = ART.bunny({ expr: tryOn[wdTab] ? 'wink' : 'normal', outfit: tryOn });
      playAnim('jump', wb); fx('sparkle', ...centerOf(wb), 3);
    });
    wdBar();
  }
  function wdBar() {
    const bar = $('#wdBar');
    const ids = Object.values(tryOn).filter(Boolean);
    const unowned = ids.filter(id => !S.owned[id]).map(itemInfo);
    const locked = unowned.filter(i => i.reward);
    const total = unowned.reduce((a, i) => a + i.price, 0);
    const same = JSON.stringify(tryOn) === JSON.stringify(S.outfit);
    bar.innerHTML = `<div class="bb-l"><div class="bb-pic">${ART.bunny({ expr: 'happy', outfit: tryOn })}</div>
      <div>${unowned.length ? (locked.length ? `<b class="lockt">${UI.lock} 含冒险奖励</b><small>通关对应关卡即可获得</small>` : `<b><i class="t-coin">${ART.icon('coin')}</i>${total}</b><small>${unowned.length} 件新装扮</small>`) : `<b>${ids.length} 件装扮</b><small>${same ? '正在穿着' : '都已拥有'}</small>`}</div></div>
      <button class="btn-primary" data-wear ${locked.length || (same && !unowned.length) ? 'disabled' : ''}>${unowned.length && !locked.length ? '买下并穿上' : '穿上这套'}<i class="arrow">${UI.arrow}</i></button>`;
    $('[data-wear]', bar).onclick = () => {
      if (total && !spend(total)) return;
      unowned.forEach(i => S.owned[i.id] = 1);
      S.outfit = { ...tryOn }; save();
      Sound.play(total ? 'buy' : 'happy'); confetti(36);
      toast(total ? '买到啦！已经穿上新装扮～' : '换好啦，好看吗？', 'hanger');
      unlockMoment('newlook'); gainXp(5);
      renderWardrobe();
      const wb = $('#wdBunny'); wb.querySelector('.bunny-bob').innerHTML = ART.bunny({ expr: 'love', outfit: S.outfit }); playAnim('jump', wb);
    };
  }

  /* =========================================================
     小窝
     ========================================================= */
  let roomTab = 'furn', roomPrev = null, roomExpr = null, roomSeat = false;
  function drawRoom() {
    const v = $('#roomView'); if (!v) return;
    const cfg = roomPrev || S.room;
    const seatPos = { seat_beanbag: [24, 150], seat_arm: [22, 140], seat_mush: [20, 132], seat_cloud: [22, 150] }[cfg.seat] || [24, 150];
    $('#roomSvg').innerHTML = ART.roomSVG(cfg, { outfit: S.outfit, expr: roomExpr || (S.sleeping ? 'sleep' : 'normal'), music: Sound.music, bunnyX: roomSeat ? seatPos[0] : 140, bunnyY: roomSeat ? seatPos[1] : 152 });
    const sp = $('#roomSpeech'); const bx = roomSeat ? seatPos[0] : 140;
    sp.style.left = ((bx + 59) / 3.9) + '%'; sp.style.top = (((roomSeat ? seatPos[1] : 152) - 6) / 3.3) + '%';
  }
  function renderRoom() {
    if (!roomPrev) roomPrev = { ...S.room };
    const el = $('#s-room');
    const tab = DATA.ROOM_TABS.find(t => t.id === roomTab);
    el.innerHTML = `
      <header class="top"><div><h2 class="title sm">${S.name}的小窝</h2><p class="subtitle">Momo's corner · 点点房间里的东西试试</p></div>
        <div class="top-r"><button class="pill-btn" data-act="photo-room">${UI.camera}拍照</button></div></header>
      <div class="room-view" id="roomView"><div id="roomSvg"></div><div class="speech room-speech" id="roomSpeech"></div></div>
      <section class="card room-panel">
        <div class="tabs">${DATA.ROOM_TABS.map(t => `<button class="tab ${t.id === roomTab ? 'on' : ''}" data-rt="${t.id}">${UI[{ furn: 'sofa', deco: 'plant', vibe: 'sparkles' }[t.id]]}${t.name}</button>`).join('')}</div>
        <div class="ri-groups">${tab.slots.map(slot => `
          <div class="ri-label">${DATA.ROOM[slot].label}</div>
          <div class="ri-row">${DATA.ROOM[slot].items.map(it => {
      const owned = S.owned[it.id], sel = roomPrev[slot] === it.id, locked = !owned && it.reward;
      return `<button class="ri ${sel ? 'sel' : ''} ${owned ? 'owned' : ''} ${locked ? 'locked' : ''}" data-slot="${slot}" data-ri="${it.id}">
              <div class="ri-art">${ART.roomItemIcon(slot, it.id)}</div><b>${it.name}</b>
              ${sel ? `<span class="wi-check">${UI.check}</span>` : ''}
              ${owned ? '' : locked ? `<span class="wi-tag lock">${UI.lock}第${it.reward}关</span>` : `<span class="wi-tag"><i>${ART.icon('coin')}</i>${it.price}</span>`}</button>`;
    }).join('')}</div>`).join('')}</div>
      </section>
      <div class="buy-bar room-bar" id="roomBar"></div>`;
    drawRoom();
    $$('[data-rt]', el).forEach(b => b.onclick = () => { roomTab = b.dataset.rt; Sound.play('tap'); const st = $('.ri-groups', el).scrollTop; renderRoom(); });
    $$('[data-ri]', el).forEach(b => b.onclick = () => {
      const slot = b.dataset.slot, id = b.dataset.ri;
      roomPrev[slot] = id; Sound.play('pop');
      if (S.owned[id] && S.room[slot] !== id) { S.room[slot] = id; S.cozy++; save(); if (S.cozy >= 5) unlockMoment('cozy'); }
      const scroll = $$('.ri-row', el).map(r => r.scrollLeft);
      renderRoom();
      $$('.ri-row', el).forEach((r, i) => r.scrollLeft = scroll[i] || 0);
      const sv = $('#roomSvg'); sv.classList.remove('pop'); void sv.offsetWidth; sv.classList.add('pop');
    });
    $('#roomView').onclick = (e) => roomHit(e);
    roomBar();
  }
  function roomBar() {
    const bar = $('#roomBar');
    const diff = Object.keys(DATA.ROOM).filter(s => roomPrev[s] !== S.room[s]);
    if (!diff.length) { bar.classList.remove('show'); bar.innerHTML = ''; return; }
    const items = diff.map(s => itemInfo(roomPrev[s]));
    const locked = items.filter(i => i.reward), total = items.reduce((a, i) => a + i.price, 0);
    bar.classList.add('show');
    bar.innerHTML = `<div class="bb-l"><div class="bb-pic room">${itemArt(items[0].id)}</div><div>${locked.length ? `<b class="lockt">${UI.lock} 冒险奖励</b><small>通关第 ${locked[0].reward} 关获得</small>` : `<b><i class="t-coin">${ART.icon('coin')}</i>${total}</b><small>试摆中：${items.map(i => i.name).join('、')}</small>`}</div></div>
      <div class="bb-r"><button class="btn-ghost sm" data-cancel>取消</button><button class="btn-primary sm" data-buy ${locked.length ? 'disabled' : ''}>买下摆好</button></div>`;
    $('[data-cancel]', bar).onclick = () => { roomPrev = { ...S.room }; Sound.play('tap'); renderRoom(); };
    $('[data-buy]', bar).onclick = () => {
      if (!spend(total)) return;
      items.forEach(i => S.owned[i.id] = 1);
      diff.forEach(s => S.room[s] = roomPrev[s]);
      S.cozy += diff.length; save(); if (S.cozy >= 5) unlockMoment('cozy');
      Sound.play('buy'); confetti(30); toast('新家具到家啦！', 'sofa'); gainXp(6);
      roomExpr = 'love'; renderRoom(); setTimeout(() => { roomExpr = null; drawRoom(); }, 1500);
    };
  }
  function roomHit(e) {
    Sound.init();
    const h = e.target.closest('[data-hit]'); if (!h) return;
    const k = h.dataset.hit, cfg = roomPrev || S.room;
    const say = (t, ex = 'happy') => { roomExpr = ex; drawRoom(); speech(t, 2200, $('#roomSpeech')); clearTimeout(roomHit._t); roomHit._t = setTimeout(() => { roomExpr = null; drawRoom(); }, 1600); };
    if (k === 'lamp') { S.room.lampOn = cfg.lampOn = !(cfg.lampOn !== false); save(); Sound.play('tap'); say(cfg.lampOn ? '亮起来啦～暖暖的' : '关灯…有点黑黑的', cfg.lampOn ? 'happy' : 'surprised'); }
    else if (k === 'deco') {
      const d = cfg.deco;
      if (d === 'deco_record') { setMusic(!Sound.music); say(Sound.music ? '音乐响起来～♪' : '安静一会儿吧', Sound.music ? 'love' : 'normal'); fx('note', e.clientX, e.clientY, 4); }
      else if (d === 'deco_clock') { const t = new Date(); say(`现在是 ${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')} 啦`, 'surprised'); Sound.play('tap'); }
      else say({ deco_frame: '这是我们的爪印！', deco_shelf: '我最喜欢《胡萝卜大冒险》', deco_bunting: '每天都是派对日！' }[d] || '嘿嘿～', 'wink');
    } else if (k === 'plant') {
      if (!S.daily.water) { S.daily.water = true; addStat('mood', 5); gainXp(3); fx('sparkle', e.clientX, e.clientY, 8); Sound.play('success'); say('谢谢你给它浇水～心情+5', 'love'); }
      else say('今天已经浇过水啦', 'wink');
    } else if (k === 'window') {
      say({ win_sunset: '晚霞好像橘子汽水', win_sakura: '樱花飘进来了！', win_rain: '下雨天最适合发呆了', win_night: '星星在眨眼睛～' }[cfg.window] || '外面好漂亮', 'love');
    } else if (k === 'seat') { roomSeat = !roomSeat; Sound.play('giggle'); say(roomSeat ? '软软的，好舒服～' : '跳下来啦！', 'happy'); }
    else if (k === 'bunny') { Sound.play('giggle'); say(contextLine(), pick(['happy', 'wink', 'love'])); fx('heart', e.clientX, e.clientY, 3); progress('pet'); }
    else if (k === 'rug') { say('在地毯上打个滚～', 'happy'); Sound.play('soft'); }
  }

  /* =========================================================
     相册
     ========================================================= */
  let albumCat = 'all';
  function renderAlbum() {
    const el = $('#s-album');
    const days = Math.max(1, Math.ceil((Date.now() - S.born) / 864e5));
    const got = Object.keys(S.moments).length;
    const cards = [];
    if (albumCat === 'all' || albumCat === 'photo') S.photos.forEach(p => cards.push({ type: 'photo', p }));
    if (albumCat !== 'photo') DATA.MOMENTS.filter(m => albumCat === 'all' || m.cat === albumCat).forEach(m => cards.push({ type: 'm', m, s: S.moments[m.id] }));
    cards.sort((a, b) => (b.s || b.p ? 1 : 0) - (a.s || a.p ? 1 : 0) || ((b.s?.date || b.p?.date || 0) - (a.s?.date || a.p?.date || 0)));
    el.innerHTML = `
      <header class="top"><div><h2 class="title">我们的<br><em>小时光。</em></h2><p class="subtitle">和${S.name}在一起的第 ${days} 天 · 回忆 ${got}/${DATA.MOMENTS.length}</p></div></header>
      <div class="chips">${[['all', '全部', 'sparkles'], ['mile', '里程碑', 'starLine'], ['adv', '冒险', 'flag'], ['photo', '随手拍', 'camera']].map(([k, n, ic]) => `<button class="chip-f ${albumCat === k ? 'on' : ''}" data-ac="${k}">${UI[ic]}${n}</button>`).join('')}</div>
      <div class="album-grid">${cards.length ? cards.map((c, i) => {
      if (c.type === 'photo') {
        const p = c.p;
        return `<button class="pc" data-ph="${p.id}" style="--rot:${(i % 3 - 1) * 1.2}deg"><div class="pc-img">${ART.scene(p.scene, { bunny: { expr: p.expr, outfit: p.outfit }, room: p.room })}</div>
            <div class="pc-cap"><b>${S.name}的日常</b><small>${fmtDate(p.date)}</small></div><span class="pc-fav ${p.fav ? 'on' : ''}">${p.fav ? UI.heartFill : UI.heart}</span></button>`;
      }
      const m = c.m, s = c.s;
      if (!s) return `<div class="pc locked"><div class="pc-img"><div class="pc-lock">${UI.lock}<span>${m.hint}</span></div></div><div class="pc-cap"><b>???</b><small>尚未解锁</small></div></div>`;
      return `<button class="pc" data-m="${m.id}" style="--rot:${(i % 3 - 1) * 1.2}deg"><div class="pc-img">${ART.scene(m.scene, { bunny: { expr: m.expr, outfit: s.outfit }, room: s.room })}</div>
          <div class="pc-cap"><b>${m.title}</b><small>${fmtDate(s.date)}</small></div><span class="pc-fav ${s.fav ? 'on' : ''}">${s.fav ? UI.heartFill : UI.heart}</span>
          <span class="pc-tag ${m.cat}">${m.cat === 'adv' ? '冒险' : '里程碑'}</span></button>`;
    }).join('') : `<div class="empty">${ART.bunny({ expr: 'wink', outfit: S.outfit })}<p>还没有照片哦<br>去首页或小窝按下相机吧～</p></div>`}</div>
      <div class="pad-bottom"></div>`;
    $$('[data-ac]', el).forEach(b => b.onclick = () => { albumCat = b.dataset.ac; Sound.play('tap'); renderAlbum(); });
    $$('[data-m]', el).forEach(b => b.onclick = () => openMoment(b.dataset.m));
    $$('[data-ph]', el).forEach(b => b.onclick = () => openPhoto(b.dataset.ph));
    S.seenAlbum = got + S.photos.length; save(); badges();
  }
  function polaroid(sceneHtml, title, date, desc, fav, extraBtn) {
    return `<div class="big-pc"><div class="bp-frame"><div class="bp-img">${sceneHtml}</div><div class="bp-cap">${title}</div><div class="bp-date">${date}</div></div>
      ${desc ? `<p class="bp-desc">${desc}</p>` : ''}
      <div class="dlg-btns">${extraBtn || ''}<button class="btn-ghost" data-fav>${fav ? UI.heartFill + '已收藏' : UI.heart + '收藏'}</button><button class="btn-primary sm" data-close>收好啦</button></div></div>`;
  }
  function openMoment(id) {
    const m = DATA.MOMENTS.find(x => x.id === id), s = S.moments[id];
    Sound.play('soft');
    modal(polaroid(ART.scene(m.scene, { bunny: { expr: m.expr, outfit: s.outfit }, room: s.room }), m.title, fmtDate(s.date), m.desc, s.fav), {
      cls: 'photo', onMount: (el) => {
        $('[data-close]', el).onclick = () => closeModal();
        $('[data-fav]', el).onclick = (e) => { s.fav = !s.fav; save(); Sound.play(s.fav ? 'happy' : 'tap'); if (s.fav) fx('heart', e.clientX, e.clientY, 5); e.currentTarget.innerHTML = s.fav ? UI.heartFill + '已收藏' : UI.heart + '收藏'; renderAlbum(); };
      },
    });
  }
  function openPhoto(id) {
    const p = S.photos.find(x => x.id === id);
    Sound.play('soft');
    modal(polaroid(ART.scene(p.scene, { bunny: { expr: p.expr, outfit: p.outfit }, room: p.room }), `${S.name}的日常`, fmtDate(p.date), p.scene === 'room' ? '在小窝里的悠闲时光。' : '今天也是可爱的一天。', p.fav, `<button class="btn-ghost icon" data-del aria-label="删除">${UI.trash}</button>`), {
      cls: 'photo', onMount: (el) => {
        $('[data-close]', el).onclick = () => closeModal();
        $('[data-fav]', el).onclick = (e) => { p.fav = !p.fav; save(); Sound.play(p.fav ? 'happy' : 'tap'); if (p.fav) fx('heart', e.clientX, e.clientY, 5); e.currentTarget.innerHTML = p.fav ? UI.heartFill + '已收藏' : UI.heart + '收藏'; renderAlbum(); };
        $('[data-del]', el).onclick = () => { closeModal(); setTimeout(() => confirm('删除这张照片？', '删掉之后就找不回来啦。', '留着吧', '删除', (ok) => { if (ok) { S.photos = S.photos.filter(x => x.id !== id); save(); renderAlbum(); toast('照片已删除', 'trash'); } }), 300); };
      },
    });
  }

  /* =========================================================
     设置 / 礼物 / 引导
     ========================================================= */
  function setMusic(v) { S.settings.music = v; Sound.setMusic(v); save(); }
  function openSettings() {
    sheet(`<div class="sheet-h"><b>设置</b><span>MOMO · 毛毛的小日子</span></div>
      <div class="set-list">
        <label class="set"><span>${UI.sound}音效</span><input type="checkbox" data-s="sfx" ${S.settings.sfx ? 'checked' : ''}><i class="sw"></i></label>
        <label class="set"><span>${UI.music}八音盒音乐</span><input type="checkbox" data-s="music" ${S.settings.music ? 'checked' : ''}><i class="sw"></i></label>
        <button class="set" data-s="rename"><span>${UI.heart}给它改个名字</span><em>${S.name}</em></button>
        <button class="set danger" data-s="reset"><span>${UI.trash}重新开始</span><em>清空全部进度</em></button>
      </div>
      <p class="set-foot">所有画面均由 SVG 手绘生成 · 进度自动保存在本机</p>`, {
      onMount: (sh) => {
        $('[data-s=sfx]', sh).onchange = (e) => { S.settings.sfx = e.target.checked; Sound.setSfx(e.target.checked); save(); Sound.play('tap'); };
        $('[data-s=music]', sh).onchange = (e) => { Sound.init(); setMusic(e.target.checked); };
        $('[data-s=rename]', sh).onclick = () => { closeSheet(); setTimeout(askName, 300); };
        $('[data-s=reset]', sh).onclick = () => { closeSheet(); setTimeout(() => confirm('真的要重新开始吗？', '所有金币、装扮、回忆都会被清空。', '再想想', '重新开始', (ok) => { if (ok) { localStorage.removeItem(KEY); location.reload(); } }), 300); };
      },
    });
  }
  function askName(first) {
    modal(`<div class="onboard">
      <div class="ob-bunny">${ART.bunny({ expr: 'happy', outfit: S.outfit, cls: 'wave' })}</div>
      <h2>${first ? '你好呀～' : '想叫我什么呢？'}</h2>
      <p>${first ? '我是一只毛绒绒的小兔子，<br>以后请多多照顾我哦！' : '换一个可爱的名字吧'}</p>
      <label class="ob-in"><span>给我取个名字吧</span><input id="obName" maxlength="6" value="${S.name}" autocomplete="off"></label>
      <button class="btn-primary" data-go-name>${first ? '开始我们的小日子' : '就叫这个！'}<i class="arrow">${UI.arrow}</i></button>
      ${first ? '<div class="ob-tips"><span>养成</span><span>闯关</span><span>装扮</span><span>相册</span></div>' : ''}</div>`, {
      dismiss: !first, cls: 'pop',
      onMount: (m) => {
        const go2 = () => {
          Sound.init(); Sound.setSfx(S.settings.sfx); if (S.settings.music) Sound.setMusic(true);
          S.name = ($('#obName').value || '毛毛').trim().slice(0, 6) || '毛毛';
          const wasFirst = !S.started; S.started = true; save(); closeModal();
          Sound.play('happy'); renderAll();
          if (wasFirst) { setTimeout(() => { confetti(50); react('love', 1600, 'jump'); speech(`我是${S.name}！请多指教～`, 3000); unlockMoment('hello'); }, 400); }
        };
        $('[data-go-name]', m).onclick = go2;
        $('#obName').onkeydown = (e) => { if (e.key === 'Enter') go2(); };
      },
    });
  }
  function dailyGift(btn) {
    checkDay();
    if (S.daily.gift) { toast('今天的礼物已经领过啦，明天再来～', 'gift'); Sound.play('tap'); return; }
    S.daily.gift = true; save();
    modal(`<div class="gift-dlg"><div class="lu-rays"></div><div class="gd-box">${ART.icon('gift')}</div><h3>每日小礼物</h3><p>${S.name}给你准备了一点心意～</p>
      <div class="r-rewards"><span><i>${ART.icon('coin')}</i>+50</span><span><i>${ART.icon('carrot')}</i>胡萝卜 ×2</span></div>
      <button class="btn-primary" data-close>收下啦<i class="arrow">${UI.arrow}</i></button></div>`, {
      cls: 'pop', onMount: (m) => { Sound.play('success'); $('[data-close]', m).onclick = (e) => { closeModal(); S.food.carrot += 2; addCoins(50, btn); }; },
    });
  }
  function openChest(btn) {
    if (!allClaimed() || S.daily.chest) return;
    S.daily.chest = true; S.food.cupcake = (S.food.cupcake || 0) + 1; save();
    addCoins(80, btn); confetti(60); Sound.play('levelup'); gainXp(20);
    toast('宝箱打开啦！+80 金币 · 小蛋糕', 'gift');
    setTimeout(() => { renderTasks(); badges(); }, 600);
  }

  /* =========================================================
     路由
     ========================================================= */
  let cur = 'home';
  const RENDER = { home: renderHome, tasks: renderTasks, adventure: renderAdventure, room: renderRoom, album: renderAlbum, wardrobe: renderWardrobe };
  function go(name) {
    if (mode === 'bath' && name !== 'home') endBath(false);
    closeSheet(true);
    if (name === 'wardrobe') tryOn = { ...S.outfit };
    if (name === 'room') { roomPrev = { ...S.room }; roomSeat = false; }
    const prev = cur; cur = name;
    RENDER[name]();
    $$('.screen').forEach(s => s.classList.toggle('active', s.id === 's-' + name));
    $$('.screen').forEach(s => s.classList.toggle('push', s.id === 's-wardrobe' && name === 'wardrobe'));
    $$('.tabbar [data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === name));
    $('#tabbar').classList.toggle('hide', name === 'wardrobe');
    const sc = $('#s-' + name); if (sc && prev !== name) sc.scrollTop = 0;
    badges();
  }
  function renderAll() { go(cur); }

  function bindGlobal() {
    const ph = phone();
    ph.addEventListener('pointerdown', () => Sound.init(), { once: false, capture: true });
    ph.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab],[data-tab-go],[data-go],[data-act],[data-back]');
      if (!t) return;
      if (t.dataset.tab) { if (t.dataset.tab !== cur) { Sound.play('tap'); go(t.dataset.tab); } else if (cur === 'adventure') { Sound.play('tap'); } return; }
      if (t.dataset.tabGo) { Sound.play('tap'); go(t.dataset.tabGo); return; }
      if (t.dataset.go) { Sound.play('tap'); go(t.dataset.go); return; }
      if (t.hasAttribute('data-back')) { Sound.play('tap'); go('home'); return; }
      const a = t.dataset.act;
      ({
        feed: openFeed, play: openPlay, bath: startBath, sleep: toggleSleep,
        photo: () => takePhoto('home'), 'photo-room': () => takePhoto('room'),
        settings: openSettings, gift: () => dailyGift(t), chest: () => openChest(t),
        lvinfo: () => { toast(`Lv.${S.level} · 经验 ${S.xp}/${need(S.level)}`, 'starLine'); Sound.play('tap'); },
        wdreset: () => { tryOn = { head: null, neck: null, face: null }; Sound.play('whoosh'); renderWardrobe(); },
      })[a]?.();
    });
  }

  function init() {
    const d = document.createElement('div');
    d.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${ART.DEFS}</defs></svg>`;
    document.body.prepend(d.firstChild);
    load();
    // 离线流逝
    const away = Math.min((Date.now() - S.last) / 1000, 6 * 3600);
    if (away > 30) {
      const before = { ...S.stats };
      decay(away, false);
      for (const k in S.stats) if (!S.sleeping || k !== 'energy') S.stats[k] = Math.max(S.stats[k], before[k] - 40, 8);
    }
    S.last = Date.now();
    checkDay();
    Sound.setSfx(S.settings.sfx);
    $('#tabbar').innerHTML = `
      <button data-tab="home">${UI.home}<span>首页</span></button>
      <button data-tab="tasks">${UI.tasks}<span>任务</span><i class="dot"></i></button>
      <button class="tab-center" data-tab="adventure" aria-label="冒险"><span class="paw">${UI.paw}</span><em>冒险</em></button>
      <button data-tab="room">${UI.room}<span>小窝</span></button>
      <button data-tab="album">${UI.album}<span>相册</span><i class="dot"></i></button>`;
    bindGlobal();
    go('home');
    setInterval(tick, 1000); tick();
    // 偶尔自言自语
    setInterval(() => { if (cur === 'home' && !mode && !mOpen && !S.sleeping && Math.random() < .5) { speech(contextLine(), 2400); if (Math.random() < .5) playAnim('wiggle'); } }, 14000);
    Sound.setMusic(S.settings.music); // 首次触摸时 Sound.init() 会自动开始播放
    if (!S.started) setTimeout(() => askName(true), 500);
    document.addEventListener('visibilitychange', () => { if (document.hidden) localStorage.setItem(KEY, JSON.stringify(S)); });
  }

  return { init, haptic, confirm, toast, go, get state() { return S; } };
})();

window.addEventListener('DOMContentLoaded', App.init);
