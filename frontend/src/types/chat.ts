export type MessageRole = "user" | "assistant" | "system";

export type ImageStatus = "pending" | "generating" | "completed" | "failed";

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  seed?: number;
  model?: string;
  createdAt: Date;
  status: ImageStatus;
}

export interface ImageVariation {
  type: "upscale" | "variation" | "remix" | "edit";
  originalImageId: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  images?: GeneratedImage[];
  variation?: ImageVariation;
  createdAt: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerationSettings {
  model: string;
  width: number;
  height: number;
  steps?: number;
  guidance?: number;
  negativePrompt?: string;
  seed?: number;
  numberOfImages: number;
}

export const DEFAULT_SETTINGS: GenerationSettings = {
  model: "stable-diffusion-xl",
  width: 1024,
  height: 1024,
  steps: 30,
  guidance: 7.5,
  numberOfImages: 4,
};

export const ASPECT_RATIOS = [
  { label: "1:1", width: 1024, height: 1024 },
  { label: "16:9", width: 1344, height: 768 },
  { label: "9:16", width: 768, height: 1344 },
  { label: "4:3", width: 1152, height: 896 },
  { label: "3:4", width: 896, height: 1152 },
  { label: "3:2", width: 1216, height: 832 },
  { label: "2:3", width: 832, height: 1216 },
] as const;
