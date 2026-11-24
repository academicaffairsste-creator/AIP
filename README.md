# Web - AIP

```
Web - AIP/
├─ website/   website khóa AI Mastery - AIM (chạy: cd website && npm start → http://localhost:3200)
└─ docs/      tài liệu nguồn
   ├─ Session_AIP_module.xlsx                  nội dung các khóa (sheet AIP)
   ├─ AIP_Lo_trinh_8_buoi_dien_noi_dung.docx   nội dung chi tiết 8 buổi
   ├─ AI Productivity - wireframe.html         wireframe gốc
   └─ design/palette-peach-orange.png          bảng màu tham khảo
```

Chi tiết website xem `website/README.md`.

## Deploy (Vercel)
Project Vercel `aip` (team affairs1) đặt Root Directory = `website`; `website/vercel.json` cho Vercel phục vụ thẳng thư mục `public/` (web tĩnh, không build, không dùng `server.js`).
Thư mục `docs/` không được đưa lên web. Mỗi lần push lên nhánh `main`, Vercel tự cập nhật.
