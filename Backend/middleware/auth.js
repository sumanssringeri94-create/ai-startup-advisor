// middleware/auth.js
// ─────────────────────────────────────────────
// JWT authentication middleware
// Attach this to any route that requires a logged-in user.
//
// How it works:
//   1. Reads the "Authorization: Bearer <token>" header
//   2. Verifies the token with the JWT_SECRET
//   3. Attaches the decoded user info to req.user
//   4. Calls next() so the route handler can proceed
// ─────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if Authorization header exists and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1]; // grab the token part
    }

    // 2. No token → reject immediately
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided. Please log in.",
      });
    }

    // 3. Verify the token (throws if expired or tampered)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Make sure the user still exists in the DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists. Please sign up again.",
      });
    }

    // 5. Attach user to request — now available as req.user in route handlers
    req.user = user;
    next();
  } catch (error) {
    // jwt.verify throws "JsonWebTokenError" or "TokenExpiredError"
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token. Please log in.",
    });
  }
};

module.exports = { protect };
