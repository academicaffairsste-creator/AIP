# MEMORY.md (cập nhật 2026-11-20)

## Bối cảnh
- Website khóa AIP. Giao diện xuất phát từ ảnh thiết kế "Mr. L Production" (nền kem #F5EFEA, cam #F26A1B, đen #111), font Quicksand.
- 2026-11-20: tái cấu trúc. Thư mục cũ `MrL-web-app` → `website/` (file public trong `public/`). Đã xóa (vào Thùng rác): `AIP-web-app/` (landing cũ), `image/` (176 ảnh cào trang BIE), `aip-website.html` (bản chụp cũ), `process-tile.png`. Tài liệu nguồn chuyển vào `../docs/`.
- Cổng 3200 (3000 bị app khác chiếm).

## Nội dung
- Nguồn: `../docs/Session_AIP_module.xlsx` (sheet AIP; BIE/BIH là khóa khác) và file Word lộ trình người dùng đã điền.
- Sections: Hero, Giới thiệu, Học phần (3 thẻ), Lộ trình 8 buổi (accordion lọc phase), Dự án (4 thẻ), CTA, Footer. Đã bỏ section Cách học theo yêu cầu.
- Mảng `S` (app.js): buổi 3–8 có chi tiết (d) + mục tiêu (g); buổi 1–2 chưa có chi tiết. Bài tập/Tài liệu chưa điền.
- Giảng viên: Bùi Trường Sơn, Nguyễn Thiện Phúc (chưa đưa lên web). Hình thức: Offline/Online/Hybrid. Chưa có ngày khai giảng, học phí, đối tượng, chứng chỉ.

## Ảnh & logo
- hero-bg.jpg lấy từ Figma (file Web - SCA - PBM, frame "aip-website - /#home", node 779:2920); seat View bị giới hạn số lần gọi MCP.
- module1-3, about do người dùng gửi; about.png nền trong suốt, dark mode dùng filter invert. Còn thiếu project1-4.
- Logo Claude: SVG chính thức (Wikimedia) dạng symbol #claude trong index.html. Logo Antigravity: favicon antigravity.google bỏ nền tròn. Nhãn công cụ trong lộ trình không viền.

## Tính năng
- Nút sáng/tối (mặt trời/mặt trăng), lưu localStorage, theo hệ thống lần đầu.
- Intro (js/intro.js), viết lại 2026-11-20 theo kiểu extension "Swarm Rebuild" (github.com/DhvanilPatel/swarm-cursors, tribute của Swarm – Joel Califa). Repo đó KHÔNG có license và yêu cầu không dùng lại code → mình tự viết, không chép code. Cách hoạt động: mascot (img/mascot-broom.png) chỉ huy bằng đũa; 7 con trỏ có nhãn (Claude, Antigravity, Skill, Cowork, Artifact, Plugin, Projects; mobile 4) nhận việc từ trên xuống: khối → kéo khung dấu thập + badge W×H; ảnh → kéo khung rồi quét; chữ → con trỏ I gõ từng ký tự (mask nhiều lớp theo dòng) + đường gióng đỏ. 62 việc, ~33s, trang tự cuộn rồi về đầu. Trong lúc chạy: khoá cuộn tay (wheel/touch/phím cuộn), chỉ bỏ qua bằng nút "Bỏ qua" hoặc Esc; history.scrollRestoration=manual + bỏ #hash để refresh luôn bắt đầu từ đầu trang (sửa lỗi 2026-11-20: refresh ở cuối trang bị kẹt dưới, cuộn lên làm mất mascot). Tắt: ?nointro hoặc reduced-motion. Kiểm thử bằng Chrome headless qua DevTools Protocol (script trong scratchpad).
- Liên kết (2026-11-20): mọi nút "Đăng ký tư vấn" (menu, hero, CTA) mở Zalo https://zalo.me/0972523420 ở tab mới; đã bỏ popup form + API /api/contact. Footer: Website starttrain.edu.vn, Facebook STARTTRAIN.COMPANY, Zalo (thay 4 icon giả).
- Đã bỏ "Ghi chú" khỏi thẻ từng buổi trên web (xóa field note trong mảng S); ghi chú vẫn còn trong file Word ở docs/.
- Mobile (2026-11-20): khối @media(max-width:700px) cuối styles.css: menu (logo trái, sáng/tối + ☰ phải, menu thả xuống), Hero chữ trên/hình dưới (nền gradient + ảnh neo góc dưới phải, có bản dark), thẻ học phần & dự án vuốt ngang 80%, lộ trình gọn, CTA nút full, footer xếp dọc. Thêm khoảng trắng trước <br> để khi ẩn <br> không dính chữ. Kiểm thử ở 390×844 sáng/tối bằng Chrome headless.
- Kết thúc intro (2026-11-20): mascot không biến mất mà bay về "đậu" cạnh chữ "AI Productivity" trên menu (.perch trong .brand, ảnh img/mascot.png = mascot đứng, không chổi). Cứ 7s lắc người vẫy chào + bong bóng "Xin chào! 👋". Bỏ qua (Esc/nút) cũng bay về. ?nointro thì mascot đứng sẵn.
- Chi tiết buổi 3–8 (2026-11-22) trình bày có cấu trúc: mảng S dùng field sum (tổng quan), flowT/flow (quy trình đánh số 01→, buổi 3 là case study L&D), demo {t, items} (buổi 7 FMCG), out (đầu ra, dấu ✓). Hàm detail() trong app.js; buổi 1–2 chưa có sum nên hiện "sẽ được cập nhật". Chỉ sắp xếp lại nội dung từ file Word, không thêm nội dung mới. Mobile: quy trình xếp dọc mũi tên ↓.
- Người dùng không thích các vạch gạch trang trí (vạch dọc, gạch ngang trước nhãn): đã đổi thành hình thoi cam nhỏ (.eb i, .blk h4::before), bỏ vạch dọc ở câu tổng quan. Tránh dùng lại kiểu gạch này.
- 2026-11-22: thêm lại section Cách học (#flow) theo hình người dùng gửi, đặt NGAY DƯỚI phần Dự án (trên CTA). HTML/SVG + img/process-tile.png (cắt từ hình, đã xoá vệt đường kẻ thừa). Có trong intro. Menu chưa có link Cách học.
- Vercel (2026-11-22): project affairs1/aip (tài khoản academicaffairsste-3554), nối GitHub academicaffairsste-creator/AIP, nhánh main tự deploy. Root Directory = website, cấu hình ở website/vercel.json (static, output public/). Domain: aip-pearl.vercel.app đang redirect sang ai-productivity.starttrain.edu.vn nhưng domain này CHƯA trỏ DNS về Vercel (đang ở Cloudflare/CyberPanel, trả 404). Vercel CLI 66.6.0 + plugin vercel-plugin@vercel đã cài; MCP plugin:vercel cần người dùng xác thực qua /mcp.
- Link công khai hiện tại: https://starttrain-aip.vercel.app (thêm 2026-11-22). aip-pearl.vercel.app redirect 308 sang link này. ai-productivity.starttrain.edu.vn vẫn chờ DNS Cloudflare (CNAME a875d29d0e54746f.vercel-dns-017.com, DNS only + TXT _vercel); khi chạy được thì đổi redirect về tên miền đó.
- Buổi 1–2 (2026-11-22): người dùng gửi danh sách nội dung, mình tự chia: buổi 1 = AI/ML/DL, GenAI & LLM, Tokens/Vectors/Embeddings, Context window & Hallucination; buổi 2 = Prompt frameworks + CTC, 4 nhóm AI trong kinh doanh, Chatbot → AI Agents. Dùng field topics (danh sách đánh số dạng lưới, 4 mục → 2 cột, 3 mục → 3 cột). Người dùng sẽ chỉnh sau.
- 2026-11-24: đổi tên khóa thành AI Mastery (AIM) trên web (logo AIM, tiêu đề, menu, CTA, footer). Học phần ghi "Buổi 1-2 / 3-4-5 / 6-7-8"; Cách học "Ba trạm. Một sản phẩm." (bước 02 = Buổi 3-4-5-6). 4 dự án: HR (buổi 3), Sales Execution (5), Performance Management (6), Supply Chain (7-8), viết thường không in hoa. Buổi 3–8: tổng quan dài hơn + 4 ý đầu ra mỗi buổi (dựa trên Excel/Word gốc). Tên thư mục/repo/project Vercel vẫn là AIP.
- Logo Starttrain (2026-11-24): người dùng để file gốc ở docs/design/image/. Web dùng img/starttrain-logo.png (xanh, nền sáng) và starttrain-logo-white.png (trắng, nền tối), cắt + thu về 480px. Đặt ở chân trang ("Đơn vị đào tạo", tự đổi theo theme, link starttrain.edu.vn) và trên thanh CTA (nền luôn tối nên dùng bản trắng).
- 2026-11-24: bỏ chữ "Đơn vị đào tạo" ở chân trang; thêm logo Starttrain (.nav-st) góc trên bên phải thanh menu, sau nút sáng/tối, đổi xanh/trắng theo theme. Menu giờ: logo AIM trái, các mục giữa (margin auto), CTA + theme + logo phải. Điện thoại ≤420px ẩn chữ "AI Mastery" (giữ khối AIM + mascot) để đủ chỗ.
