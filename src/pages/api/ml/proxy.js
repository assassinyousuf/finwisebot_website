// Proxy the Next.js backend to the ML microservice and persist predictions
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
  try {
    const r = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await r.json();

    // persist prediction to MongoDB
    try {
      await require('../../../lib/mongoose');
      const Prediction = require('../../../models/Prediction');
      const doc = await Prediction.create({ input: req.body, output: data, meta: { proxied: true } });
      return res.status(200).json({ ok: true, data, id: doc._id });
    } catch (dbErr) {
      console.error('DB save failed', dbErr);
      // still return ML response even if DB save fails
      return res.status(200).json({ ok: true, data, saved: false, error: String(dbErr) });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
