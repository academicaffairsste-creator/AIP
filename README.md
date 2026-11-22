# Web - AIP

```
Web - AIP/
├─ website/   website khóa AI Productivity (chạy: cd website && npm start → http://localhost:3200)
└─ docs/      tài liệu nguồn
   ├─ Session_AIP_module.xlsx                  nội dung các khóa (sheet AIP)
   ├─ AIP_Lo_trinh_8_buoi_dien_noi_dung.docx   nội dung chi tiết 8 buổi
   ├─ AI Productivity - wireframe.html         wireframe gốc
   └─ design/palette-peach-orange.png          bảng màu tham khảo
```

Chi tiết website xem `website/README.md`.

## Deploy (Vercel)
`vercel.json` ở gốc repo cho Vercel phục vụ thẳng thư mục `website/public` (web tĩnh, không cần build, không dùng `server.js`).
Thư mục `docs/` không được đưa lên web. Mỗi lần push lên nhánh `main`, Vercel tự cập nhật.
