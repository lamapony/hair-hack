# OpenAI Engineering Checklist — Hair Hack

**Task:** TL.3 gate item (L1.5) + pre-production verification  
**Owner:** Engineering  
**Status:** Checklist — complete before `COUNSEL_LEGAL_APPROVED=true` on production

---

## Why

Prospect photos are sent to OpenAI Images API (`images.edit`). Counsel and clinics will ask about retention, training, and subprocessors. Record answers here before flipping the production legal gate.

---

## Organization settings (OpenAI dashboard)

Complete in [OpenAI Platform](https://platform.openai.com/) → **Settings** for the org/project that owns the production API key.

| # | Check | Done | Notes |
|---|-------|------|-------|
| 1 | **API data usage** — opt out of using API data for model training (if available for your plan) | ☐ | Policy varies by plan; screenshot date |
| 2 | **Zero Data Retention (ZDR)** or minimum retention for Images API | ☐ | Enterprise / negotiated terms if required |
| 3 | **DPA** executed with OpenAI (if required for EU clinics) | ☐ | Link to signed DPA / order form |
| 4 | **Subprocessor list** matches [COMPLIANCE.md](./COMPLIANCE.md) L-D7 | ☐ | OpenAI + Vercel documented |
| 5 | Production API key is **not** the shared dev key | ☐ | Rotate if dev key was ever used in prod |
| 6 | Usage limits / budget alerts configured | ☐ | Avoid runaway clinic demo cost |

---

## Application settings (this repo)

| # | Check | Done | Notes |
|---|-------|------|-------|
| 7 | `OPENAI_IMAGE_MODEL=gpt-image-2` (or counsel-approved model) | ☐ | `.env.example` |
| 8 | `IMAGE_PROVIDER=openai` on production | ☐ | Hairgen archived |
| 9 | Rate limits set (`RATE_LIMIT_PER_HOUR`, optional `DAILY_GENERATION_CAP`) | ☐ | |
| 10 | `LEGAL_PAGES_REQUIRED=true` only on production after counsel sign-off | ☐ | See TL.4 |
| 11 | `COUNSEL_LEGAL_APPROVED=true` only after Privacy/Terms approved | ☐ | Unlocks generate on prod |

---

## Verification steps

1. Run `npm run dev` with production-like env (do **not** commit secrets).
2. `curl -s http://localhost:3000/api/health | jq` — confirm `legal` block.
3. One test generation with a synthetic face photo; confirm no server-side persistence (MVP).
4. Archive screenshots of OpenAI org settings in team vault (not git).

---

## Sign-off

| Role | Name | Date |
|------|------|------|
| Engineering | | |
| Counsel (optional review of L1.5 answers) | | |

When complete, update the gate row in [COUNSEL-PACKAGE.md](./COUNSEL-PACKAGE.md) §7 and [COMPLIANCE.md](./COMPLIANCE.md).
