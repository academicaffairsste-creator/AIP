(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };

  /* ---- vị trí hình: bỏ file img/<slot>.(webp|png|jpg|jpeg|svg) là tự hiện ---- */
  var EXT = ['webp', 'png', 'jpg', 'jpeg', 'svg'];
  document.querySelectorAll('.slot[data-slot]').forEach(function (el) {
    var name = el.dataset.slot;
    (function tryNext(i) {
      if (i >= EXT.length) return;
      var url = 'img/' + name + '.' + EXT[i], im = new Image();
      im.onload = function () { el.classList.add('filled'); el.style.backgroundImage = 'url("' + url + '")'; };
      im.onerror = function () { tryNext(i + 1); };
      im.src = url;
    })(0);
  });

  /* ---- chế độ sáng / tối ---- */
  var tb = $('#theme'), root = document.documentElement;
  function setTheme(t, save) {
    root.dataset.theme = t; tb.setAttribute('aria-checked', t === 'dark');
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
  }
  setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
  tb.addEventListener('click', function () { setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true); });

  /* ---- menu mobile ---- */
  var burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', function () { burger.setAttribute('aria-expanded', menu.classList.toggle('open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) menu.classList.remove('open'); });

  /* ---- active nav theo section ---- */
  var links = {}; document.querySelectorAll('#menu a:not(.btn)').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting && links[en.target.id]) { Object.keys(links).forEach(function (k) { links[k].classList.toggle('on', k === en.target.id); }); } });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });

  /* ---- reveal + đếm số ---- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return; var el = en.target; io.unobserve(el);
      if (el.dataset.n) {
        var to = +el.dataset.n, s = el.dataset.s || '', t0 = performance.now();
        (function f(t) { var p = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * p) + s; if (p < 1) requestAnimationFrame(f); })(t0);
      } else el.classList.add('in');
    });
  }, { threshold: .15 });
  document.querySelectorAll('[data-n]').forEach(function (e) { io.observe(e); });
  document.querySelectorAll('.herotxt,.hero-img,.about>*,.svctxt,.scard,.porttxt,.proc>*,.ctabar').forEach(function (e) { e.setAttribute('data-r', ''); io.observe(e); });

  /* ---- carousel dự án ---- */
  var list = $('#projects');
  /* ---- lộ trình 8 buổi (nguồn: Session_AIP_module.xlsx, sheet AIP) ---- */
  var S = [
    { n: 1, ph: 'I', mod: 'AI Foundations', tools: 'Claude + Antigravity', c: 'AI Fundamentals · AI & LLM',
      sum: 'Tìm hiểu cấu trúc, hệ sinh thái AI và cách các mô hình ngôn ngữ lớn (LLM) hoạt động ở mức khái niệm.',
      topicsT: 'Nội dung chính',
      topics: ['Phân biệt Trí tuệ nhân tạo (AI), Học máy (Machine Learning) và Học sâu (Deep Learning)', 'AI tạo sinh (Generative AI) và các Mô hình ngôn ngữ lớn (LLM)', 'Khái niệm nền tảng: Tokens, Vectors và Embeddings', '“Context window”, các hiểu biết quan trọng và nguyên nhân gây ra “Hallucination”'],
      out: ['Hiểu cấu trúc và hệ sinh thái AI', 'Hiểu cách thức hoạt động của LLM ở mức độ khái niệm'] },
    { n: 2, ph: 'I', mod: 'AI Foundations', tools: 'Claude + Antigravity', c: 'AI Fundamentals · Prompt & AI Agents',
      sum: 'Viết prompt đúng kỹ thuật và nhận diện các nhóm ứng dụng AI trong doanh nghiệp, từ Chatbot đến AI Agents.',
      topicsT: 'Nội dung chính',
      topics: ['Prompt Engineering Frameworks và mô hình Context-Task-Constraint (CTC) để đảm bảo chất lượng đầu ra', 'Phân loại AI trong kinh doanh: Dự báo (Predictive), Tạo sinh (Generative), Phân tích (Analytical), Tự động hóa (Automation)', 'Đánh giá AI Agents: sự chuyển dịch từ “Chatbot” sang “Agents” tự chủ thực thi nhiệm vụ và sử dụng công cụ'],
      out: ['Nắm được các nhóm ứng dụng AI trong doanh nghiệp', 'Phân tích được khả năng và những giới hạn của AI'] },
    { n: 3, ph: 'II', mod: 'Projects Workspace', tools: 'Claude', c: 'Claude Projects + Skill',
      sum: 'Dùng Claude Projects để số hoá một quy trình thực tế của doanh nghiệp, từ khi phát sinh nhu cầu đến khi đánh giá hiệu quả.',
      flowT: 'Case study · Quy trình đào tạo của đội ngũ L&D',
      flow: ['Nhu cầu đào tạo', 'Đánh giá', 'Tìm vendor', 'Làm proposal', 'Báo giá', 'Soạn hợp đồng', 'Survey đánh giá chương trình', 'Đánh giá kết quả sau 3 tháng (theo doanh thu)'],
      out: ['Biết cách dùng Claude Project để chuyển công việc thủ công sang tự động'] },
    { n: 4, ph: 'II', mod: 'Skill Packaging', tools: 'Claude', c: 'Claude Projects + Skill',
      sum: 'Đóng gói quy trình đã làm cùng Claude trong Project thành một SKILL để dùng lại nhiều lần mà không cần khai báo lại.',
      flow: ['Quy trình trong Claude Project', 'Đóng gói thành SKILL', 'Tái sử dụng, không cần khai báo lại'],
      out: ['Hiểu cách tạo SKILL', 'Ứng dụng SKILL vào quy trình làm việc'] },
    { n: 5, ph: 'II', mod: 'Plugin & Cowork Automation', tools: 'Claude', c: 'Plugins + Cowork + Artifact',
      sum: 'Thực hiện một dự án tạo nhiều SKILL, gộp nhiều quy trình thành một quy trình tự động khi kết nối thêm Connectors.',
      flow: ['Tạo nhiều SKILL', 'Đóng gói thành Plugin', 'Kết nối Connectors', 'Lên lịch chạy tự động'],
      out: ['Hiểu và tạo được Plugin', 'Kết nối tới các Connectors', 'Lên lịch tự động cho các tác vụ thường xuyên tại doanh nghiệp'] },
    { n: 6, ph: 'II', mod: 'Artifact Tools', tools: 'Claude', c: 'Plugins + Cowork + Artifact',
      sum: 'Dùng Artifact trong Claude để tạo công cụ cho một tác vụ thường dùng, có thể tái sử dụng và chia sẻ trong tổ chức / phòng ban.',
      flow: ['Chọn tác vụ thường dùng', 'Tạo công cụ bằng Artifact', 'Tái sử dụng', 'Chia sẻ trong tổ chức'],
      out: ['Tạo được Artifact theo mong muốn: Slide, Công cụ, Báo cáo…'] },
    { n: 7, ph: 'II', mod: 'Web App Build & Deploy', tools: 'Claude + Antigravity', c: 'Web App 1',
      sum: 'Xây dựng Web app gom nhiều tác vụ về một nơi, thay vì làm riêng lẻ qua SKILL, Project hoặc Artifact.',
      flow: ['Tác vụ rời rạc (SKILL · Project · Artifact)', 'Gom vào một Web app', 'Chạy trên Localhost'],
      demo: { t: 'Demo · Web app quản trị xuất nhập tồn (chuỗi cung ứng FMCG)', items: ['Phân loại hàng slow moving / fast moving', 'Tính tuổi tồn kho', 'Tồn kho an toàn', 'Vòng quay hàng tồn kho', 'Cảnh báo & khuyến nghị cho từng sản phẩm, nhóm sản phẩm'] },
      out: ['Chạy được một Web app trên Localhost của học viên'] },
    { n: 8, ph: 'II', mod: 'Web App Build & Deploy', tools: 'Claude + Antigravity', c: 'Web App 1',
      sum: 'Đưa Web app ra thực tế: lưu dữ liệu, publish để nhiều người cùng dùng và quản lý quyền truy cập.',
      flow: ['Lưu dữ liệu từ thao tác trên Frontend', 'Kết nối GitHub', 'Publish qua Vercel', 'Tạo tài khoản & phân quyền'],
      out: ['Publish được Web app cho mọi người cùng sử dụng'] }
  ];
  var PH = { I: 'Phase I · Nền tảng', II: 'Phase II · Ứng dụng AI vào công việc' };
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  /* nội dung bên trong thẻ buổi học: tổng quan → quy trình → demo / đầu ra */
  function li(a, cls) { return '<ul class="' + cls + '">' + a.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>'; }
  function detail(x) {
    if (!x.sum) return '<p class="mut">Nội dung chi tiết sẽ được cập nhật.</p>';
    return '<div class="rb"><p class="lead">' + esc(x.sum) + '</p>' +
      (x.topics ? '<div class="blk"><h4>' + esc(x.topicsT || 'Nội dung chính') + '</h4><ol class="topics" style="--c:' + (x.topics.length % 3 ? 2 : 3) + '">' +
        x.topics.map(function (s, i) { return '<li><b>' + (i < 9 ? '0' : '') + (i + 1) + '</b><span>' + esc(s) + '</span></li>'; }).join('') + '</ol></div>' : '') +
      (x.flow ? '<div class="blk"><h4>' + esc(x.flowT || 'Quy trình thực hành') + '</h4><ol class="flow">' +
        x.flow.map(function (s, i) { return '<li><b>' + (i < 9 ? '0' : '') + (i + 1) + '</b>' + esc(s) + '</li>'; }).join('') + '</ol></div>' : '') +
      '<div class="cols">' +
      (x.demo ? '<div class="blk box"><h4>' + esc(x.demo.t) + '</h4>' + li(x.demo.items, 'dots') + '</div>' : '') +
      '<div class="blk box out"><h4>Đầu ra sau buổi học</h4>' + li(x.out, 'checks') + '</div>' +
      '</div></div>';
  }
  function drawRoadmap(f) {
    var h = '', last = '';
    S.forEach(function (x) {
      if (f !== 'all' && x.ph !== f) return;
      if (x.ph !== last) { h += '<div class="rphase">' + PH[x.ph] + '</div>'; last = x.ph; }
      h += '<details class="row" id="s' + x.n + '"><summary><span class="n">' + x.n + '</span><div><h3>' + esc(x.mod) + '</h3><div class="t">' + esc(x.c) + '</div></div>' +
        '<div class="meta"><span class="h">2h</span><span class="tl">' + esc(x.tools).replace('Claude', '<span class="cl"><svg aria-hidden="true"><use href="#claude"/></svg>Claude</span>').replace('Antigravity', '<span class="cl"><img src="img/antigravity.svg" alt="" width="16" height="15">Antigravity</span>') + '</span></div></summary><div class="rbody">' +
        detail(x) +
        '</div></details>';
    });
    $('#rlist').innerHTML = h;
  }
  drawRoadmap('all');
  $('#tabs').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    document.querySelectorAll('#tabs button').forEach(function (x) { x.classList.toggle('on', x === b); });
    drawRoadmap(b.dataset.f);
  });
  /* bấm thẻ dự án → mở đúng buổi trong lộ trình */
  list.addEventListener('click', function (e) {
    var a = e.target.closest('.proj'); if (!a) return; e.preventDefault();
    document.querySelectorAll('#tabs button').forEach(function (x) { x.classList.toggle('on', x.dataset.f === 'all'); });
    drawRoadmap('all');
    var row = $('#s' + a.dataset.s); if (!row) return;
    row.open = true; row.classList.add('hl'); row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () { row.classList.remove('hl'); }, 2200);
  });
  function rot(dir) {
    if (dir > 0) list.appendChild(list.firstElementChild); else list.insertBefore(list.lastElementChild, list.firstElementChild);
  }
  $('#pNext').onclick = function () { rot(1); };
  $('#pPrev').onclick = function () { rot(-1); };

})();
