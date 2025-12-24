
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTroubleshootingAdvice = async (issue: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `An incident occurred in our cloud infrastructure: "${issue}". 
      As a senior DevOps mentor, provide a concise troubleshooting guide for a junior analyst. 
      Include 3 actionable steps and a brief explanation of why this might happen in an enterprise setting. 
      Format the response in clear Markdown.`,
      config: {
        systemInstruction: "You are a senior DevOps lead at a top global consulting firm (Deloitte style). You are professional, precise, and educational.",
        temperature: 0.7,
      }
    });
    return response.text || "Sorry, I couldn't analyze the issue at this moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to the mentor AI. Please check the logs manually.";
  }
};
