export default function handler(req, res) {
  // Simple placeholder: echo the action and data for demo purposes
  if (req.method === 'POST') {
    const { action, email } = req.body;
    if (action === 'signup') {
      // Normally: create user, hash password, return JWT/session
      return res.status(200).json({ ok: true, message: `Signup placeholder for ${email}` });
    }
    if (action === 'login') {
      // Normally: verify credentials
      return res.status(200).json({ ok: true, message: `Login placeholder for ${email}` });
    }
    return res.status(400).json({ ok: false, error: 'Unknown action' });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
