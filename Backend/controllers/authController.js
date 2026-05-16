// controllers/authController.js
// ─────────────────────────────────────────────
// Handles user signup and login logic
// These functions are called by the auth routes
// ─────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Helper: generate a signed JWT ────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },            // payload — what's encoded in the token
    process.env.JWT_SECRET,    // secret key from .env
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic field check
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
      });
    }

    // 2. Check if email is already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered. Please log in.",
      });
    }

    // 3. Create user (password is hashed in the model's pre-save hook)
    const user = await User.create({ name, email, password });

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Respond — never send the password back
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error); // pass to global error handler
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Basic field check
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // 2. Find user — must explicitly select password (it's select:false in schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 3. Compare the submitted password with the hashed one
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/auth/me  (bonus: get current user profile) ──────────────────────
const getMe = async (req, res, next) => {
  try {
    // req.user is set by the auth middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getMe };
