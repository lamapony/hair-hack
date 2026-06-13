export type PreviewGoal = "density" | "hairline" | "full";

export type GenerateRequest = {
  image: string;
  goal: PreviewGoal;
};

export type GenerateResponse = {
  image: string;
  goal: PreviewGoal;
};

export type ErrorResponse = {
  error: string;
};

export const GOAL_LABELS: Record<PreviewGoal, string> = {
  density: "Hair density",
  hairline: "Hairline",
  full: "Full preview",
};

export const GOAL_HINTS: Record<PreviewGoal, string> = {
  density: "Fill thinning areas with natural texture",
  hairline: "Restore the frontal hairline",
  full: "Improve density and hairline together",
};
