// middleware/errorHandler.js
// ─────────────────────────────────────────────
// Global error handling middleware
// Place this LAST in server.js (after all routes)
// Express recognises it as an error handler because it has 4 params: (err, req, res, next)
// ─────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ── Mongoose: duplicate key (e.g. email already registered) ──────────────
  if (err.code === 11000) {
    statusCode = 409; // Conflict
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // ── Mongoose: validation error (required fields missing, etc.) ────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Collect all validation messages into one string
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(". ");
  }

  // ── Mongoose: invalid ObjectId format ────────────────────────────────────
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── JWT errors (caught in auth middleware, but just in case) ──────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please log in again.";
  }

  // Log in development only (don't leak stack traces in production)
  if (process.env.NODE_ENV !== "production") {
    console.error("🔥 Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only include stack trace in development
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
