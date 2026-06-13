export const CONSENT_ITEMS = [
  {
    id: "explainedAiOnly",
    label:
      "I have explained to the client that this is an AI illustration only, not a medical prediction or guarantee of surgical results.",
  },
  {
    id: "clientConsent",
    label:
      "The client consents to their photo being processed by our service and OpenAI for this single preview session.",
  },
  {
    id: "noServerRetention",
    label:
      "The client understands photos are not stored on our servers after this session (MVP).",
  },
  {
    id: "clientIsAdult",
    label:
      "The client is 18 or older (or I have parental/guardian consent if applicable).",
  },
] as const;

export type ConsentId = (typeof CONSENT_ITEMS)[number]["id"];

export type StaffConsent = Record<ConsentId, boolean>;

export const DISCLAIMER_BANNER =
  "Illustrative preview only. This AI-generated image is for consultation discussion. It does not constitute medical advice, diagnosis, or a promise of treatment outcomes. Results vary. A qualified physician must assess candidacy and plan any procedure.";

export const FOOTER_DISCLAIMER =
  "Hair Hack is a clinic sales demo tool. AI previews are illustrative only — not medical advice, diagnosis, or guaranteed outcomes.";

export const POST_RESULT_REMINDER =
  "Do not use this image in advertising or social media with the client's likeness without separate written marketing consent.";

export const CONSENT_REQUIRED_ERROR =
  "Staff consent is required before generating a preview.";

export function createEmptyConsent(): StaffConsent {
  return {
    explainedAiOnly: false,
    clientConsent: false,
    noServerRetention: false,
    clientIsAdult: false,
  };
}

export function isConsentComplete(consent: StaffConsent): boolean {
  return CONSENT_ITEMS.every((item) => consent[item.id]);
}
