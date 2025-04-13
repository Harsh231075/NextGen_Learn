import getSystemInstruction from "./role.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFormattedPrompt } from "./promptHandler.js";


async function generateContent(role, promptType, variables) {

  // console.log("Role:", role);
  // console.log("Prompt Type:", promptType);
  // console.log("Variables:", variables);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    let model;
    if (role === "performance") {

      model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        // systemInstruction: getSystemInstruction(role), // AI Role
      });
    } else {
      model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: getSystemInstruction(role), // AI Role
      });
    }
    const formattedPrompt = getFormattedPrompt(promptType, variables);
    console.log("Final Prompt:", formattedPrompt);
    const result = await model.generateContent(formattedPrompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Error generating AI response.";
  }
}

export default generateContent;
