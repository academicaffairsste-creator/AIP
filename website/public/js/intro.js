/* Intro "Swarm Rebuild" – bản tự viết cho website AIM (không dùng code của extension swarm-cursors).
   Ý tưởng: trang bắt đầu trống; mascot cầm đũa phép chỉ huy một đàn con trỏ "nhiều người dùng".
   Mỗi con trỏ nhận một việc rồi tự làm, từ trên xuống dưới, trang tự cuộn theo:
     - khối (nút, thẻ, ô, thanh CTA): kéo khung bằng dấu thập, hiện badge "W × H", rồi khối hiện ra
     - ảnh: kéo khung, ảnh quét từ trên xuống
     - chữ: thả con trỏ chữ I, gõ từng ký tự với dấu nháy, có đường gióng đỏ kiểu Figma
   Bỏ qua: bấm / cuộn / phím / nút "Bỏ qua". Tắt: ?nointro hoặc prefers-reduced-motion. */
(function () {
  'use strict';
  var root = document.documentElement;
  if (!root.classList.contains('intro')) return;

  /* ===== 1. Bản thiết kế: các thành phần cần dựng ===== */
  var SEL = [
    '.nav .brand', '#menu a', '.nav .desk', '.burger', '#theme',
    '.herotxt .eb', '.hero h1', '.hero .sub', '.hero .cta > *',
    '.about-img', '.abtxt .eb', '.abtxt h2', '.abtxt .mut', '.stats > div',
    '.svctxt .eb', '.svctxt h2', '.svctxt .btn', '.scard',
    '#roadmap .wrap > .eb', '.rhead h2', '#tabs button', '.rphase', '#rlist .row',
    '.porttxt .eb', '.porttxt h2', '.arrows button', '#projects .proj',
    '.proctxt .eb', '.proctxt h2', '.ptile', '.proc .steps li',
    '.ctabar', '.foot .brand', '.foot nav a', '.soc a', '.fbot > span'
  ];
  var BOX = '.nav .desk,#theme,.burger,.hero .cta > *,.svctxt .btn,.scard,#tabs button,#rlist .row,.arrows button,.proj,.ctabar,.soc a,.nav .brand,.foot .brand';
  var IMG = '.about-img,.ptile';
  var CREW = [['Claude', '#F26A1B'], ['Antigravity', '#3186FF'], ['Skill', '#00A65A'], ['Cowork', '#8B5CF6'], ['Artifact', '#E8457A'], ['Plugin', '#D99A00'], ['Projects', '#0EA5A4']];
  var SPARK = ['#F26A1B', '#FF8A3D', '#FFB070', '#FFD36B', '#FFF1D6'];

  var vw = innerWidth, vh = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2), small = vw < 700;
  var MW = small ? 58 : 78, MH = MW * 538 / 765, TIP = { x: 0.766, y: 0.273 };
  var SPEED = 1; // 1 = nhịp chậm vừa xem

  var tasks = [], seen = new Set();
  SEL.forEach(function (s) {
    document.querySelectorAll(s).forEach(function (el) {
      if (seen.has(el)) return; seen.add(el);
      var r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      el.classList.add('ir');
      tasks.push({ el: el, kind: el.matches(IMG) ? 'img' : el.matches(BOX) ? 'box' : 'text', state: 0 });
    });
  });
  tasks.forEach(function (t) { var r = t.el.getBoundingClientRect(); t.top = r.top + scrollY; t.left = r.left; });
  tasks.sort(function (a, b) { return Math.abs(a.top - b.top) < 12 ? a.left - b.left : a.top - b.top; });
  root.classList.add('intro-ready');

  /* ===== 2. Lớp phủ ===== */
  var cv = document.createElement('canvas'); cv.className = 'intro-canvas';
  cv.width = vw * dpr; cv.height = vh * dpr;
  var ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
  var ms = document.createElement('img'); ms.className = 'intro-mascot'; ms.src = 'img/mascot-broom.png'; ms.alt = ''; ms.style.width = MW + 'px';
  var skip = document.createElement('button'); skip.type = 'button'; skip.className = 'intro-skip'; skip.textContent = 'Bỏ qua ›';
  document.body.append(cv, ms, skip);
  var FONT = '600 11px Quicksand, system-ui, sans-serif';

  /* ===== 3. Con trỏ ===== */
  var N = small ? 4 : CREW.length, cursors = [];
  for (var i = 0; i < N; i++) cursors.push({ name: CREW[i][0], col: CREW[i][1], x: vw / 2, y: -40 + scrollY, vx: 0, vy: 0, mode: 'arrow', task: null, ang: i / N * 6.283, down: false, alpha: 0 });

  /* ===== 4. Mascot ===== */
  var M = { x: vw + MW, y: 80, face: -1, wave: 0 };
  function tip() { var tx = M.face > 0 ? 1 - TIP.x : TIP.x; return { x: M.x - MW / 2 + tx * MW, y: M.y - MH / 2 + TIP.y * MH }; }

  var dust = [], guides = [], boxes = [];
  function sparkle(x, y, n, docY) { for (var k = 0; k < n; k++) { var a = Math.random() * 6.283, s = .6 + Math.random() * 2.4; dust.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, c: SPARK[(Math.random() * 5) | 0], sz: 1.5 + Math.random() * 2, doc: !!docY }); } }
  function beam(from, to) { for (var k = 0; k < 14; k++) { var f = k / 14; dust.push({ x: from.x + (to.x - from.x) * f, y: from.y + (to.y - from.y) * f, vx: (Math.random() - .5), vy: (Math.random() - .5), life: 1 - f * .5, c: SPARK[(k % 4) + 1], sz: 2, doc: false }); } }

  /* ===== 5. Các "kịch bản" làm việc của con trỏ (generator) ===== */
  function* wait(ms) { var end = performance.now() + ms; while (performance.now() < end) yield; }
  function* goTo(c, x, y) { // bay tới toạ độ tài liệu (x, y)
    c.goal = { x: x, y: y };
    var s0 = performance.now();
    while (Math.hypot(c.x - x, c.y - y) > 2.5 && !(performance.now() - s0 > 2500 && Math.hypot(c.x - x, c.y - y) < 40)) yield;
    c.goal = null; c.x = x; c.y = y; c.vx = c.vy = 0;
  }
  function lines(el) { // các dòng chữ của phần tử (gộp các mảnh cùng hàng)
    var box = el.getBoundingClientRect(), rs = [];
    try { var rg = document.createRange(); rg.selectNodeContents(el); rs = [].slice.call(rg.getClientRects()); } catch (e) {}
    rs = rs.filter(function (r) { return r.width > 1 && r.height > 3; });
    if (!rs.length) rs = [box];
    var L = [];
    rs.sort(function (a, b) { return a.top - b.top || a.left - b.left; }).forEach(function (r) {
      var l = L.find(function (q) { return Math.abs(q.cy - (r.top + r.height / 2)) < r.height * 0.45; });
      if (l) { l.l = Math.min(l.l, r.left); l.r = Math.max(l.r, r.right); l.t = Math.min(l.t, r.top); l.b = Math.max(l.b, r.bottom); }
      else L.push({ l: r.left, r: r.right, t: r.top, b: r.bottom, cy: r.top + r.height / 2 });
    });
    return { box: box, L: L.sort(function (a, b) { return a.t - b.t; }) };
  }
  function maskLines(el, box, L, upto) { // hiện phần chữ đã "gõ" bằng mask nhiều lớp
    var img = [], size = [], pos = [];
    L.forEach(function (l, k) {
      var w = k < upto.i ? l.r - l.l : k === upto.i ? upto.w : 0; if (w <= 0) return;
      // ranh giới trên/dưới = giữa hai dòng liền kề, để không lộ trước dòng kế tiếp
      var pad = (l.b - l.t) * 0.18, top = k ? Math.max(l.t - pad, (L[k - 1].b + l.t) / 2, (L[k - 1].cy + l.cy) / 2) : l.t - pad;
      var bot = k < L.length - 1 ? Math.min(l.b + pad, (L[k + 1].cy + l.cy) / 2 + (l.b - l.t) * 0.08) : l.b + pad;
      img.push('linear-gradient(#000,#000)'); size.push((w + 2) + 'px ' + (bot - top) + 'px'); pos.push((l.l - box.left - 1) + 'px ' + (top - box.top) + 'px');
    });
    var s = el.style;
    s.webkitMaskImage = s.maskImage = img.length ? img.join(',') : 'linear-gradient(transparent,transparent)';
    s.webkitMaskSize = s.maskSize = size.join(',') || 'auto'; s.webkitMaskPosition = s.maskPosition = pos.join(',') || '0 0';
    s.webkitMaskRepeat = s.maskRepeat = 'no-repeat';
  }
  function clearMask(el) { var s = el.style; s.webkitMaskImage = s.maskImage = s.webkitMaskSize = s.maskSize = s.webkitMaskPosition = s.maskPosition = s.webkitMaskRepeat = s.maskRepeat = ''; }
  function show(t) { t.el.classList.add('ir-show'); t.el.classList.remove('ir-work'); }

  function* typeText(c, t) {
    var g = lines(t.el), sy = scrollY, box = g.box, L = g.L;
    var text = (t.el.textContent || '').replace(/\s+/g, ' ').trim(), n = Math.max(4, text.length);
    var total = L.reduce(function (a, l) { return a + l.r - l.l; }, 0), cw = total / n;
    var lh = L[0].b - L[0].t, ms = Math.max(22, Math.min(70, 1400 / n + 18)) / SPEED;
    // đường gióng đỏ ở mép trái
    guides.push({ x: L[0].l, y0: L[0].t + sy - 30, y1: L[L.length - 1].b + sy + 30, born: performance.now(), col: c.col });
    yield* goTo(c, L[0].l - 3, L[0].t + sy + lh / 2);
    c.mode = 'beam'; yield* wait(160 / SPEED);
    t.el.classList.add('ir-work'); maskLines(t.el, box, L, { i: 0, w: 0 });
    for (var i = 0; i < L.length; i++) {
      var l = L[i], w = 0, W = l.r - l.l;
      while (w < W) {
        w = Math.min(W, w + cw * (1 + (Math.random() < .15 ? 1 : 0)));
        maskLines(t.el, box, L, { i: i, w: w });
        c.x = l.l + w + 2; c.y = l.t + sy + (l.b - l.t) / 2; c.caret = { x: c.x, y: l.t + sy, h: l.b - l.t };
        yield* wait(ms * (Math.random() < .08 ? 3 : 1));
      }
    }
    c.caret = null; clearMask(t.el); show(t); c.mode = 'arrow';
    yield* wait(120 / SPEED);
  }

  function* drawBox(c, t, sweep) {
    var r = t.el.getBoundingClientRect(), sy = scrollY, x0 = r.left, y0 = r.top + sy, W = r.width, H = r.height;
    yield* goTo(c, x0, y0);
    c.mode = 'cross'; c.down = true; yield* wait(120 / SPEED);
    var b = { x: x0, y: y0, w: 0, h: 0, col: c.col, a: 1, done: false }; boxes.push(b);
    var dur = Math.max(450, Math.min(1300, 350 + Math.hypot(W, H) * 1.2)) / SPEED, s0 = performance.now();
    for (;;) {
      var k = Math.min(1, (performance.now() - s0) / dur), e = 1 - Math.pow(1 - k, 3);
      b.w = W * e; b.h = H * e; c.x = x0 + b.w; c.y = y0 + b.h;
      if (k >= 1) break; yield;
    }
    c.down = false; c.mode = 'arrow';
    if (sweep) { // ảnh quét từ trên xuống
      t.el.classList.add('ir-work'); var s1 = performance.now(), d2 = 700 / SPEED;
      for (;;) {
        var p = Math.min(1, (performance.now() - s1) / d2) * 100;
        t.el.style.webkitMaskImage = t.el.style.maskImage = 'linear-gradient(#000 ' + p + '%, transparent ' + (p + 0.1) + '%)';
        if (p >= 100) break; yield;
      }
      clearMask(t.el);
    }
    show(t); b.done = true;
    yield* wait(200 / SPEED);
  }

  function* job(c, t) { if (t.kind === 'text') yield* typeText(c, t); else yield* drawBox(c, t, t.kind === 'img'); t.state = 2; c.task = null; }

  /* ===== 6. Vòng lặp ===== */
  var t0 = 0, phase = 'intro', done = false, raf = 0, endAt = 0;
  var mouse = null; addEventListener('mousemove', function (e) { mouse = { x: e.clientX, y: e.clientY }; });

  function frame(now) {
    if (done) return;
    if (!t0) { t0 = now; window.scrollTo({ top: 0, behavior: 'instant' }); }
    var T = now - t0, sy = scrollY;

    /* --- giai đoạn --- */
    if (phase === 'intro') { // mascot bay vào, các con trỏ bay ra từ đầu đũa và xoay quanh
      var k = Math.min(1, T / 1500), e = 1 - Math.pow(1 - k, 3);
      M.x = vw + MW + (vw * 0.62 - vw - MW) * e; M.y = -MH + (vh * 0.32 + MH) * e; M.face = -1;
      if (T > 1500 && T < 2900) cursors.forEach(function (c, i) { c.alpha = Math.min(1, (T - 1500 - i * 90) / 300); });
      if (T > 2900) phase = 'build';
    } else if (phase === 'build') {
      // giao việc: việc tiếp theo trong màn hình → con trỏ rảnh
      var next = tasks.find(function (t) { return t.state === 0; });
      if (next && (next.top < sy + vh * 0.88 || sy >= root.scrollHeight - vh - 2)) {
        var free = cursors.find(function (c) { return !c.task; });
        if (free) {
          next.state = 1; free.task = next; free.run = job(free, next);
          M.wave = now + 450; var tp = tip(); beam(tp, { x: free.x, y: free.y - sy }); sparkle(tp.x, tp.y, 8);
        }
      }
      if (!tasks.some(function (t) { return t.state < 2; })) { phase = 'outro'; endAt = now; }
      // cuộn theo việc còn dang dở sớm nhất
      var pend = tasks.find(function (t) { return t.state < 2; });
      if (pend) {
        var want = Math.max(0, Math.min(root.scrollHeight - vh, pend.top - vh * 0.3));
        if (want > sy + 1) window.scrollTo({ top: sy + (want - sy) * 0.035 + 0.6, behavior: 'instant' });
      }
      // mascot bay theo nhóm đang làm việc
      var busy = cursors.filter(function (c) { return c.task; }), ax = vw * 0.7, ay = vh * 0.3;
      if (busy.length) { ax = 0; ay = 0; busy.forEach(function (c) { ax += c.x; ay += c.y - scrollY; }); ax = ax / busy.length + 120; ay = ay / busy.length - 90; }
      ax = Math.max(MW, Math.min(vw - MW, ax)); ay = Math.max(MH, Math.min(vh - MH * 1.5, ay));
      var nx = M.x + (ax - M.x) * 0.03; if (Math.abs(nx - M.x) > .4) M.face = nx > M.x ? 1 : -1; M.x = nx; M.y += (ay - M.y) * 0.03;
    } else if (phase === 'outro') { // tụ về mascot rồi cùng bay đi
      var q = (now - endAt) / 1800;
      cursors.forEach(function (c) { c.alpha = Math.max(0, 1 - Math.max(0, q - 0.3) * 4); });
      if (q >= 0.6) return finish(true); // mascot bay về đứng cạnh chữ "AI Mastery"
    }

    /* --- chạy kịch bản của từng con trỏ --- */
    cursors.forEach(function (c, i) {
      if (c.run) { var r = c.run.next(); if (r.done) c.run = null; }
      var goal = c.goal;
      if (!goal && (!c.task || phase !== 'build')) { // rảnh: bay vòng quanh mascot (hoặc theo chuột ở cuối)
        c.ang += 0.02; var rad = phase === 'outro' ? 34 : 70 + (i % 3) * 18;
        goal = { x: M.x + Math.cos(c.ang + i) * rad, y: M.y + scrollY + Math.sin(c.ang + i) * rad * 0.6 };
      }
      if (goal) { // lò xo + chút nhiễu cho cảm giác bầy đàn
        c.vx += (goal.x - c.x) * 0.012 + Math.sin(now / 300 + i) * 0.05; c.vy += (goal.y - c.y) * 0.012 + Math.cos(now / 340 + i) * 0.05;
        if (!c.task) cursors.forEach(function (o) { if (o === c || o.task) return; var dx = c.x - o.x, dy = c.y - o.y, d = dx * dx + dy * dy; if (d < 900 && d > 0.1) { c.vx += dx / d * 3; c.vy += dy / d * 3; } });
        c.vx *= 0.86; c.vy *= 0.86; var sp = Math.hypot(c.vx, c.vy), mx = 22 * SPEED; if (sp > mx) { c.vx *= mx / sp; c.vy *= mx / sp; }
        c.x += c.vx; c.y += c.vy;
      }
    });

    /* --- vẽ --- */
    sy = scrollY; ctx.clearRect(0, 0, vw, vh);
    // đường gióng
    guides = guides.filter(function (g) {
      var a = 1 - (now - g.born) / 1400; if (a <= 0) return false;
      var grow = Math.min(1, (now - g.born) / 300);
      ctx.globalAlpha = a * 0.9; ctx.strokeStyle = '#F2453D'; ctx.lineWidth = 1; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(g.x + .5, g.y0 - sy); ctx.lineTo(g.x + .5, g.y0 - sy + (g.y1 - g.y0) * grow); ctx.stroke();
      ctx.font = FONT; ctx.fillStyle = '#F2453D'; ctx.fillText(Math.round(g.x), g.x + 4, g.y0 - sy + 10);
      return true;
    });
    // khung đang kéo
    boxes = boxes.filter(function (b) {
      if (b.done) b.a -= 0.05; if (b.a <= 0) return false;
      var y = b.y - sy; ctx.globalAlpha = b.a;
      ctx.fillStyle = 'rgba(128,120,112,.12)'; ctx.fillRect(b.x, y, b.w, b.h);
      ctx.strokeStyle = b.col; ctx.lineWidth = 1.5; ctx.strokeRect(b.x + .5, y + .5, b.w, b.h);
      ctx.fillStyle = '#fff'; [[b.x, y], [b.x + b.w, y], [b.x, y + b.h], [b.x + b.w, y + b.h]].forEach(function (p) { ctx.fillRect(p[0] - 3, p[1] - 3, 6, 6); ctx.strokeRect(p[0] - 3, p[1] - 3, 6, 6); });
      if (!b.done) { // badge W × H
        var label = Math.round(b.w) + ' × ' + Math.round(b.h); ctx.font = FONT; var tw = ctx.measureText(label).width;
        var bx = b.x + b.w / 2 - tw / 2 - 6, by = y + b.h + 8; ctx.fillStyle = b.col; rr(bx, by, tw + 12, 18, 5); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillText(label, bx + 6, by + 13);
      }
      return true;
    });
    ctx.globalAlpha = 1;
    // bụi phép thuật
    for (var d = dust.length - 1; d >= 0; d--) {
      var p = dust[d]; p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life -= 0.022;
      if (p.life <= 0) { dust.splice(d, 1); continue; }
      ctx.globalAlpha = p.life; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.sz, p.sz);
    }
    ctx.globalAlpha = 1;
    // con trỏ
    cursors.forEach(function (c) {
      if (c.alpha <= 0) return; ctx.globalAlpha = c.alpha;
      var x = c.x, y = c.y - sy;
      if (c.caret && (now / 400 | 0) % 2) { ctx.fillStyle = c.col; ctx.fillRect(c.caret.x, c.caret.y - sy, 2, c.caret.h); }
      drawCursor(c, x, y);
    });
    ctx.globalAlpha = 1;
    // mascot (đũa vẫy khi giao việc)
    var wv = now < M.wave ? Math.sin(now / 45) * 12 : Math.sin(now / 500) * 3;
    ms.style.transform = 'translate(' + (M.x - MW / 2) + 'px,' + (M.y - MH / 2 + Math.sin(now / 260) * 3) + 'px) scaleX(' + (-M.face) + ') rotate(' + wv + 'deg)';
    if (Math.random() < 0.35) { var tp2 = tip(); dust.push({ x: tp2.x, y: tp2.y, vx: (Math.random() - .5), vy: -Math.random(), life: .8, c: SPARK[3], sz: 1.5, doc: false }); }

    raf = requestAnimationFrame(frame);
  }

  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function drawCursor(c, x, y) {
    ctx.save(); ctx.translate(x, y);
    ctx.lineWidth = 1.5; ctx.strokeStyle = '#fff'; ctx.fillStyle = c.col;
    if (c.mode === 'cross') {
      ctx.strokeStyle = c.col; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-3, 0); ctx.moveTo(3, 0); ctx.lineTo(9, 0); ctx.moveTo(0, -9); ctx.lineTo(0, -3); ctx.moveTo(0, 3); ctx.lineTo(0, 9); ctx.stroke();
    } else if (c.mode === 'beam') {
      ctx.strokeStyle = c.col; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-3, -9); ctx.lineTo(3, -9); ctx.moveTo(0, -9); ctx.lineTo(0, 9); ctx.moveTo(-3, 9); ctx.lineTo(3, 9); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 17); ctx.lineTo(4.6, 12.6); ctx.lineTo(7.8, 19.4); ctx.lineTo(10.4, 18.3); ctx.lineTo(7.3, 11.6); ctx.lineTo(13, 11.6); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.font = FONT; var tw = ctx.measureText(c.name).width;
    ctx.fillStyle = c.col; rr(12, 18, tw + 12, 18, 9); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText(c.name, 18, 31);
    ctx.restore();
  }

  /* ===== 7. Kết thúc / bỏ qua ===== */
  function finish(natural) {
    if (done) return; done = true; cancelAnimationFrame(raf);
    tasks.forEach(function (t) { clearMask(t.el); t.el.classList.add('ir-show'); t.el.classList.remove('ir-work'); });
    [cv, skip].forEach(function (n) { n.remove(); });
    removeEventListener('wheel', block, { passive: false }); removeEventListener('touchmove', block, { passive: false }); removeEventListener('keydown', onKey);
    if (natural === true) window.scrollTo({ top: 0, behavior: 'smooth' });
    // mascot bay về "đậu" cạnh logo (thanh menu dính trên cùng nên vị trí này cố định trên màn hình)
    var p = document.querySelector('.nav .perch'), r = p && p.getBoundingClientRect(), FLY_MS = 1100;
    if (r && r.width) {
      var tx = r.left + r.width / 2 - MW / 2, ty = r.top + r.height / 2 - MH / 2, sc = r.width / (MW * 0.62);
      var face = tx > M.x - MW / 2 ? -1 : 1;
      ms.style.transition = 'transform ' + FLY_MS + 'ms cubic-bezier(.45,0,.25,1), opacity .25s ' + (FLY_MS - 150) + 'ms';
      ms.getBoundingClientRect();
      ms.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scaleX(' + face + ') scale(' + sc + ')';
      ms.style.opacity = '0';
    } else { ms.style.opacity = '0'; FLY_MS = 300; }
    setTimeout(function () {
      ms.remove();
      root.classList.remove('intro', 'intro-ready');
      tasks.forEach(function (t) { t.el.classList.remove('ir', 'ir-show'); });
      if (p) p.classList.add('landed');
    }, FLY_MS);
  }
  function stop() { finish(false); }
  /* Trong lúc dựng: khoá cuộn tay (trang tự cuộn theo mascot) thay vì tắt hiệu ứng.
     Bỏ qua chỉ bằng nút "Bỏ qua" hoặc phím Esc. */
  var SCROLL_KEYS = { ' ': 1, ArrowUp: 1, ArrowDown: 1, PageUp: 1, PageDown: 1, Home: 1, End: 1 };
  function block(e) { e.preventDefault(); }
  function onKey(e) { if (e.key === 'Escape') stop(); else if (SCROLL_KEYS[e.key]) e.preventDefault(); }
  skip.addEventListener('click', stop);
  addEventListener('wheel', block, { passive: false });
  addEventListener('touchmove', block, { passive: false });
  addEventListener('keydown', onKey);
  setTimeout(stop, 120000); // an toàn: không bao giờ kẹt trang ẩn

  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  window.scrollTo({ top: 0, behavior: 'instant' });
  Promise.all([document.fonts ? document.fonts.ready : 0, ms.decode ? ms.decode().catch(function () {}) : 0])
    .then(function () {
      tasks.forEach(function (t) { var r = t.el.getBoundingClientRect(); t.top = r.top + scrollY; });
      cursors.forEach(function (c) { var tp = tip(); c.x = vw * 0.62; c.y = vh * 0.32 + scrollY; c.ang = Math.random() * 6; });
      raf = requestAnimationFrame(frame);
    });
})();
