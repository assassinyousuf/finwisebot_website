// Return recent predictions (simple public endpoint for admin UI)
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }
  try {
    await require('../../../lib/mongoose');
    const Prediction = require('../../../models/Prediction');
    const docs = await Prediction.find({}).sort({ createdAt: -1 }).limit(50).lean();
    res.status(200).json({ ok: true, docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
