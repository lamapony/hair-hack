# 3D Visualization — API Evaluation Track

**Goal:** True or quasi-3D hair preview for in-clinic demos, using the best available API (not DIY research models unless no vendor fits).

**Status:** Research — **Hairgen no-go** (2026-06-15); production stays on OpenAI 2D

---

## Decision log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-15 | **No-go on Hairgen.ai** | Per-render cost vs `gpt-image-2`; requires scalp mask pipeline; 2.5D only (no rotation); team expects better results from OpenAI + prompt tuning. Live trial skipped. |
| 2026-06-15 | **Production provider = OpenAI only** | `IMAGE_PROVIDER=openai` (default). Hairgen adapter in repo is archived spike code, not supported for clinics. |
| — | **3D track deferred** | Revisit only if clinic product needs true 3D (e.g. Force HT partnership) — not blocking Phase 1 ship. |

---

## Reality check

| Approach | 3D? | API-ready? | Clinic fit |
|----------|-----|------------|------------|
| **OpenAI `gpt-image-2`** | No — 2D photoreal edit | ✅ Yes (current) | Good "illustration"; not rotatable 3D head |
| **Hairgen.ai API** | 2.5D — density/style render | ✅ REST `POST /v1/render` | **Hair-transplant specific**; mask + photo |
| **AILab AIHair API** | 2D before/after | ✅ Async tasks | Consultation workflows |
| **AIhairstyles API** | 2D try-on | ✅ REST | Hairstyle, less transplant-specific |
| **Force HT Clinic Platform** | ✅ True 3D model | ❌ Platform, not simple REST | Gold standard for clinics; sales contact |
| **HairPort (SIGGRAPH 2026)** | ✅ 3D-aware transfer | ⚠️ Research code | Self-host; not production API yet |

**Conclusion:** There is no single public API today that equals Force HT's full 3D consultation **and** is as easy as OpenAI. Strategy:

1. **Now:** Ship 2D with `gpt-image-2` + slider — **this is the product path.**
2. ~~**Spike (T3D.1):** Hairgen.ai trial~~ → **No-go** (see decision log).
3. **Later (optional):** Force HT partnership or research (HairPort) if true 3D becomes a requirement — not MVP.

---

## Recommended default model (2D track)

Per [OpenAI prompting guide](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide):

| Setting | Value | Why |
|---------|-------|-----|
| Model | `gpt-image-2` | Best identity-preserving edit, photorealism |
| Quality | `medium` for dev; `high` for clinic demo | Balance moderate budget |
| Size | `1024x1024` or auto | Cost vs detail |

Env: `OPENAI_IMAGE_MODEL=gpt-image-2`, optional `OPENAI_IMAGE_QUALITY=medium|high`

---

## 3D spike: Hairgen.ai

**Docs:** https://docs.hairgen.ai/api

```http
POST https://api.hairgen.ai/v1/render
Authorization: <API_KEY>
Content-Type: multipart/form-data

photo=@portrait.jpg
mask=@scalp-mask.jpg   # may need segmentation step
renderSettings={"density": 100, "male": true, "hairstyle": "automatic", ...}
```

**Evaluation criteria (score 1–5 each):**

| Criterion | Weight |
|-----------|--------|
| Identity preservation | 25% |
| Natural hairline | 25% |
| Clinic "wow" on tablet | 20% |
| API latency & reliability | 15% |
| Cost per render vs gpt-image-2 | 15% |

**Tasks:** See `docs/TASKS.md` → Track 3D

### Spike implementation (T3D.1) — archived, no-go

Adapter merged in PR #9 for evaluation only. **Do not use in production.** No `HAIRGEN_API_KEY` required or planned.

| Piece | Status | Notes |
|-------|--------|-------|
| `createHairgenProvider()` | Archived | Not supported |
| Live trial | **Skipped** | No-go without trial — desk + architecture review sufficient |
| **Outcome** | **No-go** | Stay on OpenAI; improve prompts and clinic QA instead |

~~**How to run spike locally:**~~ Not applicable — provider deprecated.

~~**Go/no-go gate:**~~ **Closed: no-go** — remain on `gpt-image-2`.

---

## Architecture options (post-spike)

### Option A — Dual provider ~~(recommended if Hairgen wins)~~ **Rejected**

Hairgen no-go. Single provider: OpenAI.

### Option B — 3D-only vendor (Force HT)

Embed their platform or iframe; we own shell UI + legal consent only.

### Option C — Stay 2D until true 3D API matures

Market as "AI illustration" not "3D simulation"; add 3D in Phase 3 when vendor locked.

---

## UX implications of 3D

If true 3D is integrated later:

- Rotate/zoom head model (WebGL or vendor viewer)
- **Stronger legal copy** — 3D may imply surgical planning (see R12 in COMPLIANCE.md)
- Slider may become **texture blend on mesh** — keep slider pattern where possible

---

## Budget (moderate)

| Provider | Rough order of magnitude |
|----------|-------------------------|
| gpt-image-2 medium | ~$0.02–0.08 / image (verify OpenAI pricing) |
| Hairgen.ai | Contact sales / per-render |
| AIhairstyles | ~$0.15–0.30 / generation |
| Force HT | Enterprise subscription |

**Guardrails:** `DAILY_GENERATION_CAP`, per-clinic API keys in Phase 2.
