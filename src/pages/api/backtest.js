export default function handler(req, res) {
  if (req.method === 'POST') {
    // Placeholder: return fake time-series data
    const series = Array.from({ length: 30 }).map((_, i) => ({
      date: `2025-10-${String(i + 1).padStart(2, '0')}`,
      value: 100 + Math.round(Math.sin(i / 3) * 10 + Math.random() * 5)
    }));
    res.status(200).json({ series });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
