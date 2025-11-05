Demo password reset flow (frontend-only)

- The demo password-reset flow is implemented entirely client-side for testing.
- When you request a reset at `/reset/request` the app generates a demo reset token and displays it in the UI (no email is sent).
- Tokens are stored in localStorage under the key `finwise_mock_resets` and have the shape:

```json
{
  "<token>": { "email": "user@example.com", "createdAt": "...", "expiresAt": "..." }
}
```

- Tokens expire after 15 minutes (the UI shows the expiry time). The confirm page `/reset/confirm` accepts a token (query param or pasted) and will refuse expired tokens.
- This is demo-only behavior. In production you must implement server-side token generation, secure storage, email delivery, hashing, and single-use expiry logic.

How to test

1. Run the app: `npm run dev`
2. Visit `/reset/request`, enter an email, and generate a token.
3. Use the displayed token or click the link to go to `/reset/confirm?token=...` and complete the reset.

Storage key: `localStorage.getItem('finwise_mock_resets')` (JSON).