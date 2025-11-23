import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PromptSettings, EnhancedResponse, PromptMode, ImageModel } from "../types";

// Update schema to return an ARRAY of response objects
const enhanceSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      enhancedPrompt: {
        type: Type.STRING,
        description: "The fully engineered, improved prompt.",
      },
      explanation: {
        type: Type.STRING,
        description: "A brief explanation of the improvements.",
      },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Key themes.",
      },
      suggestedNegativePrompt: {
        type: Type.STRING,
        description: "Optional negative prompt.",
      }
    },
    required: ["enhancedPrompt", "explanation", "tags"],
  }
};

export const enhancePromptWithGemini = async (
  input: string,
  settings: PromptSettings,
  userApiKey?: string
): Promise<EnhancedResponse[]> => {
  if (!input.trim()) throw new Error("Input cannot be empty");

  // Retrieve API Key safely checking both Vite env and standard process.env
  // NOTE: In Vercel, you should set the environment variable as VITE_API_KEY
  const envKey = (import.meta as any).env?.VITE_API_KEY || process.env.API_KEY;
  const finalApiKey = userApiKey || envKey;

  if (!finalApiKey) {
    throw new Error("MISSING_API_KEY");
  }

  // Initialize client with the specific key for this request
  const ai = new GoogleGenAI({ apiKey: finalApiKey });
  const modelName = 'gemini-2.5-flash';

  let systemInstruction = `You are a world-class Prompt Engineer specializing in ${settings.mode}.
  Your goal is to generate ${settings.quantity} DISTINCT and high-quality variations of prompts based on the user's raw input.
  
  Configuration:
  - Tone: ${settings.tone}
  - Complexity: ${settings.complexity}
  - Quantity: Generate exactly ${settings.quantity} variations.
  
  Guidelines:
  1. Vary the structure, vocabulary, and angle of each prompt variation slightly to give the user options.
  2. If Mode is Coding: Focus on specific constraints, language versions, edge cases, and clean architecture requirements.
  3. If Mode is Text/LLM: Use techniques like Chain-of-Thought, persona adoption, and clear constraint setting.
  `;

  if (settings.mode === PromptMode.IMAGE_GENERATION) {
    const modelTarget = settings.imageModel || 'Generic Image Generator';
    
    systemInstruction += `\n
    SPECIFIC INSTRUCTIONS FOR IMAGE GENERATION (${modelTarget}):
    - Focus heavily on visual descriptors: lighting, texture, camera angle, lens type, color palette, and artistic style.
    `;

    // specific model tuning
    switch (settings.imageModel) {
        case ImageModel.MIDJOURNEY:
            systemInstruction += `
            - FORMAT: Use a token-based, comma-separated structure.
            - PARAMETERS: Append appropriate Midjourney parameters at the end (e.g., --v 6.1, --ar 16:9, --stylize 250, --chaos 10) depending on the context.
            - STYLE: Focus on cinematic lighting, photorealism, or specific art styles. Avoid 'In the style of' if possible, describe the visual style directly.
            `;
            break;
        case ImageModel.DALLE:
            systemInstruction += `
            - FORMAT: Use natural, descriptive English sentences. Do NOT use comma-separated lists of tags.
            - STYLE: Be extremely specific about visual details. DALL-E 3 follows instructions literally. Describe the mood, atmosphere, and composition in a narrative flow.
            - Do NOT use parameters like --v or --ar within the prompt text.
            `;
            break;
        case ImageModel.STABLE_DIFFUSION:
            systemInstruction += `
            - FORMAT: Use a mix of descriptive phrases and Danbooru-style tags, separated by commas.
            - WEIGHTING: Use (keyword:1.2) syntax for emphasis where necessary.
            - STRUCTURE: [Subject], [Action/Context], [Art Style/Medium], [Lighting], [Camera/Technical Details].
            `;
            break;
        case ImageModel.WISK:
            systemInstruction += `
            - FORMAT: Clean, high-fidelity descriptive sentences combined with key visual tokens.
            - STYLE: Focus on commercial quality, advertising standards, and realistic composition.
            `;
            break;
        default:
            systemInstruction += `\nEnsure the output is comma-separated or descriptive sentences suitable for text-to-image models.`;
    }
    
    if (settings.includeNegatives) {
        systemInstruction += "\nIMPORTANT: You MUST generate a high-quality 'suggestedNegativePrompt' for each variation that includes technical terms (blur, bad anatomy, etc.) and content-specific exclusions.";
    } else {
        systemInstruction += "\nIMPORTANT: Do NOT generate a 'suggestedNegativePrompt'. Leave it empty string.";
    }
  }

  try {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out after 30 seconds. The AI model is taking too long to respond.")), 30000);
    });

    const apiCall = ai.models.generateContent({
      model: modelName,
      contents: input,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: enhanceSchema,
        temperature: 0.85, // Slightly higher for more creative variance between image models
      }
    });

    const response = await Promise.race([apiCall, timeoutPromise]) as any;

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as EnhancedResponse[];
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const msg = error.message || error.toString();

    if (msg.includes("timed out") || msg.includes("taking too long")) {
        throw error;
    }
    
    if (msg.includes("API key") || msg.includes("403") || msg.includes("400")) {
        throw new Error("INVALID_API_KEY");
    }
    
    throw new Error(msg || "Failed to enhance prompt. Please try again.");
  }
};