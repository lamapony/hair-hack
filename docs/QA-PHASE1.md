# Phase 1 Exit QA — Hair Hack

**Date:** 2026-06-15  
**Environment:** `npm run dev` → http://localhost:3000  
**Tester:** Agent (browser + API curl)  
**Branch:** `main` (post PR #9 merge)

---

## Summary

| Area | Result | Notes |
|------|--------|-------|
| Home / clinic copy | ✅ Pass | Title, disclaimer, workflow steps visible |
| Goal picker | ✅ Pass | Density / Hairline / Full buttons selectable |
| Consent gating | ✅ Pass | Checkboxes disabled until photo; API rejects missing consent |
| Legal pages | ✅ Pass | `/privacy`, `/terms` load with DRAFT banner + back link |
| Generate E2E | ✅ Pass | Density goal: OpenAI preview + before/after slider (768×1024 viewport) |
| Cancel during load | ✅ Pass | "Cancel generation" aborts in-flight request; no preview shown |
| Tablet 768px+ | ✅ Pass | 768×1024 layout: workflow, consent, compare panel readable |
| Error: bad file | ✅ Pass | Non-image upload shows "Please select an image file" (no stack trace) |

**Verdict:** Automated + browser QA pass on dev (`localhost:3000`). **Remaining:** rubric pass on 3 local fixtures × 3 goals — [QA-RUBRIC.md](./QA-RUBRIC.md).

---

## Checks performed

### 1. Home page (`/`)

- [x] Page title: "Hair Hack — Clinic consultation demo"
- [x] Clinic-oriented headline and disclaimer footer
- [x] Three treatment goals rendered
- [x] Upload area visible with format hints
- [x] Four consent checkboxes present and **disabled** without photo
- [x] Generate button **disabled** without photo + consent

### 2. Goal selection

- [x] Hairline goal button receives focus / active state on click

### 3. API consent enforcement

```bash
POST /api/generate without consent → 400
{"error":"Staff consent is required before generating a preview."}
```

### 4. Legal pages

- [x] `/privacy` — DRAFT banner, sections (Who we are, Subprocessors, Retention, …)
- [x] `/terms` — DRAFT banner, sections (Service description, Clinic license, …)
- [x] Back link to clinic demo on both pages

---

## Manual checklist (tablet / clinic staff)

Run on iPad or 768px+ viewport with `OPENAI_API_KEY` in `.env.local`:

1. [x] Upload front-facing JPEG/PNG (≤8 MB) — agent: synthetic 64×64 PNG via file input
2. [x] Confirm all four consent checkboxes enable and must be checked
3. [ ] Generate for each goal (density, hairline, full) — density ✅; hairline/full need real-photo review
4. [x] Before/after slider — keyboard moves `aria-valuenow` (50 → 52 with ArrowRight)
5. [x] Cancel button aborts in-flight generation
6. [x] Upload invalid file (non-image) — "Please select an image file"
7. [x] Footer Privacy link → `/privacy` with DRAFT banner + back link

### Browser QA notes (2026-06-15)

- Viewport: **768×1024** (tablet portrait)
- Consent checkboxes: use native `.click()` after upload (synthetic viewport scroll issues with Playwright refs)
- Generate latency: ~30–90s for OpenAI `images.edit` on test image
- Terms link not re-tested this pass (Privacy verified)

---

## Automated test coverage (reference)

`npm test` — 50 unit tests including route validation, consent, rate limit, slider math, providers.
