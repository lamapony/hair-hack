# Status — Hair Hack

**Living dashboard.** Update when a task ships or a track changes.  
**Workflow:** [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP

**Last updated:** 2026-06-14

---

## QA baseline (HAI-4)

| Gate | Status |
|------|--------|
| `npm run check` | ✅ green (typecheck + 36 tests + build) |
| `src/lib/*` coverage | ✅ ~94% lines on core modules (`npm run test:coverage`) |
| Playwright E2E | ✅ scaffold — `tests/e2e/smoke.spec.ts`, `npm run test:e2e` |
| Obsidian vault | ✅ stubs + [[050 Hair Hack/Exercises/QA_BASELINE\|QA report]] in vault |

---

## Where we are (agent-skills lifecycle)

| Phase | Skill | Status |
|-------|-------|--------|
| DEFINE | `spec-driven-development` | ✅ [SPEC.md](./SPEC.md) v0.4 locked |
| PLAN | `planning-and-task-breakdown` | ✅ [PLAN.md](./PLAN.md) |
| TASKS | `planning-and-task-breakdown` | ✅ [TASKS.md](./TASKS.md) — see table below |
| BUILD | `incremental-implementation` | 🔄 Phase 1 foundation ~60% |
| VERIFY | `test-driven-development` | 🔄 36 unit tests; Playwright smoke scaffold |
| REVIEW | `code-review-and-quality` | ⏳ before each PR |
| SHIP | `shipping-and-launch` | ⏳ after Phase 1 + legal gate |

**Current BUILD focus:** DTC shipped ([HAI-1](/HAI/issues/HAI-1)); clinic copy (T1.4.3) → route tests.

---

## Track DTC (direct-to-consumer)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| HAI-1 | `/try` landing + Stripe $9.99 | ✅ | Upload → checkout → gated `/try/result` preview |
| — | Stripe checkout API | ✅ | `/api/checkout/create`, `/api/checkout/verify` |
| — | Gated generation | ✅ | `/api/dtc/generate` verifies paid session |
| — | Consumer consent + disclaimer | ✅ | `dtc-consent.ts`, DTC copy on `/try` |

**Env:** `STRIPE_SECRET_KEY` (+ optional `NEXT_PUBLIC_APP_URL`) in `.env.local`. Test mode keys only until board approves live.

---

## Track SHIP (Phase 1 — clinic demo)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1.0.1 | Git + GitHub | ✅ | `lamapony/hair-hack` on `main` |
| T1.1.1 | Vitest | ✅ | `npm test` |
| T1.1.2 | `image.ts` + tests | ✅ | 5 tests |
| T1.1.3 | Prompt tests | ✅ | 2 tests |
| T1.1.4 | Route tests (mocked) | ⏳ | Provider mocked; HTTP route tests not yet |
| T1.2.1 | `validate.ts` | ✅ | 4 tests |
| T1.2.2 | Error mapping | ✅ | `errors.ts` + 4 tests |
| T1.2.3 | Client resize | ○ | Optional |
| T1.3.1 | Rate limiting | ✅ | IP hourly + daily cap on `/api/generate` |
| T1.3.2 | Env docs | ✅ | `.env.example` documents rate limit vars |
| T1.4.1 | Slider compare | ✅ | Drag handle + keyboard; replaces side-by-side |
| T1.4.2 | Consent (4 checkboxes) | ✅ | UI + API validation; banner + post-result reminder |
| T1.4.3 | Clinic copy | ○ | Generic MVP copy |
| T1.4.4 | Loading + cancel | ○ | Spinner only |
| T1.5.1 | GitHub Actions CI | ✅ | `.github/workflows/ci.yml` on `main` |

**Legend:** ✅ done · 🔄 partial · ⏳ in progress / gap · ○ not started

**Phase 1 exit:** all ✅ except optional T1.2.3; CI green on `main`; manual QA on tablet.

---

## Track 3D (parallel spike)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T3D.1 | Hairgen.ai spike | ○ | [3D-API-EVAL.md](./3D-API-EVAL.md) |
| T3D.2 | Provider adapter | 🔄 | `ImageProvider` + OpenAI done; Hairgen stub |
| T3D.3 | Force HT outreach | ○ | Optional |

**Decision gate:** T3D.1 go/no-go → either integrate Hairgen or stay on `gpt-image-2` until enterprise 3D.

---

## Track LEGAL (parallel — blocks paid clinics)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| — | Risk register | ✅ | [legal/COMPLIANCE.md](./legal/COMPLIANCE.md) |
| TL.1 | Consent UI (4 boxes) | ✅ | L-T1 + L-T2 partial (banner/footer); maps to T1.4.2 |
| TL.2 | `/privacy` + `/terms` | ○ | Placeholder pages |
| TL.3 | Counsel review package | ○ | Needs lawyer |
| TL.4 | Deploy gate | ○ | Env check |

**Hard gate:** no paying clinic pilot until TL.2–TL.3 + counsel sign-off in COMPLIANCE.md.

---

## How to work cleanly (agent-skills)

### Before coding

1. Read task ID in [TASKS.md](./TASKS.md) — if scope changed, update [SPEC.md](./SPEC.md) first.
2. Pick skill: UI → `frontend-ui-engineering`; API → `api-and-interface-design`; tests → `test-driven-development`.
3. One task = one branch = one PR.

### During (incremental-implementation)

```
implement smallest slice → npm test → npm run build → commit → next slice
```

### Before PR (code-review-and-quality)

```bash
npm run check    # typecheck + test + build
```

One reviewer from team; link task ID in PR title: `T1.4.1: before/after slider`.

### After merge

Update this file (`STATUS.md`) and task status in `TASKS.md`.

---

## Next up (recommended order)

1. **TL.2** — `/privacy` + `/terms` placeholder pages
2. **T1.4.3** — clinic copy pass
3. **T3D.1** — Hairgen spike (parallel, separate branch)

---

## Repo hygiene checklist

- [x] `main` has latest foundation (tests, CI, providers)
- [ ] Collaborators invited on GitHub
- [ ] Each dev ran `./scripts/install-agent-skills.sh`
- [ ] No `.env.local` in git
- [ ] PRs reference task IDs
