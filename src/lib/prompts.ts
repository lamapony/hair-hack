import type { PreviewGoal } from "@/lib/types";

const PRESERVATION =
  "Keep the person's identity, facial features, skin tone, expression, lighting, and background exactly the same. Do not change age, ethnicity, or non-hair areas.";

const CONSULTATION_FRAMING =
  "Photorealistic AI illustration for medical consultation discussion only — not a guaranteed surgical outcome.";

const GOAL_PROMPTS: Record<PreviewGoal, string> = {
  density: `Edit this photo to show a realistic consultation illustration after hair density restoration. Add natural, age-appropriate fullness in visibly thinning areas (temples, crown, and part line) while matching existing hair color, texture, and growth direction. Avoid a wig-like look or impossible density. ${PRESERVATION} ${CONSULTATION_FRAMING}`,
  hairline: `Edit this photo to show a realistic consultation illustration after hairline restoration. Refine the frontal hairline with soft, natural density and a mature, age-appropriate shape. Keep the original hair color and blend with existing temples. Do not lower the hairline unrealistically or alter eyebrows. ${PRESERVATION} ${CONSULTATION_FRAMING}`,
  full: `Edit this photo to show a realistic consultation illustration after comprehensive hair restoration. Improve both frontal hairline and mid-scalp/crown density with natural blending, matching existing hair color, texture, and growth direction. Moderate improvement only — credible for consultation, not a dramatic makeover. ${PRESERVATION} ${CONSULTATION_FRAMING}`,
};

export function buildPrompt(goal: PreviewGoal): string {
  return GOAL_PROMPTS[goal];
}
