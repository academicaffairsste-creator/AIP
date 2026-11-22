'use strict';
// Static server, không cần thư viện ngoài.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3200;
const ROOT = __dirname;
const PUB = path.join(ROOT, 'public');          // chỉ thư mục này được phục vụ ra web
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.mp4': 'video/mp4', '.ico': 'image/x-icon'
};

const send = (res, code, body, type) => {
  res.writeHead(code, { 'Content-Type': type || 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { return send(res, 400, 'Bad request', 'text/plain'); }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'method' });
  if (p === '/') p = '/index.html';
  const file = path.resolve(PUB, '.' + p);
  // chặn thoát khỏi public/ và file ẩn
  if (!file.startsWith(PUB + path.sep) || /[\\/]\./.test(file.slice(PUB.length))) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    send(res, 200, buf, MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
  });
}).listen(PORT, () => console.log(`AIP website: http://localhost:${PORT}`));
