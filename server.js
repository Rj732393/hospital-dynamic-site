const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sql, poolPromise } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Static files serve karo (tumhari html/css/js)
app.use(express.static('public'));

// ── Test route: DB se connection check karne ke liye ──
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT GETDATE() AS currentTime');
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});