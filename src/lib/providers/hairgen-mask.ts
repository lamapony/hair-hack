import type { AllowedImageMime } from "@/lib/constants";

export type ImageDimensions = {
  width: number;
  height: number;
};

/** 64×64 elliptical scalp mask — spike placeholder (fixed size). */
const PLACEHOLDER_MASK_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAAaklEQVR4nO2UMQ6AMAzE+v9Pw4REgSSX3gBI9m5PuYwBKduBoZ6xZD2S6mWitIuG6EcFWQ8SLf+h0PRvhbZ/LbiBBX8uEPhC4P1D8rfgr9H/B/5HkhOxLiVyvWoIdhzR5bm06AEAAMBv2QFzWZ6adijldwAAAABJRU5ErkJggg==",
  "base64",
);

/** Reads width/height from PNG or JPEG buffers; falls back when unknown. */
export function readImageDimensions(
  buffer: Buffer,
  mime: AllowedImageMime,
): ImageDimensions {
  if (mime === "image/png" && buffer.length >= 24) {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    if (width > 0 && height > 0 && width <= 8192 && height <= 8192) {
      return { width, height };
    }
  }

  if (mime === "image/jpeg") {
    const dims = readJpegDimensions(buffer);
    if (dims) return dims;
  }

  return { width: 1024, height: 1024 };
}

function readJpegDimensions(buffer: Buffer): ImageDimensions | null {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      if (width > 0 && height > 0) return { width, height };
      return null;
    }

    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }

    const segmentLength = buffer.readUInt16BE(offset + 2);
    if (segmentLength < 2) return null;
    offset += 2 + segmentLength;
  }

  return null;
}

/**
 * Spike placeholder: fixed-size elliptical scalp mask.
 * Production needs real scalp segmentation matched to photo dimensions.
 */
export function buildPlaceholderScalpMask(
  _buffer: Buffer,
  _mime: AllowedImageMime,
): Buffer {
  return PLACEHOLDER_MASK_PNG;
}
