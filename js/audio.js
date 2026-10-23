/* =========================================================
   MOMO · 音效与八音盒背景音乐（WebAudio 实时合成，无外部音频文件）
   ========================================================= */
const Sound = (() => {
  let ctx = null, master, sfxBus, musicBus, delay, fb;
  let sfxOn = true, musicOn = true, musicTimer = null, step = 0, nextT = 0;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = .7; master.connect(ctx.destination);
    sfxBus = ctx.createGain(); sfxBus.gain.value = .9; sfxBus.connect(master);
    musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(master);
    delay = ctx.createDelay(1); delay.delayTime.value = .32;
    fb = ctx.createGain(); fb.gain.value = .32;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    delay.connect(lp); lp.connect(fb); fb.connect(delay); lp.connect(musicBus);
    if (musicOn) startMusic();
  }

  function tone(freq, dur = .15, type = 'sine', vol = .2, when = 0, slide, bus) {
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .012);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(bus || sfxBus);
    o.start(t); o.stop(t + dur + .05);
    return g;
  }
  function noise(dur = .06, vol = .15, freq = 2000, when = 0) {
    if (!ctx) return;
    const t = ctx.currentTime + when;
    const len = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 1.2;
    g.gain.value = vol; s.buffer = buf;
    s.connect(f); f.connect(g); g.connect(sfxBus); s.start(t);
  }

  const N = (n) => 440 * Math.pow(2, (n - 69) / 12);
  const fx = {
    tap: () => tone(880, .09, 'sine', .14, 0, 1320),
    soft: () => tone(660, .08, 'sine', .1, 0, 880),
    pop: () => { tone(520 + Math.random() * 300, .07, 'triangle', .16, 0, 1500); },
    bubble: () => { tone(380 + Math.random() * 420, .09, 'sine', .18, 0, 1300); noise(.03, .05, 5000); },
    coin: () => { tone(988, .08, 'square', .05); tone(1319, .28, 'square', .05, .07); },
    eat: () => { [0, .17, .34].forEach(w => noise(.05, .22, 1600 + Math.random() * 600, w)); },
    happy: () => [72, 76, 79].forEach((n, i) => tone(N(n), .2, 'triangle', .12, i * .07)),
    giggle: () => [84, 88, 84, 91].forEach((n, i) => tone(N(n), .07, 'sine', .1, i * .06)),
    success: () => [72, 76, 79, 84, 88].forEach((n, i) => tone(N(n), .32, 'triangle', .13, i * .09)),
    fail: () => [67, 64, 60].forEach((n, i) => tone(N(n), .3, 'triangle', .12, i * .13)),
    star: (i = 0) => { tone(N(79 + i * 4), .4, 'triangle', .15); tone(N(91 + i * 4), .3, 'sine', .06, .02); },
    bad: () => { tone(220, .22, 'sawtooth', .05, 0, 110); noise(.1, .12, 400); },
    shutter: () => { noise(.05, .35, 3500); noise(.07, .25, 1800, .07); },
    flip: () => noise(.04, .12, 4200),
    match: () => [84, 88].forEach((n, i) => tone(N(n), .18, 'sine', .12, i * .07)),
    whoosh: () => noise(.25, .12, 900),
    count: (hi) => tone(hi ? 1046 : 660, hi ? .35 : .14, 'triangle', .14),
    levelup: () => [72, 76, 79, 84, 79, 84, 88, 91].forEach((n, i) => tone(N(n), .26, 'triangle', .12, i * .08)),
    buy: () => { [79, 84, 88].forEach((n, i) => tone(N(n), .16, 'square', .045, i * .06)); },
    snore: () => tone(140, .6, 'sine', .08, 0, 110),
  };
  function play(name, ...a) { if (!sfxOn || !ctx) return; try { fx[name] && fx[name](...a); } catch (e) { } }

  /* 八音盒：C – Am – F – G 的温柔琶音 */
  const CHORDS = [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]];
  const MELODY = [76, 0, 79, 0, 76, 74, 72, 0, 72, 0, 74, 76, 74, 0, 0, 0, 69, 0, 72, 0, 74, 72, 69, 0, 67, 0, 71, 74, 72, 0, 0, 0];
  function schedule() {
    if (!ctx) return;
    const spb = 60 / 84 / 2; // 八分音符
    while (nextT < ctx.currentTime + .3) {
      const bar = Math.floor(step / 8) % 4, s = step % 8, ch = CHORDS[bar];
      const t = nextT - ctx.currentTime;
      const arp = [0, 1, 2, 3, 2, 1, 2, 3][s];
      const g = tone(N(ch[arp] + 12), .9, 'triangle', .05, t, null, musicBus); if (g) g.connect(delay);
      if (s === 0) tone(N(ch[0] - 12), 1.6, 'sine', .07, t, null, musicBus);
      const m = MELODY[step % 32];
      if (m) { const g2 = tone(N(m + 12), .7, 'sine', .045, t, null, musicBus); if (g2) g2.connect(delay); }
      nextT += spb; step++;
    }
  }
  function startMusic() {
    if (!ctx || musicTimer) return;
    nextT = ctx.currentTime + .1;
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.linearRampToValueAtTime(.55, ctx.currentTime + 1.5);
    musicTimer = setInterval(schedule, 100);
  }
  function stopMusic() {
    if (!ctx || !musicTimer) return;
    musicBus.gain.linearRampToValueAtTime(0, ctx.currentTime + .4);
    clearInterval(musicTimer); musicTimer = null;
  }
  return {
    init, play,
    get sfx() { return sfxOn; }, get music() { return musicOn; },
    setSfx(v) { sfxOn = v; },
    setMusic(v) { musicOn = v; if (v) startMusic(); else stopMusic(); },
  };
})();
