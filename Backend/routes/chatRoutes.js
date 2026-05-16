// routes/chatRoutes.js
// ─────────────────────────────────────────────
// Chat / conversation history endpoints (all protected):
//   POST   /api/chat/save              — save a user+AI message pair
//   GET    /api/chat/history/:userId   — get full chat history
//   DELETE /api/chat/clear             — clear chat history
// ─────────────────────────────────────────────

const express = require("express");
const router  = express.Router();

const { saveChat, getChatHistory, clearChatHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

router.post("/save",               protect, saveChat);
router.get("/history/:userId",     protect, getChatHistory);
router.delete("/clear",            protect, clearChatHistory);

module.exports = router;
