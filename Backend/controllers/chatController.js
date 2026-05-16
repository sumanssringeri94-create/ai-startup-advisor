// controllers/chatController.js
// ─────────────────────────────────────────────
// Save and retrieve conversation history (chat memory)
// One Chat document per user — messages are appended to the array
// ─────────────────────────────────────────────

const Chat = require("../models/Chat");

// ── POST /api/chat/save ───────────────────────────────────────────────────────
// Append a user message + AI response to this user's chat history
//
// Expected request body:
// {
//   "userMessage": "How do I find my first customer?",
//   "aiResponse":  "Great question! Start by..."
// }
const saveChat = async (req, res, next) => {
  try {
    const { userMessage, aiResponse } = req.body;

    if (!userMessage || !aiResponse) {
      return res.status(400).json({
        success: false,
        message: "Both userMessage and aiResponse are required.",
      });
    }

    // Build the two message objects to append
    const newMessages = [
      { role: "user",      content: userMessage },
      { role: "assistant", content: aiResponse  },
    ];

    // findOneAndUpdate with upsert:true → creates the doc if it doesn't exist yet
    const chat = await Chat.findOneAndUpdate(
      { userId: req.user._id },
      { $push: { messages: { $each: newMessages } } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Chat saved successfully.",
      // Return only the last two messages to keep the response lean
      latestMessages: chat.messages.slice(-2),
      totalMessages: chat.messages.length,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/chat/history/:userId ─────────────────────────────────────────────
// Retrieve the full conversation history for a user
const getChatHistory = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ userId: req.params.userId });

    if (!chat) {
      // It's fine — user just hasn't chatted yet
      return res.status(200).json({
        success: true,
        messages: [],
        message: "No chat history found. Start a conversation!",
      });
    }

    res.status(200).json({
      success: true,
      messages: chat.messages,
      totalMessages: chat.messages.length,
      updatedAt: chat.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/chat/clear  (bonus endpoint) ──────────────────────────────────
// Clear the logged-in user's entire chat history
const clearChatHistory = async (req, res, next) => {
  try {
    await Chat.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { messages: [] } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Chat history cleared.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { saveChat, getChatHistory, clearChatHistory };
