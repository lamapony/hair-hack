# Status — Hair Hack

**Living dashboard.** Update when a task ships or a track changes.  
**Workflow:** [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP

**Last updated:** 2026-06-15

---

## Where we are (agent-skills lifecycle)

| Phase | Skill | Status |
|-------|-------|--------|
| DEFINE | `spec-driven-development` | ✅ [SPEC.md](./SPEC.md) v0.5 — Hairgen no-go |
| PLAN | `planning-and-task-breakdown` | ✅ [PLAN.md](./PLAN.md) |
| TASKS | `planning-and-task-breakdown` | ✅ [TASKS.md](./TASKS.md) — see table below |
| BUILD | `incremental-implementation` | ✅ Phase 1 complete; 3D track deferred |
| VERIFY | `test-driven-development` | ✅ 58 tests; [QA-PHASE1.md](./QA-PHASE1.md) browser QA pass |
| REVIEW | `code-review-and-quality` | ⏳ before each PR |
| SHIP | `shipping-and-launch` | ⏳ after Phase 1 + legal gate |

**Current BUILD focus:** TL.3 counsel send (human) · OpenAI engineering checklist · prompt quality on clinic photos.

---

## Track 3D — deferred (Hairgen no-go)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T3D.1 | Hairgen.ai spike | ✅ no-go | Decision 2026-06-15: skip live trial; stay on OpenAI |
| T3D.2 | Provider adapter | ✅ | OpenAI production; Hairgen code archived in repo |
| T3D.3 | Force HT outreach | ○ | Optional — only if true 3D required later |

**Decision:** No `HAIRGEN_API_KEY`. Improve `gpt-image-2` prompts and clinic QA instead.

---

## Track SHIP (Phase 1 — clinic demo)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| T1.0.1 | Git + GitHub | ✅ | `lamapony/hair-hack` on `main` |
| T1.1.1 | Vitest | ✅ | `npm test` |
| T1.1.2 | `image.ts` + tests | ✅ | 5 tests |
| T1.1.3 | Prompt tests | ✅ | 2 tests |
| T1.1.4 | Route tests (mocked) | ✅ | 7 tests on `POST /api/generate` |
| T1.2.1 | `validate.ts` | ✅ | 4 tests |
| T1.2.2 | Error mapping | ✅ | `errors.ts` + 4 tests |
| T1.2.3 | Client resize | ○ | Optional |
| T1.3.1 | Rate limiting | ✅ | IP hourly + optional daily cap on `/api/generate` |
| T1.3.2 | Env docs | ✅ | `.env.example` documents rate limit vars |
| T1.4.1 | Slider compare | ✅ | Drag handle + keyboard; replaces side-by-side |
| T1.4.2 | Consent (4 checkboxes) | ✅ | UI + API validation; banner + post-result reminder |
| T1.4.3 | Clinic copy | ✅ | `clinic-copy.ts` + consultation workflow |
| T1.4.4 | Loading + cancel | ✅ | Spinner + AbortController cancel |
| T1.5.1 | GitHub Actions CI | ✅ | `.github/workflows/ci.yml` on `main` |

**Legend:** ✅ done · 🔄 partial · ⏳ in progress / gap · ○ not started

**Phase 1 exit:** all ✅ except optional T1.2.3; CI green on `main`; manual QA on tablet.

---

## Phase 1 exit QA

See [QA-PHASE1.md](./QA-PHASE1.md). Automated + browser QA ✅; optional iPad pass with real clinic photos (hairline/full goals).

## Track SHIP (Phase 1 — clinic demo)

## Track LEGAL (parallel — blocks paid clinics)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| — | Risk register | ✅ | [legal/COMPLIANCE.md](./legal/COMPLIANCE.md) |
| TL.1 | Consent UI (4 boxes) | ✅ | L-T1 + L-T2 partial (banner/footer); maps to T1.4.2 |
| TL.2 | `/privacy` + `/terms` | ✅ | Draft placeholders linked from footer |
| TL.3 | Counsel review package | 🔄 | Package ready — **send to counsel** ([§10 handoff](./legal/COUNSEL-PACKAGE.md#10-handoff-checklist-product--counsel)) |
| TL.4 | Deploy gate | ✅ | `LEGAL_PAGES_REQUIRED` + `/api/health`; [OpenAI checklist](./legal/OPENAI-ENGINEERING-CHECKLIST.md) |

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

1. **TL.3** — send [COUNSEL-PACKAGE.md](./legal/COUNSEL-PACKAGE.md) to counsel (§10 handoff)
2. **L1.5** — complete [OPENAI-ENGINEERING-CHECKLIST.md](./legal/OPENAI-ENGINEERING-CHECKLIST.md) before production deploy
3. **Quality** — tune prompts on real clinic photos (hairline + full goals)

---

## Repo hygiene checklist

- [x] `main` has latest foundation (tests, CI, providers)
- [ ] Collaborators invited on GitHub
- [ ] Each dev ran `./scripts/install-agent-skills.sh`
- [ ] No `.env.local` in git
- [ ] PRs reference task IDs
