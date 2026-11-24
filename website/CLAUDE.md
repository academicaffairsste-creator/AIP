# CLAUDE.md

Website thông tin khóa AI Mastery (AIM). Node.js thuần + HTML/CSS/JS thuần, không dependency.

## Lệnh
- `npm start` → http://localhost:3200 (chạy trong thư mục `website/`)
- `node --check server.js && node --check public/js/app.js && node --check public/js/intro.js`

## Cấu trúc
- `server.js`: phục vụ mọi file trong `public/` (chặn `..` và file ẩn). Không còn API form: nút "Đăng ký tư vấn" mở Zalo.
- `public/index.html`, `public/css/styles.css`, `public/js/app.js` (slot ảnh, menu, theme, lộ trình), `public/js/intro.js` (mascot + Swarm Rebuild), `public/img/`.
- Tài liệu nguồn ở `../docs/` (Excel, Word lộ trình, wireframe, bảng màu).

## Quy ước
- Chỗ chưa có hình là `.slot[data-slot="tên"]`; `app.js` tự nạp `img/<tên>.(webp|png|jpg|jpeg|svg)` nếu có. Thêm slot mới bằng data-slot.
- Chỉ đặt file công khai trong `public/`; `*.md`, `server.js` không bao giờ được phục vụ ra web.
- Nội dung tiếng Việt, lấy từ `../docs/Session_AIP_module.xlsx` (sheet AIP) và `../docs/AIP_Lo_trinh_8_buoi_dien_noi_dung.docx`; dữ liệu 8 buổi ở mảng `S` trong `public/js/app.js`. Không tự thêm ngày, học phí khi chưa có dữ liệu.
- Màu là token ở `:root` (sáng) và `:root[data-theme=dark]` (tối) trong `styles.css`; không hard-code màu chữ/nền mới.
