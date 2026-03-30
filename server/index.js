const dns = require('dns');
dns.setServers(['1.1.1.1', '1.0.0.1']);

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// --- 1. Middlewares ---
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// --- 2. Các Route API (Phải đặt trước các route React) ---
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// APIs cho Admin và Customer
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

// --- 3. Phục vụ Admin App (client-admin) ---
// Phục vụ các file tĩnh (js, css, img) từ thư mục build của admin
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));

// SỬA LỖI: Thay 'admin/*' bằng '/admin/:path*' để tương thích Node.js mới
app.get('/admin/:path*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'));
});

// --- 4. Phục vụ Customer App (client-customer) ---
// Phục vụ các file tĩnh cho trang chủ
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));

// Xử lý tất cả các route còn lại (React Router cho Customer)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-customer/build', 'index.html'));
});

// --- 5. Khởi động Server ---
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
