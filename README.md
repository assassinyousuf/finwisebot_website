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