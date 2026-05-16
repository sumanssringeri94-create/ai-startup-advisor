// models/Chat.js
// ─────────────────────────────────────────────
// Schema for storing conversation history
// Each document = one user's entire chat thread
// Messages are stored as an array (chat memory)
// ─────────────────────────────────────────────

const mongoose = require("mongoose");

// ── Sub-schema for a single message in the thread ────────────────────────────
const messageSchema = new mongoose.Schema(
  {
    // "user" = message from the human; "assistant" = AI response
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    // The actual text content of the message
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // each message gets its own createdAt
  }
);

// ── Main chat schema ──────────────────────────────────────────────────────────
const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one chat document per user (append messages to it)
    },

    // Array of message objects — this IS the conversation history / memory
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
