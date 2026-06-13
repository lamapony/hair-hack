import type { PreviewGoal } from "@/lib/types";

const GOAL_PROMPTS: Record<PreviewGoal, string> = {
  density:
    "Edit this photo to show a realistic preview after hair density treatment. Add natural-looking fuller hair in thinning areas on the scalp. Keep the person's face, skin tone, expression, lighting, and background exactly the same. Photorealistic, medical consultation quality.",
  hairline:
    "Edit this photo to show a realistic preview after hairline restoration. Improve the frontal hairline with natural density while keeping the person's face, features, skin tone, expression, lighting, and background unchanged. Photorealistic, medical consultation quality.",
  full: "Edit this photo to show a realistic preview after comprehensive hair restoration treatment. Improve both hair density and hairline naturally. Keep the person's face, skin tone, expression, lighting, and background exactly the same. Photorealistic, medical consultation quality.",
};

export function buildPrompt(goal: PreviewGoal): string {
  return GOAL_PROMPTS[goal];
}
