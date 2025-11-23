import { PromptMode, PromptTone, ImageModel } from "./types";
import { Image, Type, Code, BookOpen, PenTool } from 'lucide-react';

export const MODE_OPTIONS = [
  { value: PromptMode.IMAGE_GENERATION, label: 'Image Generation', icon: Image, description: 'Optimized for Midjourney, Stable Diffusion, DALL-E 3' },
  { value: PromptMode.TEXT_GENERATION, label: 'General LLM', icon: Type, description: 'Standard instruction optimization for chat models' },
  { value: PromptMode.CODING_ASSISTANCE, label: 'Coding', icon: Code, description: 'Structured requirements for code generation' },
  { value: PromptMode.CREATIVE_WRITING, label: 'Storytelling', icon: PenTool, description: 'Narrative and descriptive enhancements' },
  { value: PromptMode.ACADEMIC, label: 'Academic', icon: BookOpen, description: 'Formal, cited, and rigorous structure' },
];

export const TONE_OPTIONS = [
  { value: PromptTone.CREATIVE, label: 'Creative' },
  { value: PromptTone.PRECISE, label: 'Precise' },
  { value: PromptTone.DESCRIPTIVE, label: 'Descriptive' },
  { value: PromptTone.CONCISE, label: 'Concise' },
  { value: PromptTone.PROFESSIONAL, label: 'Professional' },
];

export const IMAGE_MODEL_OPTIONS = [
  { value: ImageModel.MIDJOURNEY, label: 'Midjourney' },
  { value: ImageModel.DALLE, label: 'DALL-E 3' },
  { value: ImageModel.STABLE_DIFFUSION, label: 'Stable Diffusion' },
  { value: ImageModel.WISK, label: 'Wisk AI' },
];