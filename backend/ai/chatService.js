import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔹 API Key load karo
const genAI = new GoogleGenerativeAI('AIzaSyCBkGF3NMHPpvGzuEhPcBpZmnjjjD3Eb38');

// 🔹 Gemini se AI response lene ka function
const generateAIResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `
      tum ek ai asstaint ho jo user ko response dega okay uske question ke, tume direct answer doge and smothly and respectfully okay 
      exmple of chat=>
      user-  hello
      you- hello how i am help you

      aise bat karna okay tum koi extar faltu response mat dena thik 
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
