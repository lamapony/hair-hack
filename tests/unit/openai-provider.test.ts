import { describe, expect, it, vi } from "vitest";
import { createOpenAIProvider } from "@/lib/providers/openai";

describe("createOpenAIProvider", () => {
  it("returns base64 data URL from OpenAI response", async () => {
    const client = {
      images: {
        edit: vi.fn().mockResolvedValue({
          data: [{ b64_json: "abc123" }],
        }),
      },
    };

    const provider = createOpenAIProvider({
      apiKey: "test-key",
      client: client as never,
    });

    const result = await provider.generate({
      buffer: Buffer.from("fake"),
      mime: "image/png",
      goal: "density",
    });

    expect(result.image).toBe("data:image/png;base64,abc123");
    expect(result.goal).toBe("density");
    expect(client.images.edit).toHaveBeenCalledOnce();
  });
});
