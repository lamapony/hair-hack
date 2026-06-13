# Tasks: Hair Hack

**Backlog for Phase 1** (Foundation). Status: `pending` until spec assumptions confirmed.

Format: each task is one focused session with acceptance criteria + verification.

---

## Phase 1.0 — Team setup

### T1.0.1 Git + GitHub

**Acceptance:**
- Remote `origin` → `https://github.com/lamapony/hair-hack.git`
- Initial commit pushed to `main`
- Collaborators invited on GitHub
- [COLLABORATION.md](./COLLABORATION.md) linked from README

**Verify:** teammate can `git clone`, `npm install`, `npm run dev` with their own `.env.local`

---

## Phase 1.1 — Testing foundation

### T1.1.1 Add Vitest

**Acceptance:**
- `vitest` + `@vitejs/plugin-react` in devDependencies
- `npm test` runs Vitest
- `vitest.config.ts` resolves `@/` alias like Next.js

**Verify:** `npm test` exits 0 with placeholder test

---

### T1.1.2 Unit tests for validation helpers

**Acceptance:**
- Extract `parseDataUrl`, `extensionForMime` to `src/lib/image.ts`
- Tests: valid JPEG/PNG/WebP, oversize rejection, invalid mime, malformed base64
- Route imports from `image.ts`

**Verify:** `npm test -- image` all green

---

### T1.1.3 Unit tests for prompts

**Acceptance:**
- `buildPrompt` returns non-empty string for each goal
- Prompts mention preserving face/lighting (regression guard)

**Verify:** `npm test -- prompts`

---

### T1.1.4 API route tests (mocked OpenAI)

**Acceptance:**
- Mock `openai.images.edit`
- Cases: missing key → 500, bad body → 400, invalid goal → 400, success → 200 shape

**Verify:** `npm test -- route`

---

## Phase 1.2 — API hardening

### T1.2.1 Shared validation module

**Acceptance:**
- `src/lib/validate.ts` exports `validateGenerateRequest(body)`
- Returns `{ ok: true, data }` or `{ ok: false, error, status }`
- Used by API route only (client keeps UX checks)

**Verify:** tests + `npm run build`

---

### T1.2.2 User-safe error mapping

**Acceptance:**
- Map OpenAI errors: 429 → "Too many requests", content policy → clear message, timeout → retry hint
- Never expose raw stack or API key hints

**Verify:** unit tests with mocked error types

---

### T1.2.3 Client image resize (optional)

**Acceptance:**
- Before upload, resize to max 2048px longest edge (canvas)
- Reduces payload and timeout risk
- Falls back gracefully if resize fails

**Verify:** manual test with 12 MP photo; network tab shows smaller payload

---

## Phase 1.3 — Rate limiting

### T1.3.1 IP rate limit middleware

**Acceptance:**
- `/api/generate` limited (e.g. 10/hour/IP in prod)
- 429 response with `Retry-After` when exceeded
- Bypass in dev via `RATE_LIMIT_DISABLED=true`

**Verify:** test script or unit test with mocked limiter

---

### T1.3.2 Document env vars

**Acceptance:**
- `.env.example` lists `RATE_LIMIT_PER_HOUR`, `DAILY_GENERATION_CAP`, `RATE_LIMIT_DISABLED`

**Verify:** README table matches

---

## Phase 1.4 — UX & i18n

### T1.4.1 Before/after slider

**Acceptance:**
- Replace or augment side-by-side with draggable slider on result view
- Works on touch (375px)
- Keyboard accessible (range input)

**Verify:** manual mobile + desktop; `frontend-ui-engineering` checklist

---

### T1.4.2 Consent + disclaimer (clinic)

**Acceptance:**
- Checkbox required: prospect agreed; illustrative only; not medical advice; photo processed by OpenAI
- Disclaimer visible without scrolling on 768px landscape (typical tablet)
- Copy addresses clinic staff ("before showing the client…")

**Verify:** generate blocked until checked

---

### T1.4.3 Clinic-oriented copy pass

**Acceptance:**
- Header/subtitle reflect in-clinic demo (not consumer app)
- Footer disclaimer + link placeholder for privacy policy
- English only — no i18n layer

**Verify:** read-through with SPEC personas

---

### T1.4.4 Loading UX

**Acceptance:**
- AbortController cancels in-flight request on unmount or "Cancel"
- Elapsed time shown after 30s

**Verify:** manual cancel during slow request

---

## Phase 1.5 — CI

### T1.5.1 GitHub Actions

**Acceptance:**
- `.github/workflows/ci.yml`: `npm ci`, `npm run build`, `npm test` on PR + main
- No secrets required for CI (OpenAI mocked in tests)

**Verify:** push branch, CI green

---

## Track 3D — API evaluation (parallel)

### T3D.1 Hairgen.ai spike

**Acceptance:**
- API key obtained; 5 fixture photos rendered
- Scores filled in [3D-API-EVAL.md](./3D-API-EVAL.md) rubric
- Go/no-go recommendation written

**Verify:** comparison doc committed (no patient PII)

---

### T3D.2 Provider adapter design

**Acceptance:**
- `src/lib/providers/types.ts` — `ImageProvider` interface
- OpenAI implementation wraps current route logic
- Hairgen stub or implementation if T3D.1 = go

**Verify:** `npm run build`; feature flag `IMAGE_PROVIDER=openai|hairgen`

---

### T3D.3 Force HT / enterprise outreach (optional)

**Acceptance:**
- Contact sent; pricing + API/embed options documented in 3D-API-EVAL.md

---

## Track LEGAL — compliance (parallel)

See [legal/COMPLIANCE.md](./legal/COMPLIANCE.md) for full risk register.

### TL.1 Consent UI (engineering)

**Acceptance:** Four staff attestation checkboxes per COMPLIANCE.md; generate blocked until all checked.

**Maps to:** T1.4.2

---

### TL.2 Policy pages

**Acceptance:**
- `/privacy` and `/terms` routes with counsel-approved placeholder or final text
- Linked from consent flow and footer

---

### TL.3 Counsel review package

**Acceptance:**
- Export: SPEC objective, data flow diagram, COMPLIANCE.md, sample screenshots
- Sent to legal counsel; feedback tracked as GitHub issues `legal-*`

---

### TL.4 Deploy gate

**Acceptance:**
- `LEGAL_PAGES_URL` env or build check fails deploy if privacy/terms empty in production

---

## Phase 2 preview (not scheduled)

| ID | Task | Depends |
|----|------|---------|
| T2.1 | localStorage history (max 10) | Phase 1 |
| T2.2 | Share/download with watermark | T2.1 |
| T2.3 | `docs/QA-RUBRIC.md` + fixture set | T1.4.1 |
| T2.4 | Vercel Analytics | Phase 1 ship prep |
| T2.5 | Admin prompt variants (env-gated) | T1.1 |

---

## Suggested implementation order

0. **T1.0.1** — git + GitHub (unblocks team)
1. T1.1.1 → T1.1.2 → T1.1.3 → T1.2.1 → T1.1.4
2. T1.2.2 → T1.3.1 → T1.3.2
3. T1.4.2 → T1.4.1 → T1.4.3 → T1.4.4
4. T1.5.1
5. T1.2.3 if timeouts observed in QA

---

## Definition of done (per task)

- [ ] Acceptance criteria met
- [ ] `npm run build` passes
- [ ] Tests added/updated where applicable
- [ ] No secrets in diff
- [ ] `docs/TASKS.md` status updated (when we start executing)
