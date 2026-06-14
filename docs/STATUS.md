# Status — Hair Hack

**Living dashboard.** Update when a task ships or a track changes.  
**Workflow:** [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) — DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP

**Last updated:** 2026-06-13

---

## Where we are (agent-skills lifecycle)

| Phase | Skill | Status |
|-------|-------|--------|
| DEFINE | `spec-driven-development` | ✅ [SPEC.md](./SPEC.md) v0.4 locked |
| PLAN | `planning-and-task-breakdown` | ✅ [PLAN.md](./PLAN.md) |
| TASKS | `planning-and-task-breakdown` | ✅ [TASKS.md](./TASKS.md) — see table below |
| BUILD | `incremental-implementation` | 🔄 Phase 1 ~95% (polish optional) |
| VERIFY | `test-driven-development` | 🔄 42 unit tests; E2E optional |
| REVIEW | `code-review-and-quality` | ⏳ before each PR |
| SHIP | `shipping-and-launch` | ⏳ after Phase 1 + legal gate |

**Current BUILD focus:** Phase 1 exit QA → T3D.1 spike (parallel).

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
| TL.2 | `/privacy` + `/terms` | ✅ | Draft placeholders linked from footer |
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

1. **Phase 1 exit** — manual QA on clinic tablet
2. **T3D.1** — Hairgen spike (parallel, `spike/hairgen`)
3. **TL.3** — counsel review package
4. **T1.4.4** — loading + cancel (optional polish)

---

## Repo hygiene checklist

- [x] `main` has latest foundation (tests, CI, providers)
- [ ] Collaborators invited on GitHub
- [ ] Each dev ran `./scripts/install-agent-skills.sh`
- [ ] No `.env.local` in git
- [ ] PRs reference task IDs
