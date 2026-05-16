# 🚀 AI Startup Advisor — Backend

A complete Node.js + Express + MongoDB backend for an AI-powered startup advisory platform.

---

## 📁 Folder Structure

```
ai-startup-advisor/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # signup / login / getMe
│   ├── startupController.js   # create / get / update startup
│   └── chatController.js      # save / get / clear chat history
├── middleware/
│   ├── auth.js                # JWT verification middleware
│   └── errorHandler.js        # global error handler
├── models/
│   ├── User.js                # User schema
│   ├── Startup.js             # Startup schema
│   └── Chat.js                # Chat memory schema
├── routes/
│   ├── authRoutes.js          # /api/auth/*
│   ├── startupRoutes.js       # /api/startup/*
│   └── chatRoutes.js          # /api/chat/*
├── .env.example               # copy to .env and fill in values
├── package.json
├── server.js                  # entry point
└── API_TESTING.md             # Postman guide with example JSONs
```

---

## ⚡ Quick Start (Step-by-Step)

### 1. Install Node.js
Download from https://nodejs.org (v18 or newer recommended)

### 2. Clone / move into the project folder
```bash
cd ai-startup-advisor
```

### 3. Install dependencies
```bash
npm install
```

### 4. Set up environment variables
```bash
# On Mac/Linux:
cp .env.example .env

# On Windows:
copy .env.example .env
```
Then open `.env` and fill in:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string

### 5. Get a MongoDB URI (choose one)

**Option A — Local MongoDB**
```
MONGO_URI=mongodb://localhost:27017/ai-startup-advisor
```

**Option B — MongoDB Atlas (free cloud, recommended for hackathons)**
1. Go to https://cloud.mongodb.com → create a free cluster
2. Click "Connect" → "Connect your application"
3. Copy the connection string and replace `<password>` with your DB password

### 6. Run the server

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on http://localhost:5000
```

### 7. Test the API
Open http://localhost:5000 — you should get:
```json
{ "success": true, "message": "🚀 AI Startup Advisor API is running!" }
```

See `API_TESTING.md` for full Postman examples.

---

## 🔌 React Frontend Integration

In your React app, store the token after login and send it with every request:

```js
// After login — save token
localStorage.setItem("token", response.data.token);

// On every protected API call
const token = localStorage.getItem("token");

fetch("http://localhost:5000/api/startup/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
  body: JSON.stringify({ startupName: "My Startup", ... }),
});
```

---

## 🛠️ Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Runtime     | Node.js                 |
| Framework   | Express.js              |
| Database    | MongoDB + Mongoose      |
| Auth        | JWT + bcryptjs          |
| Config      | dotenv                  |
| CORS        | cors                    |

---

## 📡 API Reference

| Method | Endpoint                     | Auth? | Description              |
|--------|------------------------------|-------|--------------------------|
| POST   | /api/auth/signup             | No    | Register new user        |
| POST   | /api/auth/login              | No    | Login, get JWT           |
| GET    | /api/auth/me                 | Yes   | Get current user         |
| POST   | /api/startup/create          | Yes   | Create startup profile   |
| GET    | /api/startup/:userId         | Yes   | Get startup profile      |
| PUT    | /api/startup/update/:id      | Yes   | Update startup profile   |
| POST   | /api/chat/save               | Yes   | Save a chat message pair |
| GET    | /api/chat/history/:userId    | Yes   | Get full chat history    |
| DELETE | /api/chat/clear              | Yes   | Clear chat history       |
