# Legal & Compliance Track — Hair Hack

**Status:** Draft — requires qualified legal review before clinic rollout  
**Audience:** Clinic demo tool (staff-operated, not direct-to-consumer self-serve)  
**Jurisdiction note:** Template covers EU (GDPR), UK, US (HIPAA-adjacent), and general medical-device marketing rules. **Not legal advice.**

---

## Product classification

| Question | Our position (pending counsel sign-off) |
|----------|----------------------------------------|
| Is this a medical device? | **No** — illustrative visualization only; no diagnosis, treatment plan, or outcome guarantee |
| Is this clinical decision support? | **No** — consultant judgment remains sole basis for recommendations |
| Is this a cosmetic "try-on"? | **Closer yes** — like hairstyle preview, with stronger disclaimers because clinics imply treatment |

**Risk if misclassified:** Regulators (FDA, EU MDR, local health authorities) may treat outcome imagery as implied efficacy claims.

**Mitigation:** Fixed disclaimer copy; no graft counts or "success %" unless from a certified clinical tool (separate product).

---

## Data processing map

```
Prospect photo → Clinic staff device/browser → Our server (Vercel) → OpenAI API → Result image → Browser only
                      ↑                              ↑
                 Consent checkbox              No persistent storage (MVP)
```

| Data | Controller | Processor | Stored? | Legal basis (GDPR) |
|------|------------|-----------|---------|-------------------|
| Prospect facial photo | **Clinic** (likely) | Us + OpenAI | MVP: no server retention | **Consent** + legitimate interest (demo) — counsel to confirm |
| IP / logs | Us | Vercel | Transient logs | Legitimate interest |
| API usage metadata | Us | OpenAI | Per OpenAI policy | Contract |

**Action items:**
- [ ] **L1.1** Determine data controller: clinic vs. us (affects DPA and privacy policy)
- [ ] **L1.2** Execute **DPA** with OpenAI (Enterprise/ZDR if available)
- [ ] **L1.3** Publish **Privacy Policy** + **Subprocessor list** (OpenAI, Vercel)
- [ ] **L1.4** **DPA template** for clinics using our demo
- [ ] **L1.5** Confirm OpenAI API data retention / training opt-out settings for image API

---

## Consent & disclosures (UI — mandatory before generate)

### Staff attestation checkbox (required)

Staff must check all before `Generate`:

1. ☐ I have **explained** to the client that this is an **AI illustration only**, not a medical prediction or guarantee of surgical results.
2. ☐ The client **consents** to their photo being processed by **our service and OpenAI** for this single preview session.
3. ☐ The client understands photos are **not stored on our servers** after the session (MVP) / retention policy if changed.
4. ☐ The client is **18+** or I have parental/guardian consent (if minors ever allowed — default **block under 18**).

### On-screen disclaimer (always visible)

> **Illustrative preview only.** This AI-generated image is for consultation discussion. It does not constitute medical advice, diagnosis, or a promise of treatment outcomes. Results vary. A qualified physician must assess candidacy and plan any procedure.

### Post-result reminder

> Do not use this image in advertising or social media **with the client's likeness** without separate written marketing consent.

---

## Risk register

| ID | Risk | Severity | Mitigation |
|----|------|----------|------------|
| R1 | **Misleading outcome** — client believes preview = guaranteed result | High | Disclaimers; no "after surgery" label; use "AI illustration" |
| R2 | **Biometric data** (face) under GDPR Art. 9 | High | Explicit consent; DPIA; minimize retention; EU hosting consideration |
| R3 | **HIPAA** (US clinics) if PHI linked to identity | High | BAA chain; avoid name/MRN in same flow as photo; counsel review |
| R4 | **OpenAI subprocessors** / cross-border transfer | Medium | SCCs; OpenAI DPA; document in privacy policy |
| R5 | **Marketing claims** — clinic uses output in ads | High | Prohibit in ToS; separate marketing release form |
| R6 | **Minors** | High | Block upload or require guardian flow |
| R7 | **Deepfake / identity** — wrong person or defamation | Medium | Staff-only operation; audit log who generated (Phase 2) |
| R8 | **Professional liability** — client sues clinic relying on preview | High | Clinic indemnity in agreement; insurance disclosure |
| R9 | **IP** — OpenAI output terms for commercial clinic use | Medium | Review OpenAI ToS; ownership clause in clinic agreement |
| R10 | **Accessibility** — staff cannot explain to disabled clients | Low | Accessible UI; printable plain-language summary |
| R11 | **Record retention** — if we add history later | Medium | Retention schedule; right to erasure workflow |
| R12 | **3D track** — stronger "surgical planning" perception | High | Separate disclaimers if 3D implies measurements/grafts |

