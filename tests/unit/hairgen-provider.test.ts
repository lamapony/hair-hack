import { describe, expect, it, vi } from "vitest";
import { createHairgenProvider } from "@/lib/providers/hairgen";

const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

describe("createHairgenProvider", () => {
  it("returns data URL from Hairgen render + image fetch", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ url: "https://cdn.example/render.jpg" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: () => "image/jpeg" },
        arrayBuffer: async () => Uint8Array.from([1, 2, 3]).buffer,
      });

    const provider = createHairgenProvider({
      apiKey: "hairgen-test",
      fetchImpl: fetchImpl as never,
    });

    const result = await provider.generate({
      buffer: TINY_PNG,
      mime: "image/png",
      goal: "full",
    });

    expect(result.goal).toBe("full");
    expect(result.image).toBe("data:image/jpeg;base64,AQID");
    expect(fetchImpl).toHaveBeenCalledTimes(2);

    const [renderUrl, renderInit] = fetchImpl.mock.calls[0];
    expect(renderUrl).toBe("https://api.hairgen.ai/v1/render");
    expect(renderInit.method).toBe("POST");
    expect(renderInit.headers.Authorization).toBe("hairgen-test");
    expect(renderInit.body).toBeInstanceOf(FormData);
  });

  it("throws when Hairgen rejects the API key", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ error: "Forbidden" }),
    });

    const provider = createHairgenProvider({
      apiKey: "bad-key",
      fetchImpl: fetchImpl as never,
    });

    await expect(
      provider.generate({
        buffer: TINY_PNG,
        mime: "image/png",
        goal: "density",
      }),
    ).rejects.toThrow(/API key rejected/i);
  });
});
