# QA Rubric — AI preview quality (Phase 1)

**Task:** T1.7.1  
**Use when:** Manual validation of `src/lib/prompts.ts` on fixture or clinic photos (never commit real prospect PII).

**Goals:** `density` · `hairline` · `full`

---

## Setup

1. `npm run dev` → http://localhost:3000
2. Use photos from [`public/fixtures/`](../public/fixtures/README.md) or clinic-provided copies **kept local only**
3. Run each goal once per photo; note latency and obvious failures first

---

## Per-result checklist

Score each dimension **Pass / Marginal / Fail**. Overall goal is **Pass** only if no Fail and at most one Marginal.

| # | Criterion | Pass | Marginal | Fail |
|---|-----------|------|----------|------|
| 1 | **Identity preserved** — same person, age, ethnicity, expression | Recognizably identical | Slight drift (skin tone, minor feature shift) | Different person or obvious face change |
| 2 | **Hair change matches goal** | Clear, goal-specific improvement | Some improvement but weak or wrong area | No visible change or wrong goal (e.g. hairline on density) |
| 3 | **Naturalness** | Believable consultation illustration | Slightly wig-like or over-smoothed | Uncanny, painted, or impossible density |
| 4 | **Scope discipline** | Only hair/scalp edited | Minor background or clothing bleed | Major background, lighting, or body changes |
| 5 | **Consultation fit** | Staff could show in clinic without over-promising | Usable with verbal caveats | Looks like guaranteed surgical result |

---

## Goal-specific signals

### Density

- **Pass:** Fuller coverage in thinning zones (crown, part, temples); hair direction and color match existing hair
- **Fail:** Uniform helmet hair, changes to beard/sideburns only, or edits off-scalp

### Hairline

- **Pass:** Frontal hairline softer and denser; mature shape; blends with temples
- **Fail:** Juvenile/low hairline, straight “wig line”, or eyebrow/forehead alteration

### Full

- **Pass:** Both hairline and mid-scalp/crown improved coherently
- **Fail:** Only one area changed, or disproportionate “Hollywood” density

---

## Fixture set (minimum 3 photos)

| ID | Description | Why |
|----|-------------|-----|
| F1 | Male, visible recession / thinning crown | Density + full |
| F2 | Male or female, clear frontal hairline concern | Hairline |
| F3 | Different angle or lighting (indoor clinic-like) | Robustness |

Record results in a table (date, goal, fixture ID, scores 1–5, notes). Do **not** commit prospect photos to git.

---

## When to iterate prompts

Update `src/lib/prompts.ts` when:

- Same failure appears on **2+ fixtures** for one goal
- Identity preservation fails (always fix — compliance risk)
- Staff feedback: “not credible in consultation”

After prompt changes: re-run full rubric on all three fixtures × three goals (9 generations — budget ~$).

---

## Exit for Phase 1 prompt QA

- [ ] 3 fixtures × 3 goals run
- [ ] No **Fail** on identity (criterion 1) for any result
- [ ] Each goal has at least one **Pass** on overall consultation fit (criterion 5)
- [ ] Findings noted in PR or `docs/QA-PHASE1.md` appendix
