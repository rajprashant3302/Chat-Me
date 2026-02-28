# 💬 Chat-Me — Real-Time Chat Application

Chat-Me is a full-stack real-time chat application built using **Node.js, Express, MongoDB, Socket.io, and Cloudinary**. It supports instant messaging, media sharing, authentication, and persistent conversations.

---

## 🚀 Live Repository

🔗 https://github.com/rajprashant3302/Chat-Me

---

## ✨ Features

* 🔐 User authentication (Signup / Login)
* 💬 Real-time messaging using Socket.io
* 🟢 Online / Offline user detection
* 🖼️ Image sharing using Cloudinary
* 🎥 Video messaging support
* 👤 User profile management
* ✔️ Message seen status
* 🕓 Conversation history storage
* 🍪 Cookie-based authentication
* ⚡ Fast and scalable backend

---

## 🛠️ Tech Stack

### Frontend

* JavaScript
* HTML
* CSS
* Socket.io Client

### Backend

* Node.js
* Express.js
* Socket.io
* MongoDB
* Mongoose

### Cloud Services

* Cloudinary (Image & Video Upload)

---

## 📁 Project Structure

```
Chat-Me/
│
├── backend/
│   ├── config/
│   ├── models/
│   │    ├── UserModel.js
│   │    └── MessageModel.js
│   ├── routes/
│   ├── socket/
│   ├── index.js
│   └── package.json
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🧠 Database Schema

### User Schema

```js
{
  name: String,
  email: String,
  password: String,
  profile_pic: String
}
```

### Message Schema

```js
{
  text: String,
  image: {
    imageUrl: String,
    caption: String
  },
  video: {
    videoUrl: String,
    caption: String
  },
  seen: Boolean,
  msgByUserId: ObjectId
}
```

### Conversation Schema

```js
{
  sender: ObjectId,
  receiver: ObjectId,
  messages: [ObjectId]
}
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/rajprashant3302/Chat-Me.git
cd Chat-Me
```

---

## ▶️ Start Backend Server

```bash
cd backend
npm install
node index.js
```

Backend runs on:

```
http://localhost:8080
```

---

## ▶️ Start Client

Open new terminal:

```bash
cd client
npm install
npm start
```

Client runs on:

```
http://localhost:3000
```

---

## ☁️ Cloudinary Configuration

Create `.env` file inside backend folder:

```
MONGO_URL=your_mongodb_url
FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET_KEY=your_secret_key
```

---

## 🔌 Socket.io Features

* Real-time messaging
* Live user status
* Instant message delivery
* Seen status updates

---

## 📡 API Features

### Authentication

* Register user
* Login user
* Logout user

### Messaging

* Send message
* Fetch conversations
* Fetch messages
* Upload media

---

## 🖼️ Media Support

Supports:

* Text messages
* Image messages (Cloudinary)
* Video messages (Cloudinary)

---

## 🔒 Security Features

* Password encryption
* Unique email enforcement
* Cookie authentication
* Protected routes

---

## 🚀 Future Improvements

* Group chat support
* Typing indicator
* Voice messages
* Push notifications
* Message reactions
* File sharing

---

## 👨‍💻 Author

**Prashant Raj**

GitHub:
https://github.com/rajprashant3302

---

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub.

---
