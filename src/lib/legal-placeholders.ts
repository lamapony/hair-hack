/** Draft legal copy — placeholder until counsel sign-off (TL.3). */

export const LEGAL_DRAFT_NOTICE =
  "DRAFT — for internal clinic demo use only. This text is not legal advice and must be reviewed and approved by qualified counsel before any public or paid clinic rollout.";

export const PRIVACY_SECTIONS = [
  {
    title: "Who we are",
    body: "Hair Hack is an illustrative AI preview tool operated for hair restoration clinic consultations. The data controller for prospect photos is typically the clinic using the demo; we act as a processor when generating previews on the clinic's behalf. Final roles must be confirmed with counsel.",
  },
  {
    title: "What we process",
    body: "For each preview session, the clinic staff uploads a prospect facial photo and treatment goal. The image is sent to our servers and to OpenAI's image API to produce an AI illustration. In the MVP, we do not persist photos on our servers after the session completes.",
  },
  {
    title: "Legal basis",
    body: "Processing is based on explicit client consent obtained by clinic staff before generation, as documented in the in-app staff attestation flow. Counsel should confirm lawful basis for each jurisdiction.",
  },
  {
    title: "Subprocessors",
    body: "We use OpenAI (image generation) and Vercel (hosting). Their privacy policies and data processing terms apply to data sent to those services. A formal subprocessor list will be published before production rollout.",
  },
  {
    title: "Retention",
    body: "MVP: no server-side retention of prospect photos after the request completes. Standard transient logs (IP, timestamps) may be kept for security and rate limiting. OpenAI retention follows their API policies.",
  },
  {
    title: "Your rights",
    body: "Prospects should contact the clinic that collected their photo to exercise access, erasure, or objection rights. We will support clinics with processor obligations as defined in our clinic agreement.",
  },
  {
    title: "Contact",
    body: "Privacy inquiries: privacy@example.com (replace before launch).",
  },
] as const;

export const TERMS_SECTIONS = [
  {
    title: "Service description",
    body: "Hair Hack provides an AI-generated illustration of how a prospect might appear with fuller hair. It is a consultation aid only — not medical advice, diagnosis, treatment planning, or a guarantee of surgical outcomes.",
  },
  {
    title: "Clinic license",
    body: "Access is granted to authorized clinic staff for in-clinic demonstrations. Clinics must not represent AI output as clinical evidence, guaranteed results, or before/after surgical photography.",
  },
  {
    title: "Staff responsibilities",
    body: "Staff must obtain client consent using the in-app attestation before each generation, explain the illustrative nature of the preview, and comply with local health and advertising regulations.",
  },
  {
    title: "Acceptable use",
    body: "Do not upload images of minors without guardian consent (default: adults only). Do not use client likeness in advertising or social media without separate written marketing consent. Do not attempt to bypass rate limits or security controls.",
  },
  {
    title: "Disclaimer of warranties",
    body: "The service is provided \"as is\" for demonstration purposes. We disclaim warranties regarding accuracy, fitness for a particular purpose, or regulatory compliance in your jurisdiction.",
  },
  {
    title: "Limitation of liability",
    body: "To the maximum extent permitted by law, we are not liable for decisions made by clinics or prospects based on AI illustrations. Liability caps and indemnity terms will be set in the executed clinic agreement.",
  },
  {
    title: "Changes",
    body: "These draft terms may change before formal launch. Continued use after counsel-approved terms are published constitutes acceptance of the updated terms.",
  },
] as const;
