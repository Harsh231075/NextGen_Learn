import { GoogleGenerativeAI } from "@google/generative-ai";

const generateAIResponse = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  // console.log("Your Gemini Key:", apiKey); // Debug

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `
        tum ek ai assistant ho jo user ko response dega, direct and respectful.
        example =>
        user- hello
        you- hello how can I help you
      `
    });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return null;
  }
};

export default generateAIResponse;
