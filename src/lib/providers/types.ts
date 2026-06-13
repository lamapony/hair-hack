import type { PreviewGoal } from "@/lib/types";

export type ProviderGenerateInput = {
  buffer: Buffer;
  mime: string;
  goal: PreviewGoal;
};

export type ProviderGenerateResult = {
  image: string;
  goal: PreviewGoal;
};

export type ImageProviderId = "openai" | "hairgen";

export interface ImageProvider {
  readonly id: ImageProviderId;
  generate(input: ProviderGenerateInput): Promise<ProviderGenerateResult>;
}
