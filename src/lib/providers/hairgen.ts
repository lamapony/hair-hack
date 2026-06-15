import { extensionForMime } from "@/lib/image";
import type { AllowedImageMime } from "@/lib/constants";
import { buildPlaceholderScalpMask } from "@/lib/providers/hairgen-mask";
import { renderSettingsForGoal } from "@/lib/providers/hairgen-settings";
import type {
  ImageProvider,
  ProviderGenerateInput,
  ProviderGenerateResult,
} from "@/lib/providers/types";

const HAIRGEN_RENDER_URL = "https://api.hairgen.ai/v1/render";

export type HairgenProviderOptions = {
  apiKey: string;
  fetchImpl?: typeof fetch;
};

type HairgenRenderResponse = {
  url?: string;
  error?: string;
};

export function createHairgenProvider(
  options: HairgenProviderOptions,
): ImageProvider {
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    id: "hairgen",
    async generate(input: ProviderGenerateInput): Promise<ProviderGenerateResult> {
      const mime = input.mime as AllowedImageMime;
      const ext = extensionForMime(mime);
      const mask = buildPlaceholderScalpMask(input.buffer, mime);
      const renderSettings = renderSettingsForGoal(input.goal);

      const form = new FormData();
      form.append(
        "photo",
        new Blob([Uint8Array.from(input.buffer)], { type: mime }),
        `photo.${ext}`,
      );
      form.append(
        "mask",
        new Blob([Uint8Array.from(mask)], { type: "image/png" }),
        "mask.png",
      );
      form.append("format", "jpeg");
      form.append("renderSettings", JSON.stringify(renderSettings));

      const response = await fetchImpl(HAIRGEN_RENDER_URL, {
        method: "POST",
        headers: {
          Authorization: options.apiKey,
        },
        body: form,
      });

      let payload: HairgenRenderResponse;
      try {
        payload = (await response.json()) as HairgenRenderResponse;
      } catch {
        throw new Error(`Hairgen returned invalid JSON (${response.status})`);
      }

      if (!response.ok) {
        const detail = payload.error ?? `HTTP ${response.status}`;
        if (response.status === 403) {
          throw new Error(`Hairgen API key rejected: ${detail}`);
        }
        throw new Error(`Hairgen render failed: ${detail}`);
      }

      if (!payload.url) {
        throw new Error("Hairgen returned no image URL");
      }

      const imageResponse = await fetchImpl(payload.url);
      if (!imageResponse.ok) {
        throw new Error(`Hairgen image download failed (${imageResponse.status})`);
      }

      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
      const image = `data:${contentType};base64,${imageBuffer.toString("base64")}`;

      return { image, goal: input.goal };
    },
  };
}
