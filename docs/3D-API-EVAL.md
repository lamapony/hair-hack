# 3D Visualization — API Evaluation Track

**Goal:** True or quasi-3D hair preview for in-clinic demos, using the best available API (not DIY research models unless no vendor fits).

**Status:** Research — parallel to Phase 1 2D MVP

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

1. **Now:** Ship 2D with `gpt-image-2` + slider (fast, team can iterate).
2. **Spike (T3D.1):** Hairgen.ai trial — closest **API-first** hair-transplant renderer.
3. **Decision (T3D.2):** If Hairgen quality passes clinic bar → dual provider or switch; else evaluate Force HT partnership or wait for HairPort maturity.

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

---

## Architecture options (post-spike)

### Option A — Dual provider (recommended if Hairgen wins)

```
Client → /api/generate?provider=openai|hairgen
       → adapter pattern in src/lib/providers/
```

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
