export enum PromptMode {
  IMAGE_GENERATION = 'Image Generation (Midjourney/DALL-E)',
  TEXT_GENERATION = 'LLM (ChatGPT/Gemini/Claude)',
  CODING_ASSISTANCE = 'Coding Assistant',
  CREATIVE_WRITING = 'Creative Writing',
  ACADEMIC = 'Academic/Research'
}

export enum PromptTone {
  CREATIVE = 'Creative',
  PRECISE = 'Precise',
  DESCRIPTIVE = 'Descriptive',
  CONCISE = 'Concise',
  PROFESSIONAL = 'Professional'
}

export enum ImageModel {
  MIDJOURNEY = 'Midjourney v6',
  DALLE = 'DALL-E 3',
  STABLE_DIFFUSION = 'Stable Diffusion XL',
  WISK = 'Wisk AI'
}

export interface PromptSettings {
  mode: PromptMode;
  imageModel?: ImageModel; // Optional, only for Image Generation
  tone: PromptTone;
  includeNegatives: boolean; // Relevant for Image Gen
  complexity: 'Basic' | 'Intermediate' | 'Advanced';
  quantity: number;
}

export interface EnhancedResponse {
  enhancedPrompt: string;
  explanation: string;
  tags: string[];
  suggestedNegativePrompt?: string; // Optional, mostly for image gen
}

export interface HistoryItem extends EnhancedResponse {
  id: string;
  originalPrompt: string;
  timestamp: number;
  mode: PromptMode;
}