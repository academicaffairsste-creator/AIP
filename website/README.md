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
| `project1` … `project4` | 4 thẻ Dự án thực hành | **còn thiếu** |
| `mascot-broom.png` | Mascot cưỡi chổi (intro) | có |
| `mascot.png` | Mascot đứng cạnh logo, vẫy chào | có |
| `process-tile.png` | Khối ngôi sao phần Cách học | có |
| `antigravity.svg` | Logo Antigravity trong lộ trình | có |

## Sửa nội dung lộ trình
Dữ liệu 8 buổi nằm ở mảng `S` trong `public/js/app.js`. Nguồn: `../docs/AIP_Lo_trinh_8_buoi_dien_noi_dung.docx`.
