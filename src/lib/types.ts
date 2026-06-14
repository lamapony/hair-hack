import type { StaffConsent } from "@/lib/consent";
import { CLINIC_GOALS } from "@/lib/clinic-copy";

export type PreviewGoal = "density" | "hairline" | "full";

export type GenerateRequest = {
  image: string;
  goal: PreviewGoal;
  consent: StaffConsent;
};

export type GenerateResponse = {
  image: string;
  goal: PreviewGoal;
};

export type ErrorResponse = {
  error: string;
};

export const GOAL_LABELS: Record<PreviewGoal, string> = {
  density: CLINIC_GOALS.density.label,
  hairline: CLINIC_GOALS.hairline.label,
  full: CLINIC_GOALS.full.label,
};

export const GOAL_HINTS: Record<PreviewGoal, string> = {
  density: CLINIC_GOALS.density.hint,
  hairline: CLINIC_GOALS.hairline.hint,
  full: CLINIC_GOALS.full.hint,
};
