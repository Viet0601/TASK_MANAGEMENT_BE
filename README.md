# 🚀 Backend API - Task Management

Một RESTful API backend được xây dựng bằng **Node.js**, **Express**, và **MongoDB (Mongoose)** để quản lý người dùng, xác thực với JWT, và quản lý nhiệm vụ (tasks).

## 📦 Công nghệ sử dụng

* **Node.js** - Runtime cho JavaScript phía server
* **Express.js** - Framework backend nhẹ, mạnh mẽ
* **MongoDB & Mongoose** - Cơ sở dữ liệu NoSQL và ORM
* **JWT (jsonwebtoken)** - Xác thực và phân quyền người dùng
* **Bcrypt/Bcryptjs** - Mã hoá mật khẩu
* **Dotenv** - Quản lý biến môi trường
* **CORS** - Cho phép frontend giao tiếp với backend
* **Nodemon** - Tự động reload server khi code thay đổi

---

## ⚙️ Cài đặt

### 1. Clone dự án

```bash
git clone https://github.com/Viet0601/TASK_MANAGEMENT_BE.git
cd backend
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Tạo file môi trường `.env`

Trong thư mục gốc, tạo file `.env` với nội dung:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task_manager
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1d
```

### 4. Chạy server

Chạy ở chế độ production:

```bash
npm start
```

Chạy ở chế độ phát triển (tự động reload khi thay đổi code):

```bash
npm run dev
```

---

## 📂 Cấu trúc thư mục

```
backend/
│── server.js          # File chính khởi động server
│── .env               # File biến môi trường
│── package.json       
│── models/            # Chứa các schema của MongoDB (User, Task, ...)
│── routes/            # Định nghĩa API routes
│── controllers/       # Xử lý logic cho routes
│── middlewares/       # Middleware (auth, validate, error handler)
│── utils/             # Hàm tiện ích
```

---

## 🔑 API chính

### Auth

* `POST /api/auth/register` - Đăng ký tài khoản mới
* `POST /api/auth/login` - Đăng nhập và nhận JWT token
* `POST /api/auth/logout` - Đăng xuất

### Task

* `GET /api/tasks` - Lấy danh sách nhiệm vụ
* `POST /api/tasks` - Tạo nhiệm vụ mới
* `PUT /api/tasks/:id` - Cập nhật nhiệm vụ
* `DELETE /api/tasks/:id` - Xóa nhiệm vụ

---

## 🛡️ Xác thực

Các API task yêu cầu JWT. Gửi token trong header:

```
Authorization: Bearer <your_token>
```

---


## 👨‍💻 Tác giả

* [Phạm Hoàng Việt](https://github.com/Viet0601)
