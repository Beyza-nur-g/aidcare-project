const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'aiduser',
  host: 'localhost',
  database: 'aidcaredb',
  password: 'aidpass',
  port: 5432,
});

// hasta ekleme
app.post('/patients', async (req, res) => {
  const { name, birth_date, gender } = req.body;
  try {
    await pool.query(
      'INSERT INTO patients (name, birth_date, gender) VALUES ($1, $2, $3)',
      [name, birth_date, gender]
    );
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('POST /patients error:', error);
    res.status(500).json({ error: error.message });
  }
});
// hasta güncelleme
app.put('/patients/:id', async (req, res) => {
  const { id } = req.params;
  const { name, birth_date, gender } = req.body;

  try {
    await pool.query(
      'UPDATE patients SET name = $1, birth_date = $2, gender = $3 WHERE id = $4',
      [name, birth_date, gender, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// hasta silme
app.delete('/patients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM patients WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/patients/:id/glucose', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM sugar_levels WHERE patient_id = $1 ORDER BY measured_at ASC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// hasta için yeni şeker ölçümü ekleme
app.post('/patients/:id/glucose', async (req, res) => {
  const { id } = req.params;
  const { sugar_value, measured_at } = req.body;

  try {
    await pool.query(
      'INSERT INTO sugar_levels (patient_id, sugar_value, measured_at) VALUES ($1, $2, $3)',
      [id, sugar_value, measured_at]
    );
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('POST /patients/:id/glucose error:', error);
    res.status(500).json({ error: error.message });
  }
});
// backend.js içine eklenmeli
app.delete('/patients/:id/glucose', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM sugar_levels WHERE patient_id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('DELETE /patients/:id/glucose error:', error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(3002, () => {
  console.log('Backend API is running on port 3002');
});
