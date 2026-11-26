# AIM Website

Website thông tin khóa **AI Mastery (AIM)**. Node.js thuần, không cần cài thư viện.

## Chạy
```bash
cd website
npm start        # http://localhost:3200
```
Đổi cổng: `$env:PORT=4000; npm start` (PowerShell). Tắt intro khi đang chỉnh: mở `http://localhost:3200/?nointro`.

## Cấu trúc
```
website/
├─ server.js          server tĩnh (chỉ phục vụ public/)
├─ package.json
├─ public/            mọi thứ trong đây được phục vụ ra web
│  ├─ index.html
│  ├─ css/styles.css  giao diện, token màu sáng/tối
│  ├─ js/app.js       ảnh slot, menu, sáng/tối, lộ trình 8 buổi
│  ├─ js/intro.js     mascot cưỡi chổi + hiệu ứng Swarm Rebuild
│  └─ img/            ảnh
```

## Ảnh
Đặt file vào `public/img/` đúng tên, tải lại trang là hình tự hiện.

| Tên file | Vị trí | Trạng thái |
|---|---|---|
| `hero-bg.jpg` | Nền phần Hero | có |
| `about.png` | Sơ đồ phần Giới thiệu | có |
| `module1` `module2` `module3` | 3 thẻ học phần | có |
| `project4.webp` | Thẻ dự án Supply Chain (buổi 7-8) | có |
| `project3.webp` | Thẻ dự án Performance Management (buổi 6, Artifact) | có |
| `project2.webp` | Thẻ dự án Sales Execution (buổi 5) | có |
| `project1.webp` | Thẻ dự án HR (buổi 3) | có |
| `mascot-broom.png` | Mascot cưỡi chổi (intro) | có |
| `mascot.png` | Mascot đứng cạnh logo, vẫy chào | có |
| `mascot-music.png`, `headphones.png` | Mascot đeo tai nghe nghe nhạc (sau ~2,5 phút) | có |
| `mascot-sleep.png` | Mascot đội mũ ngủ (chế độ tối) | có |
| `process-tile.png` | Khối ngôi sao phần Cách học | có |
| `gv-son.webp` `gv-phuc.webp` | Ảnh 2 giảng viên (đã tách nền), đứng trong vòng tròn, đầu nhô lên | có |
| `gv-son-hv1` … `gv-son-hv6` | Logo học vấn thầy Sơn: UEH, Harvard Business School, Ateneo de Manila, MIT Sloan, AFP, CIMA | có |
| `gv-son-kn1` … `gv-son-kn6` | Logo kinh nghiệm thầy Sơn: Wilmar, Pebsteel, FrieslandCampina, Lazada, Masan Group, Đồng Tâm Group | có |
| `gv-phuc-hv1` … `gv-phuc-hv3` | Logo học vấn anh Phúc: Nguyen Tat Thanh University, TechData.AI, Aptech | có |
| `gv-phuc-kn1` | Logo kinh nghiệm anh Phúc: Japana | có |
| `antigravity.svg` | Logo Antigravity trong lộ trình | có |

## Sửa nội dung lộ trình
Dữ liệu 8 buổi nằm ở mảng `S` trong `public/js/app.js`. Nguồn: `../docs/AIP_Lo_trinh_8_buoi_dien_noi_dung.docx`.

Mỗi logo giảng viên có 2 file: `gv-…png` (bản **trắng**, nền trong suốt, dùng ở chế độ tối) và `gv-…-color.png` (bản **màu chuẩn** của đơn vị, dùng ở chế độ sáng). Thiếu bản màu thì chế độ sáng tự tô bản trắng thành xám đậm. Hiện còn thiếu `gv-son-hv6-color.png` (CIMA).
