require('dotenv').config();
const express   = require('express');
const router    = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const db        = require('../db');

// Use the correct, valid model string
const MODEL = 'claude-sonnet-4-6';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ADVISOR_SYSTEM = `You are Shamba AI, an expert agricultural advisor for smallholder farmers in Kenya and East Africa, especially Kisii County (highlands 1500-2000m altitude). You have deep expertise in:
- Local crop varieties and optimal growing conditions for Kisii highlands
- Common pests, diseases, and organic or affordable treatments
- Soil management with locally available and affordable resources
- Market timing and post-harvest handling techniques
- Climate-smart farming and water conservation
- Kenya government agricultural programs and subsidies in Kenya

Response style: warm, practical, encouraging. Use simple language. Give specific, actionable advice. Mention costs in Kenyan Shillings where relevant. Keep responses 150-300 words. Use numbered steps for procedures. Prioritize the most critical information first.`;

const DOCTOR_SYSTEM = `You are a Crop Disease and Pest Specialist for East African smallholder farming. Based on the described symptoms, diagnose the likely crop disease or pest and provide a structured response with these sections:

**Diagnosis** — most likely disease or pest (be specific)
**Confidence** — High / Medium / Low
**Immediate Action** — what to do TODAY to stop spread
**Organic Treatment** — affordable local methods using plants, ash, soap, neem etc.
**Chemical Treatment** — specific product names available in Kenya with approximate KES cost
**Prevention** — how to avoid this problem next season
**Spread Risk** — will it affect neighboring plants?

Be practical and specific. Keep response under 380 words.`;

// ── POST /api/ai/advisor ─────────────────────────────────────────────────────
router.post('/advisor', async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set. Add it in Railway environment variables.' });
    }

    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const messages = [
      ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: ADVISOR_SYSTEM,
      messages,
    });

    const reply = response.content[0].text;
    db.logQuery('advisor', message, reply).catch(() => {});
    res.json({ reply });

  } catch (err) {
    console.error('AI Advisor error:', err.message);
    const msg = err.status === 401
      ? 'Invalid ANTHROPIC_API_KEY. Check your Railway environment variables.'
      : err.status === 429
      ? 'Rate limit reached. Please wait a moment and try again.'
      : err.message || 'AI service error. Please try again.';
    res.status(500).json({ error: msg });
  }
});

// ── POST /api/ai/doctor ──────────────────────────────────────────────────────
router.post('/doctor', async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set. Add it in Railway environment variables.' });
    }

    const { crop, symptoms = [], description } = req.body;

    if (!crop && !symptoms.length && !description) {
      return res.status(400).json({ error: 'Please provide at least a crop name, symptoms, or description.' });
    }

    const userMessage = `Crop affected: ${crop || 'Unknown'}
Observed symptoms: ${symptoms.length ? symptoms.join(', ') : 'None specified'}
Additional details: ${description || 'None provided'}
Farm location: Kisii County, Kenya highlands (1500-2000m altitude)`;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: DOCTOR_SYSTEM,
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = response.content[0].text;
    db.logQuery('doctor', userMessage, reply).catch(() => {});
    res.json({ reply });

  } catch (err) {
    console.error('AI Doctor error:', err.message);
    const msg = err.status === 401
      ? 'Invalid ANTHROPIC_API_KEY. Check your Railway environment variables.'
      : err.status === 429
      ? 'Rate limit reached. Please wait a moment and try again.'
      : err.message || 'AI service error. Please try again.';
    res.status(500).json({ error: msg });
  }
});

module.exports = router;
