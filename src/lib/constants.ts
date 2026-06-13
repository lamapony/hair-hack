import type { PreviewGoal } from "@/lib/types";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export const VALID_PREVIEW_GOALS: readonly PreviewGoal[] = [
  "density",
  "hairline",
  "full",
] as const;

export const ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageMime = (typeof ALLOWED_IMAGE_MIMES)[number];
