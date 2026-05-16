const express = require("express");

const router = express.Router();

// Test Route
router.get("/", (req, res) => {
  res.send("Startup Routes Working");
});

module.exports = router;
