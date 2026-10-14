const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events ORDER BY event_date ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load events. Check your database setup.' });
  }
});

router.post('/', async (req, res) => {
  const { title, description = '', event_date, venue, category = 'General' } = req.body || {};
  if (!title || !event_date || !venue) return res.status(400).json({ error: 'title, event_date, and venue are required.' });
  try {
    const [result] = await db.query(
      'INSERT INTO events (title, description, event_date, venue, category) VALUES (?, ?, ?, ?, ?)',
      [title, description, event_date, venue, category]
    );
    res.status(201).json({ id: result.insertId, title, description, event_date, venue, category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create event.' });
  }
});

router.post('/:id/register', async (req, res) => {
  const { student_name, student_email } = req.body || {};
  if (!student_name || !student_email) return res.status(400).json({ error: 'student_name and student_email are required.' });
  try {
    const [result] = await db.query(
      'INSERT INTO registrations (event_id, student_name, student_email) VALUES (?, ?, ?)',
      [req.params.id, student_name, student_email]
    );
    res.status(201).json({ message: 'Registration successful.', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'This email is already registered for this event.' });
    if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(404).json({ error: 'Event not found.' });
    console.error(err);
    res.status(500).json({ error: 'Could not register for this event.' });
  }
});
module.exports = router;
