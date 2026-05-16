const axios = require("axios");

const BASE_URL = "http://localhost:5000";

async function saveStartupMemory(userId, startupData) {
  try {
    const response = await axios.post(`${BASE_URL}/api/startup`, {
      userId,
      startupName: startupData.startupName,
      domain: startupData.domain,
      targetAudience: startupData.targetAudience,
      budget: startupData.budget,
    });
    console.log("✅ Startup memory saved for user:", userId);
    return response.data;
  } catch (error) {
    console.error("❌ Error saving startup memory:", error.message);
    return null;
  }
}

async function saveMessage(userId, role, content) {
  try {
    const response = await axios.post(`${BASE_URL}/api/chat`, {
      userId,
      role,
      content,
    });
    console.log(`✅ Message saved [${role}]`);
    return response.data;
  } catch (error) {
    console.error("❌ Error saving message:", error.message);
    return null;
  }
}

async function getStartupMemory(userId) {
  try {
    const response = await axios.get(`${BASE_URL}/api/startup/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching startup memory:", error.message);
    return null;
  }
}

async function getConversationHistory(userId) {
  try {
    const response = await axios.get(`${BASE_URL}/api/chat/${userId}`);
    const messages = response.data.messages || [];
    return messages.slice(-10);
  } catch (error) {
    console.error("❌ Error fetching conversation history:", error.message);
    return [];
  }
}

async function buildContext(userId) {
  const startup = await getStartupMemory(userId);
  const history = await getConversationHistory(userId);
  let context = "";
  if (startup) {
    context += `=== STARTUP PROFILE ===\n- Startup Name: ${startup.startupName || "Not provided"}\n- Industry: ${startup.domain || "Not provided"}\n- Target Audience: ${startup.targetAudience || "Not provided"}\n- Budget: $${startup.budget || 0}\n`;
  }
  if (history.length > 0) {
    context += `=== RECENT CONVERSATION ===\n${history.map(m => `${m.role === "user" ? "Founder" : "AI Advisor"}: ${m.content}`).join("\n")}`;
  }
  return context.trim();
}

async function buildAIPrompt(userId) {
  const context = await buildContext(userId);
  return `You are an expert AI Startup Advisor. Give personalized advice based on the founder's startup details.\n\n${context}\n\nAnswer the founder's question in a helpful and personalized way.`;
}

module.exports = {
  saveStartupMemory,
  saveMessage,
  getStartupMemory,
  getConversationHistory,
  buildContext,
  buildAIPrompt,
};
