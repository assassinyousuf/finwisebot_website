# FinWisebot — 3-phase Roadmap (short)

This roadmap maps the current frontend-only demo to staged backend and product work. Timelines are rough estimates for a small team (1–2 engineers + 1 designer) and assume iterative delivery.

## Phase 1 — Demo polish & interactive UX (current)
Goal: Harden the frontend demo so it convincingly showcases core product value without a backend.

Priority: High
Estimated effort: 1–2 weeks

Key items:
- Finalize PeekoChat UI: citations, RAG simulation, conversation history, and signal integration.
- Complete Signal Generator + DemoVisualizer interactions (client-only signals). (Done)
- Profile & account demo flows: user page, change/reset password, avatar (localStorage-backed). (Done)
- Accessibility and responsive polish (mobile-first). (In progress)
- Lightweight backtest visual placeholder for demo results.

Success criteria:
- Demo can be used in sales/POC without any server.
- All interactions persist in localStorage and survive reloads.

## Phase 2 — Minimal backend & RAG service
Goal: Replace mock behaviors with lightweight services to run reproducible RAG and chat.

Priority: Medium
Estimated effort: 4–8 weeks

Key items:
- Small API service: auth, users, chats, docs store (Node/Express or Next.js API routes).
- RAG pipeline: vector store (FAISS/Weaviate or SQLite+pgvector), document ingestion, and retrieval endpoint.
- LLM proxy: configurable LLM provider adapter and request moderation & caching.
- Backtest microservice: run simple strategies server-side with CSV upload support and return metrics.
- Secure API key & admin UI: admin-only flows for keys & model configuration.

Success criteria:
- Demo can be run in a semi-real mode using small hosted infra (single VM + managed DB).
- RAG retrieval improves answer faithfulness; citations link to real documents.

## Phase 3 — Production & integrations
Goal: Scale features, observability, and third-party integrations for real users.

Priority: Medium→Low (after validating product-market fit)
Estimated effort: 8–16 weeks

Key items:
- Multi-tenant architecture and user management (teams, quotas).
- Broker integrations: order routing, live market feeds (low-latency options).
- Model fine-tuning & LoRA workflows for domain-adapted models.
- End-to-end testing, monitoring, and cost-control (rate limiting, caching).
- Compliance & security: data export, audit logs, and encryption at rest.

Success criteria:
- Stable public deployment with monitored pipelines, billing, and integrations.

---

If you'd like, I can expand Phase 2 into a concrete tech stack and API contract (endpoints and data shapes) and create skeleton server repo files for the most critical services (auth, docs ingestion, RAG retrieval).