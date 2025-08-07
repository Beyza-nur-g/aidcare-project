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
  const { name, birth_date, gender, tc } = req.body;

  try {
    await pool.query(
  'INSERT INTO patients (name, birth_date, gender, tc) VALUES ($1, $2, $3, $4)',
  [name, birth_date, gender, tc]
 );
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('POST /patients error:', error);
    res.status(500).json({ error: error.message });
  }
});
// hasta giriş (TC ile)
app.post('/patients/login', async (req, res) => {
  const { tc } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM patients WHERE tc = $1',
      [tc]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hasta bulunamadı' });
    }

    const patient = result.rows[0];
    res.json({
      id: patient.id,
      name: patient.name,
      birth_date: patient.birth_date,
      gender: patient.gender,
      tc: patient.tc
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'TC numarası zaten kayıtlı.' });
    }
    console.error('POST /patients/login error:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// hasta güncelleme
app.put('/patients/:id', async (req, res) => {
  const { id } = req.params;
  const { name, birth_date, gender,tc } = req.body;

  try {
    await pool.query(
      'UPDATE patients SET name = $1, birth_date = $2, gender = $3, tc = $4 WHERE id = $5',
      [name, birth_date, gender, tc, id]
   );
    res.json({ success: true });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'TC numarası zaten kayıtlı.' });
    }
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
// GET: Belirli hastanın randevularını getir
app.get("/api/patients/:id/appointments", async (req, res) => {
  const patientId = req.params.id;

  try {
    const result = await pool.query(
      "SELECT * FROM appointments WHERE patient_id = $1",
      [patientId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Randevu verisi alınamadı:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// GET: Mesajları getir
app.get("/patients/:id/messages", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "SELECT * FROM messages WHERE patient_id = $1 ORDER BY id DESC",
    [id]
  );
  res.json(result.rows);
});

// POST: Yeni mesaj ekle
app.post("/patients/:id/messages", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO messages (patient_id, message) VALUES ($1, $2) RETURNING *",
      [id, message]
    );
    console.log("Gelen mesaj verisi:", req.body);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Backend mesaj ekleme hatası:", err.message);
    res.status(500).json({ error: "Mesaj eklenemedi" });
  }
});

app.listen(3002, () => {
  console.log('Backend API is running on port 3002');
});
