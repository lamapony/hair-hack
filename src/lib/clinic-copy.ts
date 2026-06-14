import type { PreviewGoal } from "@/lib/types";

export const CLINIC_APP = {
  badge: "Clinic demo",
  title: "Hair Hack",
  subtitle:
    "Help prospects visualize fuller hair during the consultation. Staff-operated — illustrative only, not a treatment guarantee.",
} as const;

export const CLINIC_METADATA = {
  title: "Hair Hack — Clinic consultation demo",
  description:
    "Staff-operated AI illustration tool for hair restoration consultations. Upload a prospect photo and compare before/after during the visit.",
} as const;

export const CLINIC_WORKFLOW_STEPS = [
  "Add a clear, front-facing prospect photo.",
  "Choose the treatment focus for the illustration.",
  "Complete staff attestations with the client.",
  "Generate and use the slider to discuss possibilities.",
] as const;

export const CLINIC_SECTIONS = {
  treatmentFocus: "Treatment focus",
  prospectPhoto: "Prospect photo",
  consultationPreview: "Consultation preview",
} as const;

export const CLINIC_GOALS: Record<
  PreviewGoal,
  { label: string; hint: string }
> = {
  density: {
    label: "Density",
    hint: "Illustrate fuller coverage in thinning areas",
  },
  hairline: {
    label: "Hairline",
    hint: "Illustrate a natural frontal hairline",
  },
  full: {
    label: "Full transformation",
    hint: "Show density and hairline improvements together",
  },
};

export const CLINIC_UPLOAD = {
  addTitle: "Add prospect photo",
  replaceTitle: "Replace prospect photo",
  hint: "Front-facing, good lighting · JPEG, PNG, WebP · up to 8 MB",
} as const;

export const CLINIC_ACTIONS = {
  generate: "Generate AI illustration",
  generating: "Generating illustration…",
  cancel: "Cancel generation",
  downloadAfter: "Download illustration",
} as const;

export const CLINIC_MESSAGES = {
  consentRequired:
    "Complete all staff attestations with the client before generating.",
  emptyResult: "Add a prospect photo to start the consultation preview.",
  beforeOnly:
    "Complete consent, then generate an AI illustration to compare with the slider.",
  loadingPrimary: "Creating AI illustration…",
  loadingSecondary:
    "Usually 30–90 seconds. Stay on this screen with the client.",
} as const;

export const CLINIC_CONSENT = {
  legend: "Staff attestation (required)",
  helper: "Confirm each point with the client before generating.",
} as const;

export const CLINIC_SLIDER = {
  caption: "Consultation compare",
  beforeLabel: "Client photo",
  afterLabel: "AI illustration",
  download: "Download illustration",
  help: "Drag the handle or use arrow keys. Shift + arrow moves in 10% steps.",
} as const;
