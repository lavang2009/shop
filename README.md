# FreshGlow Store

Website bán hàng chuyên về sữa rửa mặt, xây bằng React + Vite + TailwindCSS + Firebase.

## Tính năng

- Trang chủ, danh sách sản phẩm, chi tiết sản phẩm
- Đăng ký / đăng nhập / đăng xuất
- Trang cá nhân
- Giỏ hàng, thanh toán và lịch sử đơn hàng
- Firebase Authentication
- Firestore lưu sản phẩm, hồ sơ người dùng và đơn hàng
- Firebase Storage upload ảnh sản phẩm
- Trang quản trị CRUD sản phẩm
- Phân quyền `customer`, `seller`, `admin`
- Responsive, animation mượt, giao diện hiện đại
- Các trang phụ: Giới thiệu, Liên hệ, FAQ, Chính sách, Bộ sưu tập

## Cấu trúc dự án

- `src/firebase/*`: cấu hình Firebase
- `src/context/AuthContext.jsx`: auth và hồ sơ người dùng
- `src/context/ProductContext.jsx`: sản phẩm, upload ảnh, CRUD
- `src/context/CartContext.jsx`: giỏ hàng và tạo đơn hàng
- `src/pages/*`: toàn bộ các trang
- `firestore.rules`, `storage.rules`: rules bảo mật

## Chạy dự án

```bash
npm install
npm run dev
```

## Thiết lập Firebase

1. Tạo Firebase project
2. Bật **Authentication**:
   - Email/Password
   - Phone (nếu muốn dùng đăng nhập bằng số điện thoại)
3. Tạo Firestore Database
4. Bật Storage
5. Tạo file `.env` từ `.env.example` và điền config Firebase của bạn
6. Tạo document role cho tài khoản quản trị:

```text
users/{uid}
{
  displayName: "Admin",
  email: "admin@example.com",
  role: "admin"
}
```

Hoặc `role: "seller"` cho tài khoản người bán.

## Rules bảo mật

Đưa nội dung trong `firestore.rules` và `storage.rules` lên Firebase Console.

## Deploy lên Vercel

1. Đẩy code lên GitHub
2. Import project vào Vercel
3. Build command: `npm run build`
4. Output directory: `dist`
5. Tạo biến môi trường Vite trong Vercel giống `.env.example`
6. Giữ file `vercel.json` để SPA route hoạt động

## Lưu ý

- Tài khoản thường chỉ xem sản phẩm, giỏ hàng và đơn hàng của mình.
- Chỉ tài khoản có role `seller` hoặc `admin` mới thêm/sửa/xóa sản phẩm.
- Ảnh sản phẩm lưu ở Firebase Storage, không lưu local.
- Bản này không seed sản phẩm giả; sản phẩm sẽ do seller/admin thêm trong trang quản trị.
