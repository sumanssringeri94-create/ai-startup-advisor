const express = require("express");
const router = express.Router();
const Startup = require("../models/Startup");

// GET /api/startup/:userId
router.get("/:userId", async (req, res) => {
  try {
    const startup = await Startup.findOne({ userId: req.params.userId });

    if (!startup) {
      return res.status(404).json({ success: false, message: "No startup found" });
    }

    return res.status(200).json({ success: true, startup });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/startup
// POST /api/startup
router.post("/", async (req, res) => {
  try {
    console.log("✅ POST /startup hit");
    console.log("Body:", req.body);

    const existing = await Startup.findOne({ userId: req.body.userId });
    console.log("Existing:", existing);

    if (existing) {
      return res.status(400).json({ success: false, message: "Startup already exists. Use PUT to update." });
    }

    const startup = await Startup.create(req.body);
    console.log("Created:", startup);

    return res.status(201).json({ success: true, startup });
  } catch (error) {
    console.error("❌ Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/startup/:id
router.put("/:id", async (req, res) => {
  try {
    const startup = await Startup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!startup) {
      return res.status(404).json({ success: false, message: "Startup not found" });
    }

    return res.status(200).json({ success: true, startup });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/startup/:id
router.delete("/:id", async (req, res) => {
  try {
    await Startup.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Startup deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;