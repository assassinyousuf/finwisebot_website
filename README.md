# finwisebot_website — Frontend demo

This repository contains a frontend-only demo of the FinWisebot marketing site. The UI is interactive and uses a localStorage-backed mock API so you can try features without a backend.

Quick start (Windows PowerShell):

```powershell
npm ci
npm run dev
```

Build for production:

```powershell
npm run build
npm run start
```

Notes
- The site is client-side demo-first. Interactive features (auth, chat, predictions) use `src/lib/mockApi.js` and persist to browser localStorage.
- Dark/light theme is available via the theme toggle in the navbar. Preference is saved in localStorage.
- The `langui` subfolder contains component previews and is wired to return demo data (no server required).

If you want to reintroduce a backend later, replace `mockApi` calls with real API endpoints.

Next improvements you might add:
- Add a settings page to select theme explicitly (system/dark/light).
- Add E2E tests and linting in CI.
- Replace mock API data with a real backend and secure auth.

---
Generated UI improvements applied: nav, hero, forms, theme, inputs, cards, chat and prediction widgets.
