// Backend/src/utils/prompts.js
// WHY: Centralizing prompts = consistent AI quality + easy to tune before demo.

export function buildAdvisorSystemPrompt(startup, memoryContext = '') {
  return `You are AdvisorAI, an elite startup advisor with expertise in product strategy, 
fundraising, go-to-market, and scaling. You are advising ${startup.name}, a ${startup.stage} 
stage startup in the ${startup.industry} space.

About this startup:
- Description: ${startup.description}
- Target market: ${startup.targetMarket}
- Current MRR: ${startup.mrr || 'Pre-revenue'}
- Team size: ${startup.teamSize || 'Unknown'}
${memoryContext}

Be direct, specific, and actionable. Give advice like a top-tier YC partner would. 
Never give generic advice. Always tie recommendations to their specific context.`;
}

export function buildRoadmapPrompt(startup) {
  return `Generate a detailed 90-day startup roadmap for ${startup.name}.
Stage: ${startup.stage}. Industry: ${startup.industry}.
Format as JSON with structure:
{ "weeks": [{ "week": 1, "focus": "...", "tasks": ["..."], "milestone": "..." }] }
Be specific and realistic for their stage.`;
}

export function buildCompetitorPrompt(startup) {
  return `Analyze the competitive landscape for a startup in ${startup.industry} 
targeting ${startup.targetMarket}. 
Return JSON: { "competitors": [{ "name": "...", "strength": "...", "weakness": "...", 
"differentiator": "..." }], "whitespace": "...", "positioning": "..." }`;
}

export function buildPricingPrompt(startup) {
  return `Recommend a pricing strategy for ${startup.name}.
Industry: ${startup.industry}. Stage: ${startup.stage}. 
Target customer: ${startup.targetMarket}.
Return JSON: { "model": "...", "tiers": [{ "name": "...", "price": "...", "features": ["..."] }],
"rationale": "...", "psycology": "..." }`;
}

export function buildHealthScorePrompt(startup) {
  return `Score this startup's health (0-100) across 6 dimensions.
Startup: ${JSON.stringify(startup)}
Return JSON: { "overall": 72, "product": 80, "market": 65, "team": 70, 
"traction": 60, "finance": 75, "execution": 78, "summary": "..." }`;
}