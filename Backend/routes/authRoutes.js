const express = require("express");

const router = express.Router();

// Signup Route
router.post("/signup", (req, res) => {
  res.json({
    success: true,
    message: "Signup successful",
  });
});

// Login Route
router.post("/login", (req, res) => {
  res.json({
    success: true,
    message: "Login successful",
    token: "sample-token",
  });
});

module.exports = router;