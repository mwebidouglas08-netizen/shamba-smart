const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const db = require('../db');
const { requireAuth, signToken } = require('../middleware/auth');

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUsername = await db.getAdminUsername();
    const adminHash     = await db.getAdminHash();

    if (username !== adminUsername || !bcrypt.compareSync(password, adminHash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signToken({ username, role: 'admin' });
    res.json({ token, username });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/admin/stats
router.get('/stats', requireAuth, async (req, res) => {
  try { res.json(await db.getStats()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/admin/queries
router.get('/queries', requireAuth, async (req, res) => {
  try { res.json(await db.getQueries(200)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/admin/messages
router.get('/messages', requireAuth, async (req, res) => {
  try { res.json(await db.getMessages()); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/admin/messages/:id
router.put('/messages/:id', requireAuth, async (req, res) => {
  try {
    const updated = await db.updateMessage(req.params.id, req.body.status);
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/admin/messages (farmer contact)
router.post('/messages', async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });
    res.status(201).json(await db.createMessage({ name, phone, message }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
