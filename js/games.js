/* =========================================================
   MOMO · 三个小游戏：萝卜雨 / 拔萝卜 / 记忆翻翻乐
   Games.start(kind, cfg, onEnd)  →  onEnd({score, stars, quit})
   ========================================================= */
const Games = (() => {
  const root = () => document.getElementById('game');
  let cur = null;

  const toImg = (svgStr, w, h) => new Promise(res => {
    const img = new Image();
    img.onload = () => res(img); img.onerror = () => res(img);
    const s = svgStr.replace('<svg ', `<svg width="${w}" height="${h}" `);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  });
  const standaloneIcon = (k) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs>${ART.DEFS}</defs>${ART.FOOD[k]}</svg>`;

  function frame(kind, cfg) {
    const g = DATA.GAMES[kind];
    const el = root();
    el.innerHTML = `
      <div class="g-bg">${ART.scene(cfg.scene || 'meadow', { par: 'xMidYMax slice' })}</div>
      <div class="g-top">
        <button class="g-btn" data-g="quit" aria-label="退出">${ART.UI.close}</button>
        <div class="g-title"><b>${cfg.title || g.name}</b><span>${g.en}</span></div>
        <div class="g-score"><i>${ART.icon(kind === 'memory' ? 'star' : 'carrot')}</i><b id="gScore">0</b></div>
      </div>
      <div class="g-hud">
        <div class="g-timer"><i id="gTimeBar"></i></div>
        <div class="g-meta" id="gMeta"></div>
      </div>
      <div class="g-goals" id="gGoals"></div>
      <div class="g-stage" id="gStage"></div>
      <div class="g-count" id="gCount"></div>
      <div class="g-tip" id="gTip">${g.desc}</div>`;
    el.classList.add('show');
    el.querySelector('[data-g=quit]').onclick = () => cur && cur.askQuit();
    if (cfg.goals) {
      el.querySelector('#gGoals').innerHTML = cfg.goals.map((v, i) =>
        `<span class="gg" data-i="${i}"><i>${ART.UI.star}</i>${v}</span>`).join('');
    }
    return el;
  }

  function countdown(cb) {
    const c = document.getElementById('gCount');
    const seq = ['3', '2', '1', '开始！'];
    let i = 0;
    const tick = () => {
      if (!cur || cur.dead) return;
      if (i >= seq.length) { c.classList.remove('on'); document.getElementById('gTip').classList.add('hide'); cb(); return; }
      c.textContent = seq[i]; c.classList.remove('on'); void c.offsetWidth; c.classList.add('on');
      Sound.play('count', i === 3); i++;
      setTimeout(tick, i === 4 ? 650 : 700);
    };
    setTimeout(tick, 500);
  }

  function makeCtl(cfg, onEnd) {
    const ctl = {
      dead: false, paused: false, score: 0, timers: [],
      setScore(v) {
        ctl.score = Math.max(0, v);
        const s = document.getElementById('gScore');
        if (s) { s.textContent = ctl.score; s.parentElement.classList.remove('bump'); void s.offsetWidth; s.parentElement.classList.add('bump'); }
        if (cfg.goals) document.querySelectorAll('#gGoals .gg').forEach((e, i) => e.classList.toggle('on', ctl.score >= cfg.goals[i]));
      },
      later(fn, ms) { const t = setTimeout(() => { if (!ctl.dead && !ctl.paused) fn(); }, ms); ctl.timers.push(t); return t; },
      finish(stars) {
        if (ctl.dead) return; ctl.dead = true;
        ctl.timers.forEach(clearTimeout); ctl.cleanup && ctl.cleanup();
        setTimeout(() => onEnd({ score: ctl.score, stars, quit: false }), 450);
      },
      askQuit() {
        if (ctl.dead) return;
        ctl.paused = true;
        App.confirm('要离开吗？', '这一局的进度不会保存哦～', '继续玩', '离开', (leave) => {
          if (leave) { ctl.dead = true; ctl.timers.forEach(clearTimeout); ctl.cleanup && ctl.cleanup(); onEnd({ score: 0, stars: 0, quit: true }); }
          else { ctl.paused = false; ctl.resume && ctl.resume(); }
        });
      },
      starsByGoals() { return cfg.goals ? cfg.goals.filter(g => ctl.score >= g).length : 0; },
    };
    return ctl;
  }

  function floatText(stage, x, y, txt, cls = '') {
    const s = document.createElement('div');
    s.className = 'g-float ' + cls; s.textContent = txt;
    s.style.left = x + 'px'; s.style.top = y + 'px';
    stage.appendChild(s); setTimeout(() => s.remove(), 900);
  }

  /* ---------------- 萝卜雨 ---------------- */
  async function catchGame(cfg, ctl) {
    const stage = document.getElementById('gStage');
    stage.classList.add('catch');
    const cv = document.createElement('canvas'); stage.appendChild(cv);
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => { W = stage.clientWidth; H = stage.clientHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const BW = Math.min(124, W * .32), BH = BW * 1.16;
    const of = cfg.outfit || {};
    const [bN, bH, bO, ...icons] = await Promise.all([
      toImg(ART.bunny({ standalone: true, basket: true, outfit: of }), BW * dpr, BH * dpr),
      toImg(ART.bunny({ standalone: true, basket: true, outfit: of, expr: 'happy' }), BW * dpr, BH * dpr),
      toImg(ART.bunny({ standalone: true, basket: true, outfit: of, expr: 'ouch' }), BW * dpr, BH * dpr),
      ...['carrot', 'strawberry', 'gold', 'rock', 'burr', 'cupcake'].map(k => toImg(standaloneIcon(k), 96, 96)),
    ]);
    const IMG = { carrot: icons[0], strawberry: icons[1], gold: icons[2], rock: icons[3], burr: icons[4], cupcake: icons[5] };
    const VAL = { carrot: 1, strawberry: 2, gold: 5, cupcake: 3 };
    const p = cfg.p;
    const B = { x: W / 2, tx: W / 2, face: 'n', faceT: 0, sq: 0 };
    let items = [], parts = [], hearts = 3, combo = 0, spawnT = .4, t = 0, last = 0, raf = 0, shake = 0, running = false;
    const meta = document.getElementById('gMeta');
    const drawMeta = () => meta.innerHTML = `<span class="hearts">${[0, 1, 2].map(i => `<i class="${i < hearts ? '' : 'off'}">${ART.UI.heartFill}</i>`).join('')}</span>${combo >= 3 ? `<span class="combo">连击 ×${combo}</span>` : ''}`;
    drawMeta();

    const spawn = () => {
      const r = Math.random();
      let type;
      if (r < p.bad) type = Math.random() < .5 ? 'rock' : 'burr';
      else { const g = Math.random(); type = g < .05 ? 'gold' : g < .12 ? 'cupcake' : g < .38 ? 'strawberry' : 'carrot'; }
      items.push({ type, x: 28 + Math.random() * (W - 56), y: -30, vy: p.speed * (.85 + Math.random() * .35) * (1 + t / 60), rot: Math.random() * 6, vr: (Math.random() - .5) * 3, sw: Math.random() * 6, sz: type === 'gold' ? 46 : 42 });
    };
    const burst = (x, y, col, n = 8) => { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = 60 + Math.random() * 120; parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, life: .6, col, r: 2 + Math.random() * 3 }); } };

    const onMove = (e) => { const r = stage.getBoundingClientRect(); B.tx = Math.max(BW / 2, Math.min(W - BW / 2, (e.clientX - r.left) * W / r.width)); };
    stage.addEventListener('pointerdown', onMove); stage.addEventListener('pointermove', onMove);
    const keys = {};
    const kd = (e) => { keys[e.key] = true; }, ku = (e) => { keys[e.key] = false; };
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
    window.addEventListener('resize', resize);
    ctl.cleanup = () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('resize', resize); };
    ctl.resume = () => { last = performance.now(); raf = requestAnimationFrame(loop); };

    const bar = document.getElementById('gTimeBar');
    function loop(now) {
      if (ctl.dead) return;
      if (ctl.paused) return;
      const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
      if (running) {
        t += dt;
        bar.style.transform = `scaleX(${Math.max(0, 1 - t / cfg.time)})`;
        if (t >= cfg.time) { running = false; ctl.finish(ctl.starsByGoals()); }
        spawnT -= dt;
        if (spawnT <= 0) { spawn(); spawnT = p.rate * (.7 + Math.random() * .6) * Math.max(.6, 1 - t / 80); }
      }
      if (keys.ArrowLeft) B.tx = Math.max(BW / 2, B.tx - 420 * dt);
      if (keys.ArrowRight) B.tx = Math.min(W - BW / 2, B.tx + 420 * dt);
      const prevX = B.x;
      B.x += (B.tx - B.x) * Math.min(1, dt * 14);
      const lean = Math.max(-.18, Math.min(.18, (B.x - prevX) * .02));
      B.faceT -= dt; if (B.faceT <= 0) B.face = 'n';
      B.sq = Math.max(0, B.sq - dt * 4);
      const top = H - BH - 6, rimY = top + BH * .76;
      for (const it of items) {
        it.y += it.vy * dt; it.rot += it.vr * dt; it.sw += dt * 3;
        if (!it.done && it.y > rimY - 16 && it.y < rimY + 18 && Math.abs(it.x + Math.sin(it.sw) * 6 - B.x) < BW * .36) {
          it.done = true;
          if (VAL[it.type]) {
            combo++;
            const bonus = combo >= 5 ? 1 : 0;
            ctl.setScore(ctl.score + VAL[it.type] + bonus);
            B.face = 'h'; B.faceT = .45; B.sq = 1;
            burst(it.x, rimY, it.type === 'gold' ? '#f7c453' : it.type === 'strawberry' ? '#f2575e' : '#f59a46', it.type === 'gold' ? 16 : 8);
            floatText(stage, it.x, rimY - 30, `+${VAL[it.type] + bonus}`, it.type === 'gold' ? 'gold' : '');
            if (combo === 5 || combo === 10 || combo === 15) floatText(stage, W / 2, H * .35, `连击 ×${combo}!`, 'big');
            Sound.play(it.type === 'gold' ? 'coin' : 'pop'); App.haptic(8);
          } else {
            hearts--; combo = 0; shake = .35; B.face = 'o'; B.faceT = .7;
            burst(it.x, rimY, '#8a7f76', 10);
            floatText(stage, it.x, rimY - 30, '好痛！', 'bad');
            Sound.play('bad'); App.haptic([20, 40, 20]);
            if (hearts <= 0) { running = false; ctl.finish(ctl.starsByGoals()); }
          }
          drawMeta();
        }
        if (!it.done && it.y > H + 40) { it.done = true; if (VAL[it.type] && combo) { combo = 0; drawMeta(); } }
      }
      items = items.filter(i => !i.done);
      for (const q of parts) { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 400 * dt; q.life -= dt; }
      parts = parts.filter(q => q.life > 0);

      // draw
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (shake > 0) { shake -= dt; ctx.translate((Math.random() - .5) * 10 * shake * 3, (Math.random() - .5) * 6 * shake * 3); }
      for (const it of items) {
        const x = it.x + Math.sin(it.sw) * 6;
        ctx.save(); ctx.translate(x, it.y); ctx.rotate(Math.sin(it.rot) * .5);
        if (it.type === 'gold') { ctx.shadowColor = '#ffd76a'; ctx.shadowBlur = 18; }
        ctx.drawImage(IMG[it.type], -it.sz / 2, -it.sz / 2, it.sz, it.sz);
        ctx.restore();
      }
      const img = B.face === 'h' ? bH : B.face === 'o' ? bO : bN;
      ctx.save();
      ctx.translate(B.x, H - 6);
      ctx.rotate(lean);
      const sx = 1 + B.sq * .08, sy = 1 - B.sq * .08;
      ctx.scale(sx, sy);
      ctx.drawImage(img, -BW / 2, -BH, BW, BH);
      ctx.restore();
      for (const q of parts) { ctx.globalAlpha = Math.max(0, q.life / .6); ctx.fillStyle = q.col; ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 7); ctx.fill(); }
      ctx.globalAlpha = 1;
      ctx.restore();
      raf = requestAnimationFrame(loop);
    }
    last = performance.now(); raf = requestAnimationFrame(loop);
    countdown(() => { running = true; });
  }

  /* ---------------- 拔萝卜 ---------------- */
  function pullGame(cfg, ctl) {
    const stage = document.getElementById('gStage');
    stage.classList.add('pull');
    const of = cfg.outfit || {};
    stage.innerHTML = `
      <div class="pull-buddy" id="pBuddy">${ART.bunny({ outfit: of, expr: 'happy' })}</div>
      <div class="pull-bubble" id="pBubble">加油加油！</div>
      <div class="pull-field">${Array.from({ length: 9 }, (_, i) => `
        <div class="hole" data-i="${i}">
          <div class="hole-back"></div>
          <div class="hole-mask"><div class="hole-item"></div></div>
          <div class="hole-front"></div>
        </div>`).join('')}</div>`;
    const holes = [...stage.querySelectorAll('.hole')];
    const state = holes.map(() => null);
    const p = cfg.p;
    let t = 0, running = false, combo = 0, tick = null;
    const buddy = document.getElementById('pBuddy'), bubble = document.getElementById('pBubble');
    const setBuddy = (expr, txt) => {
      buddy.innerHTML = ART.bunny({ outfit: of, expr });
      buddy.classList.remove('hop'); void buddy.offsetWidth; buddy.classList.add('hop');
      if (txt) { bubble.textContent = txt; bubble.classList.remove('on'); void bubble.offsetWidth; bubble.classList.add('on'); }
    };
    const bar = document.getElementById('gTimeBar');
    const meta = document.getElementById('gMeta');
    const drawMeta = () => meta.innerHTML = combo >= 3 ? `<span class="combo">连击 ×${combo}</span>` : '';

    function pop() {
      const free = state.map((s, i) => s ? -1 : i).filter(i => i >= 0);
      if (!free.length) return;
      const i = free[Math.floor(Math.random() * free.length)];
      const r = Math.random();
      const type = r < p.bee ? 'bee' : r < p.bee + .08 ? 'gold' : 'carrot';
      const life = p.life * (1 - t / cfg.time * .25) * (type === 'gold' ? .75 : 1);
      const el = holes[i].querySelector('.hole-item');
      el.innerHTML = ART.icon(type);
      holes[i].className = 'hole up ' + type;
      state[i] = { type, timer: ctl.later(() => hide(i), life) };
    }
    function hide(i) { if (!state[i]) return; holes[i].classList.remove('up'); state[i] = null; }

    holes.forEach((h, i) => h.addEventListener('pointerdown', (e) => {
      if (!running || !state[i] || state[i].hit) return;
      const s = state[i]; s.hit = true; clearTimeout(s.timer);
      const r = h.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      const x = r.left - sr.left + r.width / 2, y = r.top - sr.top + 10;
      if (s.type === 'bee') {
        combo = 0; ctl.setScore(ctl.score - 2);
        h.classList.add('stung'); stage.classList.add('shake'); setTimeout(() => stage.classList.remove('shake'), 400);
        floatText(stage, x, y, '-2 被蛰啦', 'bad'); Sound.play('bad'); App.haptic([20, 40, 20]);
        setBuddy('ouch', '哎呀！是蜜蜂！');
      } else {
        combo++;
        const v = (s.type === 'gold' ? 3 : 1) + (combo >= 5 ? 1 : 0);
        ctl.setScore(ctl.score + v);
        h.classList.add('pulled');
        floatText(stage, x, y, '+' + v, s.type === 'gold' ? 'gold' : '');
        Sound.play(s.type === 'gold' ? 'coin' : 'pop'); App.haptic(8);
        if (combo % 5 === 0) setBuddy('love', `连击 ×${combo}！太厉害了`);
        else if (Math.random() < .25) setBuddy('happy', ['拔得好！', '好大一根！', '嘿咻～', '再来再来！'][Math.floor(Math.random() * 4)]);
      }
      drawMeta();
      ctl.later(() => { h.className = 'hole'; state[i] = null; }, 380);
    }));

    let spawnAcc = 0, last = performance.now();
    function loop() {
      if (ctl.dead || ctl.paused) return;
      const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now;
      if (running) {
        t += dt; spawnAcc += dt * 1000;
        bar.style.transform = `scaleX(${Math.max(0, 1 - t / cfg.time)})`;
        const rate = p.rate * (1 - t / cfg.time * .3);
        if (spawnAcc >= rate) { spawnAcc = 0; pop(); if (Math.random() < .25 + t / cfg.time * .3) pop(); }
        if (t >= cfg.time) { running = false; ctl.finish(ctl.starsByGoals()); return; }
      }
      tick = requestAnimationFrame(loop);
    }
    ctl.cleanup = () => cancelAnimationFrame(tick);
    ctl.resume = () => { last = performance.now(); tick = requestAnimationFrame(loop); };
    tick = requestAnimationFrame(loop);
    countdown(() => { running = true; setBuddy('happy', '冲呀！'); });
  }

  /* ---------------- 记忆翻翻乐 ---------------- */
  function memoryGame(cfg, ctl) {
    const stage = document.getElementById('gStage');
    stage.classList.add('memory');
    const pool = ['carrot', 'strawberry', 'clover', 'cupcake', 'daisy', 'mushroom', 'star', 'moon', 'heart', 'acorn'];
    const n = cfg.p.pairs;
    const picks = pool.sort(() => Math.random() - .5).slice(0, n);
    const deck = [...picks, ...picks].sort(() => Math.random() - .5);
    const cols = 4;
    stage.innerHTML = `<div class="mem-grid" style="--cols:${cols};--rows:${Math.ceil(deck.length / cols)}">${deck.map((k, i) => `
      <button class="mcard" data-i="${i}" data-k="${k}"><div class="mc-in">
        <div class="mc-face mc-back"><span>${ART.UI.paw}</span></div>
        <div class="mc-face mc-front">${ART.icon(k)}</div></div></button>`).join('')}</div>`;
    const cards = [...stage.querySelectorAll('.mcard')];
    let open = [], moves = 0, matched = 0, t = 0, running = false, raf = 0, lock = false, last = performance.now();
    const meta = document.getElementById('gMeta');
    const bar = document.getElementById('gTimeBar');
    const drawMeta = () => meta.innerHTML = `<span class="moves">步数 <b>${moves}</b></span><span class="moves">配对 <b>${matched}/${n}</b></span>`;
    drawMeta();
    const starsFor = () => moves <= Math.ceil(n * 1.6) ? 3 : moves <= Math.ceil(n * 2.3) ? 2 : 1;
    // 开局先偷看一眼
    cards.forEach(c => c.classList.add('peek'));

    cards.forEach(c => c.addEventListener('click', () => {
      if (!running || lock || c.classList.contains('open') || c.classList.contains('done')) return;
      c.classList.add('open'); Sound.play('flip'); open.push(c);
      if (open.length === 2) {
        moves++; lock = true;
        const [a, b] = open;
        if (a.dataset.k === b.dataset.k) {
          setTimeout(() => {
            a.classList.add('done'); b.classList.add('done'); matched++;
            ctl.setScore(matched); Sound.play('match'); App.haptic(10);
            open = []; lock = false; drawMeta();
            if (matched === n) { running = false; ctl.finish(starsFor()); }
          }, 280);
        } else {
          setTimeout(() => { a.classList.remove('open'); b.classList.remove('open'); a.classList.add('nope'); b.classList.add('nope'); setTimeout(() => { a.classList.remove('nope'); b.classList.remove('nope'); }, 300); open = []; lock = false; }, 720);
        }
        drawMeta();
      }
    }));
    function loop() {
      if (ctl.dead || ctl.paused) return;
      const now = performance.now(), dt = Math.min(.1, (now - last) / 1000); last = now;
      if (running) {
        t += dt; bar.style.transform = `scaleX(${Math.max(0, 1 - t / cfg.time)})`;
        if (t >= cfg.time) { running = false; ctl.finish(0); return; }
      }
      raf = requestAnimationFrame(loop);
    }
    ctl.cleanup = () => cancelAnimationFrame(raf);
    ctl.resume = () => { last = performance.now(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    countdown(() => {
      setTimeout(() => cards.forEach(c => c.classList.remove('peek')), 900);
      setTimeout(() => { running = true; }, 1300);
    });
  }

  function start(kind, cfg, onEnd) {
    frame(kind, cfg);
    cur = makeCtl(cfg, (r) => { cur = null; onEnd(r); });
    if (kind === 'catch') catchGame(cfg, cur);
    else if (kind === 'pull') pullGame(cfg, cur);
    else memoryGame(cfg, cur);
  }
  function close() { const el = root(); el.classList.remove('show'); setTimeout(() => { if (!el.classList.contains('show')) el.innerHTML = ''; }, 400); }
  return { start, close };
})();
