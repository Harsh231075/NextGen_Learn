import { GoogleGenerativeAI } from "@google/generative-ai";
import { getEnv } from "../utils/getEnv.js";

const genAI = new GoogleGenerativeAI(getEnv("GEMINI_API_KEY"));

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
};

export const generateText = async (prompt) => {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};

// export const generateTextWithContext = async (prompt, context) => {
//   const model = getGeminiModel();
//   const result = await model.generateContent(prompt, { context });
//   const response = result.response;
//   return response.text();
// }

// export const generateTextWithContextAndMemory = async (prompt, context, memory) => {
//   const model = getGeminiModel();
//   const result = await model.generateContent(prompt, { context, memory });
//   const response = result.response;
//   return response.text();
// }
