const express = require('express');
const { nanoid } = require('nanoid');
const { pool } = require('./db');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const short_code = nanoid(6);
  await pool.query(
    'INSERT INTO urls (short_code, original_url) VALUES ($1, $2)',
    [short_code, url]
  );

  res.json({
    short_code,
    short_url: `${process.env.BASE_URL}/${short_code}`,
    original_url: url
  });
});

router.get('/stats/:code', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM urls WHERE short_code = $1',
    [req.params.code]
  );
  if (result.rows.length === 0)
    return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
});

router.get('/:code', async (req, res) => {
  const { code } = req.params;
  const result = await pool.query(
    'SELECT original_url FROM urls WHERE short_code = $1',
    [code]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: 'URL not found' });

  await pool.query(
    'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
    [code]
  );

  res.redirect(result.rows[0].original_url);
});

module.exports = router;