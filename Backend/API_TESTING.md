# 🧪 API Testing Guide — AI Startup Advisor

Base URL: `http://localhost:5000`

---

## 1. Auth Routes

### ✅ POST /api/auth/signup
**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "name": "Arjun Sharma",
  "email": "arjun@startup.com",
  "password": "mypassword123"
}
```
**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Arjun Sharma",
    "email": "arjun@startup.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### ✅ POST /api/auth/login
**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "email": "arjun@startup.com",
  "password": "mypassword123"
}
```
**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Arjun Sharma",
    "email": "arjun@startup.com"
  }
}
```
> 💡 **Copy the `token` value** — you need it for all protected routes below.

---

### ✅ GET /api/auth/me  (Protected)
**Headers:**
```
Authorization: Bearer <paste_your_token_here>
```
**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Arjun Sharma",
    "email": "arjun@startup.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 2. Startup Routes  (all require `Authorization: Bearer <token>`)

### ✅ POST /api/startup/create
**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your_token>
```
**Body:**
```json
{
  "startupName": "EduAI Labs",
  "domain": "EdTech",
  "targetAudience": "College students aged 18-25 in tier-2 cities",
  "budget": 50000,
  "goals": ["Launch MVP in 3 months", "Onboard 500 beta users", "Raise seed round"],
  "strategies": ["Content marketing via YouTube", "Partner with colleges"]
}
```
**Success Response (201):**
```json
{
  "success": true,
  "message": "Startup profile created!",
  "startup": {
    "_id": "64f1b3c4d5e6f7a8b9c0d2e3",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "startupName": "EduAI Labs",
    "domain": "EdTech",
    "targetAudience": "College students aged 18-25 in tier-2 cities",
    "budget": 50000,
    "goals": ["Launch MVP in 3 months", "Onboard 500 beta users", "Raise seed round"],
    "strategies": ["Content marketing via YouTube", "Partner with colleges"],
    "createdAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### ✅ GET /api/startup/:userId
Replace `:userId` with the actual user ID (e.g. `64f1a2b3c4d5e6f7a8b9c0d1`)

**URL:** `GET http://localhost:5000/api/startup/64f1a2b3c4d5e6f7a8b9c0d1`

**Headers:**
```
Authorization: Bearer <your_token>
```

---

### ✅ PUT /api/startup/update/:id
Replace `:id` with the startup document ID.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your_token>
```
**Body (only send fields you want to change):**
```json
{
  "budget": 75000,
  "goals": ["Launch MVP", "Onboard 1000 users", "Revenue ₹5L MRR"]
}
```

---

## 3. Chat Routes  (all require `Authorization: Bearer <token>`)

### ✅ POST /api/chat/save
**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your_token>
```
**Body:**
```json
{
  "userMessage": "How do I validate my startup idea cheaply?",
  "aiResponse": "Great question! Start with a landing page to collect emails before building anything. Use tools like Typeform for surveys, talk to 20 potential customers in a week, and look for existing communities on Reddit or LinkedIn where your audience hangs out."
}
```
**Success Response (200):**
```json
{
  "success": true,
  "message": "Chat saved successfully.",
  "latestMessages": [
    { "role": "user",      "content": "How do I validate my startup idea cheaply?" },
    { "role": "assistant", "content": "Great question! Start with a landing page..." }
  ],
  "totalMessages": 2
}
```

---

### ✅ GET /api/chat/history/:userId
**URL:** `GET http://localhost:5000/api/chat/history/64f1a2b3c4d5e6f7a8b9c0d1`

**Headers:**
```
Authorization: Bearer <your_token>
```
**Success Response (200):**
```json
{
  "success": true,
  "messages": [
    { "role": "user",      "content": "How do I validate my startup idea cheaply?", "createdAt": "..." },
    { "role": "assistant", "content": "Great question! Start with a landing page...", "createdAt": "..." }
  ],
  "totalMessages": 2
}
```

---

### ✅ DELETE /api/chat/clear
**Headers:**
```
Authorization: Bearer <your_token>
```

---

## ❌ Common Error Responses

| Status | When it happens |
|--------|----------------|
| 400    | Missing required fields |
| 401    | No token / invalid token / expired token |
| 403    | Valid token but wrong user |
| 404    | Resource not found |
| 409    | Duplicate (email already exists) |
| 500    | Unexpected server error |

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

---

## 🔑 Postman Setup Tips

1. Create a **Collection** called "AI Startup Advisor"
2. Add a **Collection Variable** called `token`
3. In the Login request → Tests tab, add:
   ```js
   const res = pm.response.json();
   pm.collectionVariables.set("token", res.token);
   ```
4. In every protected request, set Authorization to:
   `Bearer {{token}}`

Now logging in automatically saves the token for all other requests!
