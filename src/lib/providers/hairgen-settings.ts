import type { PreviewGoal } from "@/lib/types";

export type HairgenRenderSettings = {
  density: number;
  male: boolean;
  widowsPeak: boolean;
  hairstyle: string;
  color: string;
};

/** Maps Hair Hack preview goals to Hairgen render settings (spike approximation). */
export function renderSettingsForGoal(goal: PreviewGoal): HairgenRenderSettings {
  switch (goal) {
    case "density":
      return {
        density: 100,
        male: true,
        widowsPeak: false,
        hairstyle: "automatic",
        color: "automatic",
      };
    case "hairline":
      return {
        density: 75,
        male: true,
        widowsPeak: false,
        hairstyle: "automatic",
        color: "automatic",
      };
    case "full":
      return {
        density: 100,
        male: true,
        widowsPeak: false,
        hairstyle: "automatic",
        color: "automatic",
      };
  }
}
