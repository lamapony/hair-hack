# Tasks: Hair Hack

**Backlog for Phase 1.** Living status → [STATUS.md](./STATUS.md).

Format: one task = one branch = one PR. Follow `incremental-implementation`: implement → test → verify → commit.

Status: `done` | `partial` | `pending`

---

## Phase 1.0 — Team setup

### T1.0.1 Git + GitHub — `done`

**Acceptance:**
- Remote `origin` → `https://github.com/lamapony/hair-hack.git`
- Initial commit pushed to `main`
- Collaborators invited on GitHub
- [COLLABORATION.md](./COLLABORATION.md) linked from README

---

## Phase 1.1 — Testing foundation

### T1.1.1 Add Vitest — `done`

### T1.1.2 Unit tests for validation helpers — `done`

### T1.1.3 Unit tests for prompts — `done`

### T1.1.4 API route tests (mocked OpenAI) — `pending`

**Gap:** provider unit test exists; full `POST` handler tests still needed.

---

## Phase 1.2 — API hardening

### T1.2.1 Shared validation module — `done`

### T1.2.2 User-safe error mapping — `done`

### T1.2.3 Client image resize (optional) — `pending`

---

## Phase 1.3 — Rate limiting

### T1.3.1 IP rate limit middleware — `pending`

### T1.3.2 Document env vars — `partial`

---

## Phase 1.4 — Clinic demo UX

### T1.4.1 Before/after slider — `pending`

**Skill:** `frontend-ui-engineering`

### T1.4.2 Consent + disclaimer (clinic) — `done`

**Skill:** `frontend-ui-engineering` + `security-and-hardening`  
**Legal:** [COMPLIANCE.md](./legal/COMPLIANCE.md) TL.1

### T1.4.3 Clinic-oriented copy pass — `pending`

### T1.4.4 Loading UX — `pending`

---

## Phase 1.5 — CI

### T1.5.1 GitHub Actions — `done` (awaiting push to `main`)

---

## Track 3D

### T3D.1 Hairgen.ai spike — `pending`

### T3D.2 Provider adapter design — `partial` (OpenAI done; Hairgen stub)

### T3D.3 Force HT outreach — `pending`

---

## Track LEGAL

### TL.1 Consent UI — `done` (→ T1.4.2)

### TL.2 Policy pages — `pending`

### TL.3 Counsel review package — `pending`

### TL.4 Deploy gate — `pending`

---

## Suggested order (agent-skills BUILD)

1. Push foundation commit (T1.0.1 + T1.1.x + T1.2.x + T1.5.1)
2. T1.4.2 / TL.1 — consent
3. T1.4.1 — slider
4. T1.4.3 — clinic copy
5. T1.3.1 — rate limits
6. T1.1.4 — route tests
7. T3D.1 — parallel on `spike/hairgen`

---

## Definition of done (per task)

- [ ] Acceptance criteria met
- [ ] `npm run check` passes
- [ ] Tests added/updated
- [ ] No secrets in diff
- [ ] [STATUS.md](./STATUS.md) updated
