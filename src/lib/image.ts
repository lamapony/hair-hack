import {
  ALLOWED_IMAGE_MIMES,
  type AllowedImageMime,
  MAX_IMAGE_BYTES,
} from "@/lib/constants";

export type ParsedDataUrl = {
  buffer: Buffer;
  mime: AllowedImageMime;
};

const DATA_URL_PATTERN =
  /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/;

export function parseDataUrl(dataUrl: string): ParsedDataUrl | null {
  const match = dataUrl.match(DATA_URL_PATTERN);
  if (!match) return null;

  const mime = match[1] as AllowedImageMime;
  if (!ALLOWED_IMAGE_MIMES.includes(mime)) return null;

  let buffer: Buffer;
  try {
    buffer = Buffer.from(match[2], "base64");
  } catch {
    return null;
  }

  if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) return null;

  return { buffer, mime };
}

export function extensionForMime(mime: AllowedImageMime): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}
