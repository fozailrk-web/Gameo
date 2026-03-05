import { GoogleGenAI } from "@google/genai";

export const generateVideoFromStory = async (story: string, onProgress: (msg: string) => void) => {
  let apiKey = process.env.GEMINI_API_KEY;
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      // @ts-ignore
      apiKey = process.env.API_KEY;
    }
  } catch (e) {
    // Ignore
  }
  
  if (!apiKey) throw new Error("API key not found");

  const ai = new GoogleGenAI({ apiKey });

  onProgress("Analyzing story for visual prompt...");
  
  const promptResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Convert the following cinematic story into a single, highly detailed, and descriptive visual prompt for an AI video generator. 
    The prompt should describe a cinematic scene with specific details on:
    - Subject: What is happening? (e.g., glowing data streams, a high-tech control room, a global logistics map, or a bustling futuristic warehouse).
    - Style: Cinematic, photorealistic, high-tech, and professional.
    - Lighting: Dramatic lighting, neon glows, volumetric lighting, or soft professional studio lighting.
    - Camera Movement: Slow tracking shot, sweeping crane shot, or dynamic zoom to create depth.
    - Colors: Professional blue and white palette with vibrant accents like emerald or gold.
    
    Ensure the description is a single continuous paragraph that is evocative and visually rich, suitable for a high-end business documentary.
    
    Story:
    ${story}
    
    Visual Prompt:`
  });
  
  const videoPrompt = promptResponse.text?.trim() || "A high-tech cinematic 3D data visualization glowing in blue and white, showing business growth and logistics networks.";
  
  onProgress(`Generating video: "${videoPrompt}"... (This may take a few minutes)`);

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: videoPrompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({operation: operation});
    onProgress("Still generating video... Please wait.");
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed.");

  onProgress("Fetching video...");

  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': apiKey,
    },
  });
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const askAIAssistant = async (query: string, contextData: any) => {
  let apiKey = process.env.GEMINI_API_KEY;
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      // @ts-ignore
      apiKey = process.env.API_KEY;
    }
  } catch (e) {
    // Ignore
  }
  
  if (!apiKey) throw new Error("API key not found");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a helpful AI data assistant for a dashboard application.
    The user is asking: "${query}"
    
    Here is some context about the current dashboard state:
    ${JSON.stringify(contextData).substring(0, 1000)}
    
    Provide a concise, helpful response (max 3 sentences) addressing their query.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
};
export const generateStoryAndInsights = async (
  dataSummary: string,
  events: string[],
  instructions: string,
  preprocessingCode: string
) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a senior data analyst and cinematic storyteller.
    
    I have a dataset with the following summary:
    ${dataSummary}
    
    The user provided these business events that occurred during this period:
    ${events.length > 0 ? events.map(e => "- " + e).join('\n') : "None provided."}
    
    The user provided these instructions for analysis:
    ${instructions || "None provided."}
    
    The user provided this preprocessing code (for context):
    ${preprocessingCode || "None provided."}
    
    Please provide:
    1. **Data Insights**: 3-5 bullet points highlighting key anomalies, highest performing areas, and impact of the business events.
    2. **Cinematic Story**: A compelling, narrative-driven story (like a video script or documentary narration) that explains the data journey, incorporating the business events and logistics failures. Make it dramatic but data-driven.
    
    Format your response exactly like this:
    
    ---INSIGHTS---
    [Your bullet points here]
    
    ---STORY---
    [Your cinematic story here]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text || "";
    
    const insightsMatch = text.match(/---INSIGHTS---([\s\S]*?)---STORY---/);
    const storyMatch = text.match(/---STORY---([\s\S]*)/);
    
    return {
      insights: insightsMatch ? insightsMatch[1].trim() : "Failed to generate insights.",
      story: storyMatch ? storyMatch[1].trim() : "Failed to generate story."
    };
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
