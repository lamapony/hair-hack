import OpenAI, { toFile } from "openai";
import { buildPrompt } from "@/lib/prompts";
import { extensionForMime } from "@/lib/image";
import { resolveOpenAIImageQuality } from "@/lib/openai-image-config";
import type { AllowedImageMime } from "@/lib/constants";
import type {
  ImageProvider,
  ProviderGenerateInput,
  ProviderGenerateResult,
} from "@/lib/providers/types";

export type OpenAIProviderOptions = {
  apiKey: string;
  model?: string;
  client?: OpenAI;
};

export function createOpenAIProvider(
  options: OpenAIProviderOptions,
): ImageProvider {
  const client = options.client ?? new OpenAI({ apiKey: options.apiKey });
  const model = options.model ?? process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2";

  return {
    id: "openai",
    async generate(input: ProviderGenerateInput): Promise<ProviderGenerateResult> {
      const ext = extensionForMime(input.mime as AllowedImageMime);
      const file = await toFile(input.buffer, `photo.${ext}`, {
        type: input.mime,
      });

      const result = await client.images.edit({
        model,
        image: file,
        prompt: buildPrompt(input.goal),
        quality: resolveOpenAIImageQuality(),
        n: 1,
        size: "auto",
      });

      const item = result.data?.[0];
      if (!item) {
        throw new Error("OpenAI returned no image");
      }

      const image =
        item.b64_json != null
          ? `data:image/png;base64,${item.b64_json}`
          : item.url;

      if (!image) {
        throw new Error("Empty response from OpenAI");
      }

      return { image, goal: input.goal };
    },
  };
}
