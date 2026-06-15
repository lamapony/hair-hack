# TL.3 — Send to counsel (action checklist)

**Blocks:** paying clinic pilot  
**Time:** ~10 minutes  
**Package index:** [COUNSEL-PACKAGE.md](./COUNSEL-PACKAGE.md)

---

## Before you send

- [ ] Confirm counsel contact email
- [ ] Decide: attachments (export PDF) vs links below (GitHub `main` is fine for review)
- [ ] Do **not** attach patient photos or API keys

---

## Copy-paste email

**To:** _[counsel]_  
**Subject:** `Hair Hack — clinic demo legal review (MVP, OpenAI-only)`

**Body:**

> Hello,
>
> We are preparing **Hair Hack**, a staff-operated clinic consultation demo: a consultant uploads a prospect photo, selects a treatment focus (density / hairline / full), and shows an AI **illustration** with a before/after slider. This is for consultation discussion only — not medical advice, diagnosis, or a guaranteed outcome.
>
> **MVP data flow:** photo in browser → our serverless API (Vercel) → OpenAI Images API → result in browser only. We do not persist prospect photos on our servers. OpenAI is the sole image subprocessor.
>
> We need legal review before any paying clinic pilot. Please review:
>
> 1. **Counsel package (start here):** https://github.com/lamapony/hair-hack/blob/main/docs/legal/COUNSEL-PACKAGE.md  
> 2. **Compliance / risk register:** https://github.com/lamapony/hair-hack/blob/main/docs/legal/COMPLIANCE.md  
> 3. **Product spec (v0.5):** https://github.com/lamapony/hair-hack/blob/main/docs/SPEC.md  
> 4. **Phase 1 QA report:** https://github.com/lamapony/hair-hack/blob/main/docs/QA-PHASE1.md  
> 5. **Draft Privacy / Terms** (placeholders): run locally `npm run dev` → footer links `/privacy`, `/terms` — or see `src/lib/legal-placeholders.ts`
>
> **Priority deliverables (from package §6):**
> - Final Privacy Policy and clinic ToS / B2B license  
> - Printable consultant consent script (L-D4) aligned with our four checkbox UI  
> - Written answers on data controller, GDPR lawful basis, HIPAA/BAA chain, OpenAI commercial use, advertising disclaimers, minors  
> - Sign-off recorded in COMPLIANCE.md gate table when approved  
>
> **Optional 15-min demo:** clone https://github.com/lamapony/hair-hack — `npm install && npm run dev` → http://localhost:3000 (upload → four consent boxes → generate → slider). We can share a preview URL on request.
>
> Happy to walk through live or answer product questions.
>
> Best regards,  
> _[Your name]_

---

## After you send

- [ ] Note date sent + expected response in team channel
- [ ] Mark in [COMPLIANCE.md](./COMPLIANCE.md) gate table (optional row: "Counsel engaged YYYY-MM-DD")
- [ ] Parallel: engineering completes [OPENAI-ENGINEERING-CHECKLIST.md](./OPENAI-ENGINEERING-CHECKLIST.md)

---

## When counsel responds

1. Implement approved text in `src/lib/legal-placeholders.ts` + `/privacy`, `/terms`
2. Align L-D4 script with `src/lib/consent.ts`
3. Set `COUNSEL_LEGAL_APPROVED=true` only on **production** after sign-off (see TL.4)
