// controllers/startupController.js
// ─────────────────────────────────────────────
// CRUD logic for a user's startup profile
// All routes here require a valid JWT (protected)
// ─────────────────────────────────────────────

const Startup = require("../models/Startup");

// ── POST /api/startup/create ──────────────────────────────────────────────────
// Create a new startup profile linked to the logged-in user
const createStartup = async (req, res, next) => {
  try {
    const { startupName, domain, targetAudience, budget, goals, strategies } = req.body;

    // Validate required fields
    if (!startupName || !domain || !targetAudience) {
      return res.status(400).json({
        success: false,
        message: "startupName, domain, and targetAudience are required.",
      });
    }

    // Prevent a user from creating duplicate startup profiles
    const existing = await Startup.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You already have a startup profile. Use the update endpoint instead.",
        startupId: existing._id,
      });
    }

    const startup = await Startup.create({
      userId: req.user._id,
      startupName,
      domain,
      targetAudience,
      budget: budget || 0,
      goals: goals || [],
      strategies: strategies || [],
    });

    res.status(201).json({
      success: true,
      message: "Startup profile created!",
      startup,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/startup/:userId ──────────────────────────────────────────────────
// Fetch the startup profile for a specific userId
const getStartup = async (req, res, next) => {
  try {
    const startup = await Startup.findOne({ userId: req.params.userId }).populate(
      "userId",
      "name email" // only pull name + email from the User document
    );

    if (!startup) {
      return res.status(404).json({
        success: false,
        message: "No startup profile found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      startup,
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/startup/update/:id ───────────────────────────────────────────────
// Update any fields of an existing startup profile
const updateStartup = async (req, res, next) => {
  try {
    const { startupName, domain, targetAudience, budget, goals, strategies } = req.body;

    // Build an object with only the fields that were sent
    const updates = {};
    if (startupName)    updates.startupName    = startupName;
    if (domain)         updates.domain         = domain;
    if (targetAudience) updates.targetAudience = targetAudience;
    if (budget !== undefined) updates.budget   = budget;
    if (goals)          updates.goals          = goals;
    if (strategies)     updates.strategies     = strategies;

    // findByIdAndUpdate with { new: true } returns the updated document
    const startup = await Startup.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!startup) {
      return res.status(404).json({
        success: false,
        message: "Startup profile not found.",
      });
    }

    // Make sure users can only edit their own startup
    if (startup.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorised to edit this startup profile.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Startup profile updated!",
      startup,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createStartup, getStartup, updateStartup };
