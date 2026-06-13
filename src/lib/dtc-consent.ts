import {
  createEmptyConsent,
  isConsentComplete,
  type ConsentId,
  type StaffConsent,
} from "@/lib/consent";

export const DTC_CONSENT_ITEMS = [
  {
    id: "explainedAiOnly",
    label:
      "I understand this is an AI illustration only — not medical advice, diagnosis, or a guarantee of treatment results.",
  },
  {
    id: "clientConsent",
    label:
      "I consent to my photo being processed by Hair Hack and OpenAI to generate this one-time preview.",
  },
  {
    id: "noServerRetention",
    label:
      "I understand my photo is not stored on Hair Hack servers after this session (MVP).",
  },
  {
    id: "clientIsAdult",
    label: "I am 18 years of age or older.",
  },
] as const satisfies ReadonlyArray<{ id: ConsentId; label: string }>;

export const DTC_DISCLAIMER =
  "Illustrative only, not medical advice. AI previews are for personal exploration — not a promise of surgical or treatment outcomes.";

export const DTC_FOOTER_DISCLAIMER =
  "Hair Hack previews are AI-generated illustrations only. Results vary. Consult a qualified physician before any procedure.";

export { createEmptyConsent, isConsentComplete, type ConsentId, type StaffConsent };
