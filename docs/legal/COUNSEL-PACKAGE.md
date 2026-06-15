# Counsel Review Package — Hair Hack

**Task:** TL.3  
**Prepared:** 2026-06-15  
**Purpose:** Single briefing for qualified legal counsel before clinic pilot or paid rollout.  
**Not legal advice** — engineering/product summary for review.

---

## 1. Product summary (30 seconds)

**Hair Hack** is a **staff-operated clinic demo**: consultant uploads a prospect's photo, selects a treatment focus (density / hairline / full), obtains an **AI illustration** via OpenAI `gpt-image-2`, and shows a before/after slider during consultation.

- **Not** diagnosis, treatment planning, or outcome guarantee
- **MVP:** no server-side photo retention; images sent to OpenAI per request
- **English only**; no user accounts; shared demo URL
- **3D:** Not in MVP. Hairgen.ai evaluated and rejected (no-go); production uses OpenAI only.

---

## 2. Documents included in this package

| # | Document | Location | Status |
|---|----------|----------|--------|
| A | Compliance track (risk register, data map, regional checklist) | [COMPLIANCE.md](./COMPLIANCE.md) | Draft |
| B | Privacy Policy (placeholder) | `/privacy` → `src/app/privacy/page.tsx`, `src/lib/legal-placeholders.ts` | DRAFT |
| C | Terms of Service (placeholder) | `/terms` → `src/app/terms/page.tsx` | DRAFT |
| D | Product spec (audience, scope, success criteria) | [../SPEC.md](../SPEC.md) | v0.5 (OpenAI only; Hairgen no-go) |
| E | Consent UI implementation | `src/components/ConsentAttestation.tsx`, `src/lib/consent.ts` | Shipped |
| F | 3D API evaluation (future risk R12) | [../3D-API-EVAL.md](../3D-API-EVAL.md) | Research |
| G | Phase 1 QA report | [../QA-PHASE1.md](../QA-PHASE1.md) | Automated + browser pass (2026-06-15) |

**Deliverables counsel should produce (from COMPLIANCE.md L-D*):**

- L-D1 Privacy Policy (final)
- L-D2 Terms of Service / B2B clinic license (final)
- L-D3 Clinic Acceptable Use Policy
- L-D4 Printable consent script for consultants
- L-D5 DPIA (if EU clinics)
- L-D7 Subprocessor appendix (OpenAI, Vercel)

---

## 3. Data processing (current MVP)

```
Prospect photo → Staff browser → Vercel serverless (/api/generate) → OpenAI Images API → Result → Browser only
```

| Data element | Retained by us? | Subprocessor |
|--------------|-----------------|--------------|
| Facial photo (base64 in request) | No (in-memory per request) | OpenAI |
| IP address (rate limiting) | Transient in-memory store | — |
| Generated image | No server storage | OpenAI |

**Staff attestation (4 checkboxes)** blocks generate until all checked — see COMPLIANCE.md § Consent.

---

## 4. Product classification (our position — needs sign-off)

| Question | Proposed answer |
|----------|-----------------|
| Medical device (EU MDR / FDA)? | No — illustrative visualization only |
| Clinical decision support? | No |
| Cosmetic try-on? | Closer yes — with enhanced disclaimers (clinic context) |

**Future trigger:** If 3D provider exposes graft counts or surgical planning metrics → re-classify (see COMPLIANCE R12, open item #5).

---

## 5. Risk register (top items)

See full table in [COMPLIANCE.md](./COMPLIANCE.md). Priority for counsel:

| ID | Risk | Severity |
|----|------|----------|
| R1 | Misleading outcome / implied guarantee | High |
| R2 | Biometric data (GDPR Art. 9) | High |
| R3 | HIPAA if PHI linked to photo | High |
| R5 | Clinic uses output in advertising | High |
| R8 | Professional liability | High |
| R12 | 3D track increases "surgical planning" perception | High |

---

## 6. Questions for counsel (decision list)

Please advise in writing on:

1. **Data controller** — clinic, us, or joint controller for prospect photos?
2. **Lawful basis (GDPR)** — is explicit consent sufficient for facial/biometric processing in target EU markets?
3. **HIPAA** — when US clinic is covered entity, what BAA chain is required (us ↔ OpenAI ↔ clinic)?
4. **OpenAI commercial use** — clinic demonstration and retention of output; client likeness rights?
5. **White-label** — does branding for clinics change our regulatory exposure?
6. **Advertising** — required disclaimer language if clinic shows AI preview in marketing?
7. **Minors** — is 18+ staff attestation sufficient, or hard technical block required?
8. **Future 3D path** — if true 3D is added later (e.g. enterprise platform), does classification change?

---

## 7. Sign-off gate (before paying clinic)

| Gate | Status |
|------|--------|
| Privacy Policy counsel-approved | ⏳ |
| Clinic ToS counsel-approved | ⏳ |
| Consent UI matches L-D4 script | ⏳ Product ready; script pending |
| OpenAI DPA / ZDR settings verified | ⏳ Engineering |
| DPIA (EU) | ⏳ |
| Insurance / liability with clinic partner | ⏳ Business |

Record approvals in [COMPLIANCE.md](./COMPLIANCE.md) when complete.

---

## 8. Engineering artifacts for review

- Live demo: `npm run dev` → http://localhost:3000
- Consent strings: `src/lib/consent.ts`
- Disclaimer copy: `src/lib/clinic-copy.ts`, `src/lib/legal-placeholders.ts`
- API validation: `src/lib/validate.ts` (consent required server-side)
- Rate limiting: `src/lib/rate-limit.ts`

---

## 9. Suggested counsel engagement

1. Review this package + live demo (15 min)
2. Mark up draft Privacy/Terms
3. Answer §6 questions
4. Provide L-D4 consent script PDF
5. Sign-off memo for COMPLIANCE.md gate table

**Contact for product questions:** repository maintainers (see README).

---

## 10. Handoff checklist (product → counsel)

Use this when engaging counsel. Attach or link the files in §2.

**Email subject:** `Hair Hack — clinic demo legal review (MVP, OpenAI-only)`

**Suggested body:**

> We are preparing a staff-operated clinic consultation demo (AI hair preview, illustrative only — not medical advice). MVP processes photos in-memory only; OpenAI Images API is the sole image subprocessor. We need counsel review before any paying clinic pilot.
>
> Please review the attached package:
> - [COUNSEL-PACKAGE.md](./COUNSEL-PACKAGE.md) (this document)
> - [COMPLIANCE.md](./COMPLIANCE.md) (risk register + gates)
> - Draft pages: `/privacy` and `/terms` (linked from app footer)
> - [SPEC.md](../SPEC.md) v0.5
>
> Priority deliverables: final Privacy Policy, clinic ToS/B2B license, printable consent script (L-D4), and written answers to §6. Record sign-off in COMPLIANCE.md § Sign-off gate when approved.
>
> Optional 15-minute live walkthrough: `npm run dev` → http://localhost:3000 (upload → consent → generate → slider).

**Product actions after send:**

- [ ] Counsel engaged; target response date noted
- [ ] Marked-up Privacy/Terms received → implement in `src/lib/legal-placeholders.ts` + pages
- [ ] L-D4 consent script aligned with `src/lib/consent.ts`
- [ ] OpenAI DPA / zero-data-retention settings verified (engineering)
- [ ] COMPLIANCE.md gate table updated with approval dates
