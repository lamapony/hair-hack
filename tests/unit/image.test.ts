import { describe, expect, it } from "vitest";
import { MAX_IMAGE_BYTES } from "@/lib/constants";
import { extensionForMime, parseDataUrl } from "@/lib/image";

function tinyPngDataUrl(): string {
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  return `data:image/png;base64,${png.toString("base64")}`;
}

describe("parseDataUrl", () => {
  it("parses a valid PNG data URL", () => {
    const result = parseDataUrl(tinyPngDataUrl());
    expect(result).not.toBeNull();
    expect(result?.mime).toBe("image/png");
    expect(result?.buffer.length).toBeGreaterThan(0);
  });

  it("rejects unsupported mime types", () => {
    const bad = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    expect(parseDataUrl(bad)).toBeNull();
  });

  it("rejects oversize payloads", () => {
    const big = Buffer.alloc(MAX_IMAGE_BYTES + 1, 1);
    const dataUrl = `data:image/png;base64,${big.toString("base64")}`;
    expect(parseDataUrl(dataUrl)).toBeNull();
  });

  it("rejects malformed base64", () => {
    expect(parseDataUrl("data:image/png;base64,not!!!valid")).toBeNull();
  });
});

describe("extensionForMime", () => {
  it("maps known mime types", () => {
    expect(extensionForMime("image/png")).toBe("png");
    expect(extensionForMime("image/webp")).toBe("webp");
    expect(extensionForMime("image/jpeg")).toBe("jpg");
  });
});
