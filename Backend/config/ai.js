// Backend/src/config/ai.js
// WHY: Single routing layer for all AI calls. Groq = speed for demo, Ollama = fallback/privacy mode.

import Groq from 'groq-sdk';
import fetch from 'node-fetch';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function routeAI({ messages, useLocal = false, model }) {
  if (useLocal || process.env.AI_MODE === 'local') {
    // Ollama fallback
    const res = await fetch(`${process.env.OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'llama3',
        messages,
        stream: false,
      }),
    });
    const data = await res.json();
    return data.message?.content;
  }

  // Groq (fast, great for demos)
  const completion = await groq.chat.completions.create({
    model: model || 'llama3-8b-8192',
    messages,
    max_tokens: 1024,
  });
  return completion.choices[0]?.message?.content;
}