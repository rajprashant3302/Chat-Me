# ChatMe Backend — Server API & Real-Time Engine

The backend for ChatMe is a robust Node.js, Express, and Socket.io server engineered for real-time messaging stability, reliable authentication, and connection pooling.

---

## 🛠️ Features & Enhancements

### 1. Robust Real-Time Sockets
- **Uncaught Exception Protection**: Every socket callback is enclosed in try-catch structures, protecting the Node process from crashes on bad payloads or database failures.
- **Connection Guarding**: Validates JWT authenticity on socket handshakes. Rejecting unauthorized/expired socket handshakes gracefully.
- **Client Message Indexing**: Saves `clientMessageId` on all message records to enable Optimistic UI reconciliation.

### 2. Authentication & Password Security
- **Forgot Password Flow**: Fully secure forgot-password token creation using cryptographic random tokens. Hashed (`sha256`) tokens expire in 1 hour and are single-use.
- **Nodemailer Integration**: Automatically sends HTML emails for user registration welcome, forgot-password reset links, and password-change confirmations. Fallback console logging is provided when credentials are not configured.

### 3. Stability & Concurrency Support
- **Process Exception Listeners**: Global event listeners for `uncaughtException` and `unhandledRejection` prevent abrupt shutdowns.
- **IP Rate Limiting**: Lightweight, in-memory IP-based rate limiting on sensitive authentication routes (`/api/register`, `/api/email`, `/api/password`, `/api/forgot-password`, `/api/reset-password`).
- **Graceful Shutdown**: Intercepts `SIGINT` / `SIGTERM` signals to cleanly close HTTP server connections, Socket pools, and Mongoose client connections.

---

## ⚙️ Setup & Configuration

Create a `.env` file in the `backend/` folder:

```env
PORT=8080
MONGODB_URL=mongodb://localhost:27017/chatme
FRONTEND_URL=http://localhost:3000
JWT_SECRET_KEY=your_secure_secret_key

# Nodemailer SMTP Email Credentials (Gmail service fallback is configured)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Start Server

```bash
npm install
npm start
```
