// routes/startupRoutes.js
// ─────────────────────────────────────────────
// Startup profile endpoints (all protected):
//   POST /api/startup/create        — create a startup profile
//   GET  /api/startup/:userId       — fetch a user's startup profile
//   PUT  /api/startup/update/:id    — update a startup profile
// ─────────────────────────────────────────────

const express = require("express");
const router  = express.Router();

const { createStartup, getStartup, updateStartup } = require("../controllers/startupController");
const { protect } = require("../middleware/auth");

// All startup routes require a logged-in user
router.post("/create",       protect, createStartup);
router.get("/:userId",       protect, getStartup);
router.put("/update/:id",    protect, updateStartup);

module.exports = router;
