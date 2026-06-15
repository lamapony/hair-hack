import { MAX_IMAGE_BYTES } from "@/lib/constants";

/** Longest edge cap before upload (matches PLAN.md). */
export const MAX_UPLOAD_DIMENSION = 2048;

/** Reject absurdly large picker files before decode. */
export const MAX_INPUT_FILE_BYTES = 25 * 1024 * 1024;

export type ScaledDimensions = {
  width: number;
  height: number;
  scaled: boolean;
};

export function scaleToFit(
  width: number,
  height: number,
  maxDimension: number,
): ScaledDimensions {
  const maxSide = Math.max(width, height);
  if (maxSide <= maxDimension) {
    return { width, height, scaled: false };
  }
  const ratio = maxDimension / maxSide;
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
    scaled: true,
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

function dataUrlByteLength(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}

function outputMimeFor(file: File): "image/jpeg" | "image/png" | "image/webp" {
  if (file.type === "image/png") return "image/png";
  if (file.type === "image/webp") return "image/webp";
  return "image/jpeg";
}

/**
 * Downscale large photos before API upload. Re-encodes when over byte limit.
 * Browser-only (uses canvas + createImageBitmap).
 */
export async function prepareImageDataUrl(
  file: File,
  maxDimension = MAX_UPLOAD_DIMENSION,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const target = scaleToFit(bitmap.width, bitmap.height, maxDimension);
    const needsResize =
      target.scaled || file.size > MAX_IMAGE_BYTES;

    if (!needsResize) {
      return readFileAsDataUrl(file);
    }

    const canvas = document.createElement("canvas");
    canvas.width = target.width;
    canvas.height = target.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("canvas unavailable");
    }
    ctx.drawImage(bitmap, 0, 0, target.width, target.height);

    const mime = outputMimeFor(file);
    const qualities = mime === "image/jpeg" ? [0.9, 0.75, 0.6] : [undefined];

    for (const quality of qualities) {
      const dataUrl = canvas.toDataURL(mime, quality);
      if (dataUrlByteLength(dataUrl) <= MAX_IMAGE_BYTES) {
        return dataUrl;
      }
    }

    throw new Error("image too large after resize");
  } finally {
    bitmap.close();
  }
}
