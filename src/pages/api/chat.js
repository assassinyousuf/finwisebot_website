export default function handler(req, res) {
  if (req.method === 'POST') {
    const { query } = req.body;

    // Placeholder response for demo
    res.status(200).json({ answer: `You asked: "${query}". (FinWisebot response placeholder)` });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
