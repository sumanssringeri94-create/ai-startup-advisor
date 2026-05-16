// models/Startup.js
// ─────────────────────────────────────────────
// Schema for a user's startup information
// Linked to User via userId (ObjectId ref)
// ─────────────────────────────────────────────

const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema(
  {
    // Reference to the owner — lets us do .populate("userId")
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
       unique: true, 
    },

    startupName: {
      type: String,
      required: [true, "Startup name is required"],
      trim: true,
    },

    // Industry / niche (e.g. "HealthTech", "EdTech", "SaaS")
    domain: {
      type: String,
      required: [true, "Domain / industry is required"],
      trim: true,
    },

    // Who the startup is building for
    targetAudience: {
      type: String,
      required: [true, "Target audience is required"],
      trim: true,
    },

    // Monthly or total budget in USD (stored as a number)
    budget: {
      type: Number,
      default: 0,
    },

    // Array of goal strings — e.g. ["Launch MVP", "Get 100 users"]
    goals: {
      type: [String],
      default: [],
    },

    // Free-form strategy notes saved by the AI or user
    strategies: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Startup", startupSchema);
