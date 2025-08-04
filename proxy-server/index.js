const express = require('express');
const Redis = require('ioredis');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const redis = new Redis(); // localhost:6379 default

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
  const cacheKey = `glucose_${id}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log(`Cache hit: glucose_${id}`);
    return res.json(JSON.parse(cached));
  }

  try {
    const response = await axios.get(`http://localhost:3002/patients/${id}/glucose`);
    await redis.setex(cacheKey,60, JSON.stringify(response.data));
    console.log(`Cache miss: glucose_${id}`);
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


app.listen(3001, () => {
  console.log('Proxy server running on port 3001');
});
