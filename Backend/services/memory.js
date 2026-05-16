// Backend/src/services/memoryService.js
// WHY: Hindsight memory = storing key insights from past conversations
//      so future chats feel personalized. This is your biggest demo differentiator.

import Memory from '../models/Memory.js';

export async function saveMemory(startupId, insight, category) {
  return Memory.findOneAndUpdate(
    { startupId, category },
    { $push: { insights: { text: insight, createdAt: new Date() } } },
    { upsert: true, new: true }
  );
}

export async function getMemoryContext(startupId) {
  const memories = await Memory.find({ startupId }).lean();
  if (!memories.length) return '';
  
  const context = memories.flatMap(m =>
    m.insights.slice(-3).map(i => `[${m.category}] ${i.text}`)
  ).join('\n');
  
  return `\n\n--- Long-term memory about this startup ---\n${context}\n---`;
}