---

## Documents to produce (legal track)

| ID | Document | Owner | Blocker for |
|----|----------|-------|-------------|
| L-D1 | Privacy Policy (website + in-app link) | Legal | Public / clinic pilot |
| L-D2 | Terms of Service (B2B clinic license) | Legal | Paid clinics |
| L-D3 | Clinic **Acceptable Use Policy** | Legal + Product | All clinics |
| L-D4 | **Consent script** for consultants (printable PDF) | Legal | In-clinic use |
| L-D5 | **DPIA** (Data Protection Impact Assessment) | DPO / counsel | EU clinics |
| L-D6 | **Cookie / analytics** notice | Legal | If analytics added |
| L-D7 | OpenAI + Vercel **subprocessor appendix** | Legal | DPA |
| L-D8 | **Marketing release** (optional separate form) | Legal | Client photos in ads |

---

## Implementation tasks (engineering supports legal)

| ID | Task | Spec ref |
|----|------|----------|
| L-T1 | Consent checkbox (4 statements) — block generate | T1.4.2 | ✅ Shipped |
| L-T2 | Persistent disclaimer banner + footer | T1.4.2 | ✅ Shipped |
| L-T3 | `/privacy` and `/terms` placeholder pages with counsel-approved text | L-D1, L-D2 |
| L-T4 | Age gate: confirm 18+ in consent (no DOB collection in MVP) | R6 |
| L-T5 | Audit log: timestamp, goal, no image (Phase 2) | R7, R11 |
| L-T6 | `LEGAL_REVIEW_REQUIRED=true` env blocks deploy without policy URLs | CI guard |
| L-T7 | Export **data processing summary** PDF for clinics | L-D3 |

---

## Regional checklist

### EU / UK (GDPR)

- [ ] Lawful basis documented (consent primary)
- [ ] DPIA for biometric processing
- [ ] Right to erasure process (even if we don't store — OpenAI inquiry path)
- [ ] EU representative if no EU establishment (if selling to EU clinics)

### United States

- [ ] HIPAA: determine if clinic is covered entity and if photos = PHI
- [ ] State privacy laws (CCPA/CPRA): notice at collection if California residents
- [ ] FTC: no deceptive before/after in consumer-facing ads without disclaimers
- [ ] FDA: confirm not promoting device if graft planning added later

### Turkey / other (if clinics there)

- [ ] KVKK (Turkey) equivalent review — add when market known

---

## Sign-off gate (before any paying clinic)

| Gate | Approver |
|------|----------|
| Privacy Policy live | Counsel |
| Clinic ToS live | Counsel |
| Consent UI matches L-D4 script | Product + Counsel |
| OpenAI DPA / data settings verified | Engineering + Counsel |
| DPIA complete (if EU) | DPO |
| Insurance / liability discussed with clinic partner | Business |

---

## Open items for counsel

1. Who is **data controller** — us, clinic, or joint?
2. Is face photo **special category** processing always requiring explicit consent in our markets?
3. Can clinics **white-label** without us becoming medical device manufacturer?
4. **OpenAI output** — commercial clinic use and client likeness rights?
5. When **3D API** adds graft estimates — does classification change to SaMD?
