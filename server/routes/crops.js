const express = require('express');
const router  = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try { res.json(await db.getCrops()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const crop = await db.getCropById(req.params.id);
    if (!crop) return res.status(404).json({ error: 'Crop not found' });
    res.json(crop);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, emoji, season, ph_range, water_needs, days_to_harvest, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    res.status(201).json(await db.createCrop({ name, emoji: emoji||'🌿', season, ph_range, water_needs, days_to_harvest, description }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await db.updateCrop(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Crop not found' });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.deleteCrop(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
