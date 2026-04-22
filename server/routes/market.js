const express = require('express');
const router  = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try { res.json(await db.getMarket()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { crop_name, unit, price, change_percent, demand } = req.body;
    if (!crop_name || !price) return res.status(400).json({ error: 'crop_name and price required' });
    res.status(201).json(await db.createMarket({ crop_name, unit, price: parseInt(price), change_percent: parseFloat(change_percent)||0, demand: demand||'Medium' }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { crop_name, unit, price, change_percent, demand } = req.body;
    const updated = await db.updateMarket(req.params.id, { crop_name, unit, price: parseInt(price), change_percent: parseFloat(change_percent)||0, demand });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.deleteMarket(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
