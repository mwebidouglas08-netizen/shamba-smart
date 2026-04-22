const express = require('express');
const router  = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const db = require('../db');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ADVISOR_SYSTEM = `You are Shamba AI, an expert agricultural advisor for smallholder farmers in Kenya and East Africa, especially Kisii County (highlands 1500-2000m altitude). You have deep expertise in:
- Local crop varieties and optimal growing conditions for Kisii highlands
- Common pests, diseases, and organic/affordable treatments
- Soil management with locally available and affordable resources
- Market timing and post-harvest handling techniques
- Climate-smart farming and water conservation
- Kenya government agricultural programs and subsidies

Response style: warm, practical, encouraging. Use simple language. Give specific, actionable advice. Mention costs in Kenyan Shillings where relevant. Keep responses 150-300 words. Use numbered steps for procedures. Prioritize most critical information first.`;

const DOCTOR_SYSTEM = `You are a Crop Disease and Pest Specialist for East African smallholder farming. Diagnose based on described symptoms and provide:

1. **Diagnosis**: Most likely disease or pest (be specific)
2. **Confidence**: High / Medium / Low
3. **Immediate Action**: What to do TODAY
4. **Organic Treatment**: Affordable local methods (mention specific plants, ash, soap etc)
5. **Chemical Treatment**: Specific product names available in Kenya with approx KES cost
6. **Prevention**: How to avoid next season
7. **Spread Risk**: Will it affect neighboring plants?

Be practical and specific. Keep response under 350 words. Use bold headers.`;

// POST /api/ai/advisor
router.post('/advisor', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const messages = [
      ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 600,
      system: ADVISOR_SYSTEM,
      messages,
    });

    const reply = response.content[0].text;
    await db.logQuery('advisor', message, reply).catch(() => {});
    res.json({ reply });
  } catch (err) {
    console.error('AI Advisor error:', err.message);
    res.status(500).json({ error: 'AI service unavailable. Check ANTHROPIC_API_KEY.' });
  }
});

// POST /api/ai/doctor
router.post('/doctor', async (req, res) => {
  try {
    const { crop, symptoms, description } = req.body;
    const userMessage = `Crop affected: ${crop || 'Unknown'}
Symptoms: ${(symptoms || []).join(', ')}
Additional details: ${description || 'None provided'}
Location: Kisii County, Kenya highlands (1500-2000m)`;

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 700,
      system: DOCTOR_SYSTEM,
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = response.content[0].text;
    await db.logQuery('doctor', userMessage, reply).catch(() => {});
    res.json({ reply });
  } catch (err) {
    console.error('AI Doctor error:', err.message);
    res.status(500).json({ error: 'AI service unavailable. Check ANTHROPIC_API_KEY.' });
  }
});

module.exports = router;
