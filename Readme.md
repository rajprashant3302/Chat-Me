# 💬 Chat-Me — Real-Time Chat Application

Chat-Me is a full-stack real-time chat application built using **Node.js, Express, MongoDB, Socket.io, React, Redux Toolkit, and Cloudinary**. It supports instant messaging, media sharing, authentication, and persistent conversations.

---

## 🚀 Live Repository

🔗 https://github.com/rajprashant3302/Chat-Me

---

## ✨ Features & Enhancements

* 🔐 **User authentication**: Signup / Login, cookie & bearer token checks.
* 💬 **Real-time messaging**: Socket.io real-time message exchange.
* ⚡ **Optimistic UI & Retry**: Sent messages appear instantly as "Sending...", updating to "Sent" (ticks) or "Failed" (with a "Retry" option) depending on acknowledgment.
* 👤 **Draggable Square Crop**: Interactive avatar cropping overlay (WhatsApp style) allowing users to drag and resize their profile picture.
* 🔐 **Forgot Password**: Password reset workflow via secure token generation and validation.
* 📧 **Nodemailer Alerts**: Registration welcome, reset passwords, and password change notification emails.
* 🟢 **Online status indicator**: Active state checking and ticks on chat list.
* ⚡ **100+ Concurrency Stability**: Process exception trapping, IP rate-limiting, and SIGINT/SIGTERM graceful server shutdown hooks.
* 🖼️ **Cloudinary media sharing**: Sharing images and video files.

---

## 🛠️ Tech Stack

### Frontend
- React 19 & Redux Toolkit
- React Router DOM
- Socket.io Client
- Tailwind CSS

### Backend
- Node.js & Express.js
- Socket.io Server
- MongoDB & Mongoose
- Nodemailer (SMTP Service)

---

## 📁 Project Structure

```
Chat-Me/
│
├── backend/
│   ├── config/          # DB connection
│   ├── controller/      # API routes implementation
│   ├── helpers/         # Email helper, token verify, conversation fetcher
│   ├── models/          # Mongoose Schemas (User, Conversation, Message)
│   ├── routes/          # Express Routers
│   ├── socket/          # Socket.io handlers
│   └── index.js
│
├── client/
│   ├── src/
│   │   ├── components/  # Chat, Sidebar, Interactive Cropper, Avatar
│   │   ├── helpers/     # Crop utility, file upload
│   │   ├── pages/       # Login, Register, Forgot Password, Reset
│   │   ├── redux/       # Redux Toolkit slice
│   │   └── index.js
│   └── package.json
│
└── Readme.md            # Root Documentation
```

---

## ⚙️ Installation & Setup

### 1️⃣ Configure Environment Variables

Create `.env` inside `backend/`:
```env
PORT=8080
MONGODB_URL=mongodb://localhost:27017/chatme
FRONTEND_URL=http://localhost:3000
JWT_SECRET_KEY=your_secret_key

# SMTP Credentials
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Create `.env` inside `client/`:
```env
REACT_APP_BACKEND_URL=http://localhost:8080
```

### 2️⃣ Run Backend

```bash
cd backend
npm install
npm start
```

### 3️⃣ Run Client

```bash
cd client
npm install
npm start
```
Client runs on `http://localhost:3000`.
