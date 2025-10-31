# finwisebot_website

Starter Next.js + Tailwind scaffold for the FinWisebot marketing/demo site.

How to run (Windows PowerShell):

```powershell
npm install
npm run dev
```

Notes:
- Pages are under `src/pages` (Next.js supported). API placeholders live in `src/pages/api`.
- Replace the placeholder API handlers with your LangChain/RAG/LoRA backend when ready.
- Replace the placeholder API handlers with your LangChain/RAG/LoRA backend when ready.
- Replace the placeholder API handlers with your LangChain/RAG/LoRA backend when ready.

Deploying on Netlify (Next.js)

This repository is configured to deploy on Netlify using the official Next.js plugin. The repository includes `netlify.toml` and Netlify will use the plugin to build pages and serverless functions for API routes.

Quick steps to deploy:
1. Push this repo to GitHub (already done).
2. Sign in to Netlify and click "New site from Git" → choose GitHub and select this repo.
3. In Netlify's build settings, use the defaults (the plugin will run). Build command: `npm run build`. Publish directory: `.next`.
4. Ensure the plugin `@netlify/plugin-nextjs` is installed automatically by Netlify (it reads `netlify.toml` and installs it during build). You don't need to add it locally unless you want to test.
5. Add any environment variables in Netlify's dashboard under Site settings → Build & deploy → Environment.

If you prefer a static export (no serverless APIs), you can use `next export` and set the publish directory to `out` instead. Note: `next export` requires all pages to be static and does not support Next API routes.

Develop without installing Node (VS Code Dev Container)

If you prefer not to install Node/npm on your machine you can use the included VS Code Dev Container.
Requirements: Docker Desktop and the VS Code Remote - Containers extension.

1. Install Docker Desktop and start it.
2. In VS Code install the "Dev Containers" (Remote - Containers) extension.
3. Open this folder in VS Code and choose "Reopen in Container" from the command palette.
4. The container will run `npm install` automatically (post-create). Forwarded port: 3000.

After the container starts you can run:

```bash
npm run dev
```

Open http://localhost:3000 in your browser (or the forwarded port shown by the container).

# finwisebot_website