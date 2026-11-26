(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };

  /* ---- vị trí hình: bỏ file img/<slot>.(webp|png|jpg|jpeg|svg) là tự hiện ---- */
  var EXT = ['webp', 'png', 'jpg', 'jpeg', 'svg'];
  // V đổi mỗi khi thêm ảnh mới: tránh việc trình duyệt nhớ kết quả "chưa có ảnh" (404) từ lần mở trước
  var V = '?v=20261126e';
  document.querySelectorAll('.slot[data-slot]').forEach(function (el) {
    var name = el.dataset.slot;
    (function tryNext(i) {
      if (i >= EXT.length) return;
      var url = 'img/' + name + '.' + EXT[i] + V, im = new Image();
      im.onload = function () {
        el.classList.add('filled');
        // logo giảng viên: bản trắng dùng làm "mặt nạ" (chế độ tối = trắng);
        // nếu có thêm img/<tên>-color.png thì chế độ sáng hiện logo màu chuẩn của đơn vị
        if (el.classList.contains('logo')) {
          var abs = function (u) { return 'url("' + new URL(u, location.href).href + '")'; }; // tuyệt đối vì biến CSS dùng trong css/styles.css
          el.style.setProperty('--img', abs(url));
          var c = new Image(), cu = 'img/' + name + '-color.png' + V;
          c.onload = function () { el.style.setProperty('--img-color', abs(cu)); el.classList.add('has-color'); };
          c.src = cu;
        } else el.style.backgroundImage = 'url("' + url + '")';
      };
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
  var themeHook = null; // mascot "nhận" việc đổi theme để diễn hoạt cảnh
  tb.addEventListener('click', function () {
    var to = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (themeHook) themeHook(to); else setTheme(to, true);
  });

  /* ---- mascot cạnh logo ----
     - Sau ~2,5 phút: lấy tai nghe ra nghe nhạc, nhún nhảy chill (thử nhanh: ?chill=5).
     - Bật chế độ tối: mascot vung đũa hô biến → trời tối → ngáp rồi đội mũ đi ngủ (zzz).
     - Bật lại chế độ sáng: mascot thức dậy vẫy chào.
     - Bấm mascot: đang nghe nhạc thì tháo tai nghe; đang ngủ thì trở mình; bình thường thì nghe nhạc ngay. */
  (function () {
    var p = document.querySelector('.nav .perch'); if (!p) return;
    var m = /[?&]chill=(\d+)/.exec(location.search), WAIT = (m ? +m[1] : 150) * 1000, t = 0, busy = 0;
    var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function dark() { return root.dataset.theme === 'dark'; }
    function arm() { clearTimeout(t); if (!dark()) t = setTimeout(chill, WAIT); }
    function chill() {
      if (dark()) return;
      p.classList.add('hp-up');                       // tai nghe bật ra, bay lên đầu
      setTimeout(function () { p.classList.remove('hp-up'); if (!dark()) p.classList.add('chill'); }, 1100);
    }
    function later(fn, ms) { busy = setTimeout(fn, ms); }
    var say = p.querySelector('.say');
    function talk(txt) { if (txt) { say.textContent = txt; p.classList.add('talk'); } else p.classList.remove('talk'); }
    var ALL = ['chill', 'hp-up', 'cast', 'look', 'yawn', 'wake', 'stir', 'talk'];
    themeHook = function (to) {
      clearTimeout(t); clearTimeout(busy);
      ALL.forEach(function (c) { p.classList.remove(c); });
      if (to === 'dark') {
        if (calm || root.classList.contains('intro')) { setTheme('dark', true); p.classList.add('sleep'); return; }
        if (p.classList.contains('sleep')) { setTheme('dark', true); return; }
        p.classList.add('cast');                                            // 1. móc đũa ra hô biến
        later(function () {
          setTheme('dark', true); p.classList.remove('cast');               // 2. trời tối
          later(function () {
            p.classList.add('look'); talk('Ủa, trời tối rồi hả?');          // 3. ~5 giây sau: ngó nghiêng
            later(function () {
              p.classList.remove('look'); p.classList.add('yawn'); talk('Thôi, tui đi ngủ nha 😴'); // 4. ngáp
              later(function () { p.classList.remove('yawn'); talk(''); p.classList.add('sleep'); }, 1800); // 5. ngủ
            }, 2400);
          }, 2600);
        }, 800);
      } else {
        setTheme('light', true);
        if (calm || !p.classList.contains('sleep')) { p.classList.remove('sleep'); arm(); return; }
        later(function () {                                                 // 1. vẫn ngủ thêm vài giây
          p.classList.remove('sleep'); p.classList.add('wake'); talk('Ủa, sáng rồi hả? ☀️'); // 2. mở mắt, ngạc nhiên
          later(function () {
            p.classList.remove('wake'); talk('');
            chill();                                                        // 3. dậy và bắt đầu nghe nhạc
          }, 2200);
        }, 3000);
      }
    };
    p.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      if (p.classList.contains('sleep')) { p.classList.remove('stir'); void p.offsetWidth; p.classList.add('stir'); return; }
      if (p.classList.contains('chill') || p.classList.contains('hp-up')) { p.classList.remove('chill', 'hp-up'); arm(); }
      else { clearTimeout(t); chill(); }
    });
    if (dark()) p.classList.add('sleep');
    (function ready() { if (root.classList.contains('intro')) return setTimeout(ready, 1000); arm(); })();
  })();

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
    { n: 1, ph: 'I', mod: 'AI Foundations', tools: 'Claude', c: 'AI Fundamentals · AI & LLM',
      sum: 'Tìm hiểu cấu trúc, hệ sinh thái AI và cách các mô hình ngôn ngữ lớn (LLM) hoạt động ở mức khái niệm.',
      topicsT: 'Nội dung chính',
      topics: ['Phân biệt Trí tuệ nhân tạo (AI), Học máy (Machine Learning) và Học sâu (Deep Learning)', 'AI tạo sinh (Generative AI) và các Mô hình ngôn ngữ lớn (LLM)', 'Khái niệm nền tảng: Tokens, Vectors và Embeddings', '“Context window”, các hiểu biết quan trọng và nguyên nhân gây ra “Hallucination”'],
      out: ['Hiểu cấu trúc và hệ sinh thái AI', 'Hiểu cách thức hoạt động của LLM ở mức độ khái niệm'] },
    { n: 2, ph: 'I', mod: 'AI Foundations', tools: 'Claude', c: 'AI Fundamentals · Prompt & AI Agents',
      sum: 'Viết prompt đúng kỹ thuật và nhận diện các nhóm ứng dụng AI trong doanh nghiệp, từ Chatbot đến AI Agents.',
      topicsT: 'Nội dung chính',
      topics: ['Prompt Engineering Frameworks và mô hình Context-Task-Constraint (CTC) để đảm bảo chất lượng đầu ra', 'Phân loại AI trong kinh doanh: Dự báo (Predictive), Tạo sinh (Generative), Phân tích (Analytical), Tự động hóa (Automation)', 'Đánh giá AI Agents: sự chuyển dịch từ “Chatbot” sang “Agents” tự chủ thực thi nhiệm vụ và sử dụng công cụ'],
      out: ['Nắm được các nhóm ứng dụng AI trong doanh nghiệp', 'Phân tích được khả năng và những giới hạn của AI'] },
    { n: 3, ph: 'II', mod: 'Projects Workspace', tools: 'Claude', c: 'Claude Projects + Skill',
      sum: 'Lấy một quy trình thật của phòng L&D làm case study: tiếp nhận nhu cầu đào tạo, đánh giá, tìm vendor, làm proposal, báo giá, soạn hợp đồng, khảo sát sau chương trình và đánh giá hiệu quả sau 3 tháng dựa trên doanh thu. Học viên dựng một Claude Project chứa hướng dẫn, tài liệu tham chiếu và mẫu biểu để Claude xử lý từng bước thay cho thao tác thủ công.',
      flowT: 'Case study · Quy trình đào tạo của đội ngũ L&D',
      flow: ['Nhu cầu đào tạo', 'Đánh giá', 'Tìm vendor', 'Làm proposal', 'Báo giá', 'Soạn hợp đồng', 'Survey đánh giá chương trình', 'Đánh giá kết quả sau 3 tháng (theo doanh thu)'],
      out: ['Thiết lập một Claude Project hoàn chỉnh cho một quy trình: hướng dẫn, tài liệu tham chiếu và mẫu biểu', 'Dùng Claude soạn nhanh các tài liệu L&D: đánh giá nhu cầu, proposal, báo giá, hợp đồng, phiếu khảo sát', 'Xây dựng bảng đánh giá kết quả đào tạo sau chương trình (post analysis) gắn với số liệu kinh doanh', 'Biết cách chuyển một quy trình thủ công nhiều bước sang làm việc cùng AI'] },
    { n: 4, ph: 'II', mod: 'Skill Packaging', tools: 'Claude', c: 'Claude Projects + Skill',
      sum: 'Biến quy trình đã làm trong Claude Project thành một SKILL: gói hướng dẫn, mẫu biểu và các bước xử lý thành một gói dùng lại được. Từ đó mỗi lần làm việc chỉ cần gọi SKILL thay vì khai báo lại từ đầu, và cả nhóm có thể dùng chung một chuẩn làm việc.',
      flow: ['Quy trình trong Claude Project', 'Đóng gói thành SKILL', 'Tái sử dụng, không cần khai báo lại'],
      out: ['Hiểu SKILL là gì và khác Claude Project ở điểm nào', 'Tự đóng gói một quy trình thành SKILL: mô tả, hướng dẫn, tài liệu và mẫu đi kèm', 'Gọi và tái sử dụng SKILL trong công việc hằng ngày mà không cần khai báo lại', 'Chuẩn hóa cách làm việc giữa các thành viên bằng SKILL dùng chung'] },
    { n: 5, ph: 'II', mod: 'Plugin & Cowork Automation', tools: 'Claude', c: 'Plugins + Cowork + Artifact',
      sum: 'Dự án phân tích bán hàng theo nhiều chiều: thời gian (LY, LM, LQ, LD), khu vực địa lý, danh mục sản phẩm, phân khúc khách hàng, đội ngũ bán hàng và hệ thống phân phối. Học viên gom nhiều SKILL thành một Plugin, kết nối dữ liệu qua Connectors theo vai trò trong doanh nghiệp, rồi đưa vào Cowork để báo cáo tự chạy theo lịch.',
      flow: ['Tạo nhiều SKILL', 'Đóng gói thành Plugin', 'Kết nối Connectors', 'Lên lịch chạy tự động'],
      out: ['Tạo được Plugin gom nhiều SKILL thành một quy trình phân tích hoàn chỉnh', 'Kết nối Connectors để mỗi vai trò trong doanh nghiệp đọc đúng báo cáo của mình', 'Phân tích bán hàng theo nhiều chiều: thời gian, khu vực, sản phẩm, khách hàng, kênh phân phối', 'Lên lịch trong Cowork để báo cáo tự làm mới theo ngày hoặc theo tháng'] },
    { n: 6, ph: 'II', mod: 'Artifact Tools', tools: 'Claude', c: 'Plugins + Cowork + Artifact',
      sum: 'Dùng Artifact để tạo một công cụ phân tích hiệu suất bán hàng (Sales Performance): so sánh thực tế với chỉ tiêu, theo dõi xu hướng và mức độ cải thiện của từng nhân viên, từng quản lý theo tháng, kèm số liệu lũy kế YTD (Actual và Target). Công cụ dùng lại được và chia sẻ cho cả phòng ban.',
      flow: ['Chọn tác vụ thường dùng', 'Tạo công cụ bằng Artifact', 'Tái sử dụng', 'Chia sẻ trong tổ chức'],
      out: ['Hiểu Artifact và các dạng đầu ra: công cụ tương tác, báo cáo, slide', 'Tự tạo công cụ phân tích hiệu suất bán hàng: thực tế so với chỉ tiêu, xu hướng theo tháng', 'Tính và trình bày các chỉ số lũy kế YTD (Actual & Target) cho nhân viên và quản lý', 'Chia sẻ Artifact để đồng nghiệp trong tổ chức cùng sử dụng'] },
    { n: 7, ph: 'II', mod: 'Web App Build & Deploy', tools: 'Claude + Antigravity', c: 'Web App 1',
      sum: 'Chuyển từ các tác vụ rời rạc (SKILL, Project, Artifact) sang một Web app gom tất cả về một nơi. Học viên dùng Claude và Antigravity để dựng giao diện, xử lý dữ liệu và chạy thử ứng dụng trên máy cá nhân, qua bài demo quản trị xuất nhập tồn trong chuỗi cung ứng ngành FMCG.',
      flow: ['Tác vụ rời rạc (SKILL · Project · Artifact)', 'Gom vào một Web app', 'Chạy trên Localhost'],
      demo: { t: 'Demo · Web app quản trị xuất nhập tồn (chuỗi cung ứng FMCG)', items: ['Phân loại hàng slow moving / fast moving', 'Tính tuổi tồn kho', 'Tồn kho an toàn', 'Vòng quay hàng tồn kho', 'Cảnh báo & khuyến nghị cho từng sản phẩm, nhóm sản phẩm'] },
      out: ['Biết khi nào nên làm Web app thay vì SKILL, Project hay Artifact', 'Dùng Claude + Antigravity dựng một Web app từ mô tả nghiệp vụ', 'Xây các chức năng quản trị tồn kho: phân loại hàng, tuổi tồn kho, tồn kho an toàn, vòng quay, cảnh báo', 'Chạy được Web app trên Localhost của học viên'] },
    { n: 8, ph: 'II', mod: 'Web App Build & Deploy', tools: 'Claude + Antigravity', c: 'Web App 1',
      sum: 'Đưa Web app từ máy cá nhân ra sử dụng thực tế: lưu trữ dữ liệu khi người dùng thao tác trên giao diện, quản lý mã nguồn bằng GitHub, publish lên Vercel để nhiều người cùng truy cập, và tạo tài khoản để chia sẻ, phân quyền.',
      flow: ['Lưu dữ liệu từ thao tác trên Frontend', 'Kết nối GitHub', 'Publish qua Vercel', 'Tạo tài khoản & phân quyền'],
      out: ['Lưu trữ dữ liệu khi người dùng thao tác trên Frontend', 'Quản lý mã nguồn và các phiên bản bằng GitHub', 'Publish Web app lên Vercel để mọi người truy cập qua đường link', 'Tạo tài khoản, chia sẻ và phân quyền truy cập Web app'] }
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
