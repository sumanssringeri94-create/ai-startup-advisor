// routes/authRoutes.js
// ─────────────────────────────────────────────
// Auth endpoints:
//   POST /api/auth/signup  — register a new user
//   POST /api/auth/login   — login and receive JWT
//   GET  /api/auth/me      — get current user (protected)
// ─────────────────────────────────────────────

const express = require("express");
const router  = express.Router();

const { signup, login, getMe } = require("../controllers/authController");
const { protect }              = require("../middleware/auth");

// Public routes
router.post("/signup", signup);
router.post("/login",  login);

// Protected route — requires valid JWT
router.get("/me", protect, getMe);

module.exports = router;
