import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are a helpful teacher. 
Always explain topics clearly, as if you're teaching a student. 
Use simple language and do not confuse the user. 
Teach like a human teacher would do in a classroom.`;

export const askAI = async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const { message } = req.body;
    // const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_INSTRUCTION, // AI Role
    });
    const result = await model.generateContent(message);
    const response = result.response.text();

    res.status(200).json({ reply: response });

  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
