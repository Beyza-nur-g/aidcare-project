const express = require('express');
const Redis = require('ioredis');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const redis = new Redis(); 


// GET /api/patients
app.get('/api/patients', async (req, res) => {
  const cacheKey = 'patients_list';
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log('Cache hit: patients');
    return res.json(JSON.parse(cached));
  }

  try {
    const response = await axios.get('http://localhost:3002/patients');
    await redis.setex(cacheKey,60, JSON.stringify(response.data));
    console.log('Cache miss: patients');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patients/:id/glucose
app.get('/api/patients/:id/glucose', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `sugar-levels:patientId=${id}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log(`Cache hit: sugar-levels:patientId=${id}`);
    return res.json(JSON.parse(cached));
  }

  try {
    const response = await axios.get(`http://localhost:3002/patients/${id}/glucose`);
    await redis.setex(cacheKey,60, JSON.stringify(response.data));
    console.log(`Cache miss: sugar-levels:patientId=${id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// POST /api/patients/:id/glucose → Proxy üzerinden şeker verisi ekleme
app.post('/api/patients/:id/glucose', express.json(), async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const response = await axios.post(
      `http://localhost:3002/patients/${id}/glucose`,
      data
    );

    const cacheKey = `sugar-levels:patientId=${id}`;
    await redis.del(cacheKey);

    console.log(`Cache cleared: ${cacheKey}`);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('POST /api/patients/:id/glucose proxy error:', error.message);
    res.status(500).json({ error: error.message });
  }
});
// POST /api/patients/login → TC ile hasta girişi (cache gerekmez)
app.post('/api/patients/login', express.json(), async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3002/patients/login', req.body);
    res.json(response.data);
  } catch (error) {
    console.error('POST /api/patients/login proxy error:', error.message);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/patients/:id/appointments", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `appointments:${id}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const response = await axios.get(
      `http://localhost:3002/api/patients/${id}/appointments`
    );

    await redis.set(cacheKey, JSON.stringify(response.data), "EX", 60);
    res.json(response.data);
  } catch (err) {
    console.error("Proxy appointments error:", err);
    res.status(500).json({ error: "Proxy sunucu hatası" });
  }
});

// AidCare mesajlarını getirme
app.get("/api/patients/:id/messages", async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:3002/patients/${req.params.id}/messages`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Mesajlar alınamadı" });
  }
});

// AidCare mesajı gönderme
app.post("/api/patients/:id/messages", async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  try {
    const response = await axios.post(`http://localhost:3002/patients/${id}/messages`, { message });
    res.json(response.data);
  } catch (err) {
    console.error("Proxy mesaj gönderme hatası:", err.message);
    res.status(500).json({ error: "Mesaj gönderilemedi" });
  }
});

app.listen(3001, () => {
  console.log('Proxy server running on port 3001');
});
