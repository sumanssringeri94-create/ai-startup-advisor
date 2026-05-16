// server.js
// ─────────────────────────────────────────────
// Entry point for the AI Startup Advisor backend
// ─────────────────────────────────────────────

const express = require("express");
const cors    = require("cors");
require("dotenv").config(); // load .env variables before anything else

const connectDB      = require("./config/db");
const authRoutes     = require("./routes/authRoutes");
const startupRoutes  = require("./routes/startupRoutes");
const chatRoutes     = require("./routes/chatRoutes");
const errorHandler   = require("./middleware/errorHandler");

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Create Express app ────────────────────────────────────────────────────────
const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────────

// CORS — allow requests from your React frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
// GET http://localhost:5000/
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 AI Startup Advisor API is running!",
    version: "1.0.0",
    endpoints: {
      auth:    "/api/auth",
      startup: "/api/startup",
      chat:    "/api/chat",
    },
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",    authRoutes);
app.use("/api/startup", startupRoutes);
app.use("/api/chat",    chatRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
// Catches any request that didn't match a route above
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// Must be LAST — Express recognises it by the 4-parameter signature
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}\n`);
});

module.exports = app; // exported for testing
