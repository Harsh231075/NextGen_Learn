import { GoogleGenerativeAI } from "@google/generative-ai";

const generateAIResponse = async (conversation) => {
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `
  Tum ek AI assistant ho.
  Hamesha short, clear aur concise jawab do.
  Jab tak user specifically nahi kehta "detail me batao", "explain karo", "bada answer do",
  tab tak lambe jawab mat dena.
  Agar user kahe to phir detailed aur achha explain karte hue lamba jawab do.
  Direct aur respectful tone maintain karo.
  Example:
    User: Hello
    You: Hello! How can I help you?
  
    User: Java kya hai?
    You: Java ek object-oriented programming language hai.

    User: Java ko detail me samjhao
    You: (Tab pura detailed explanation dena)
`

    });

    // 🔥 Conversation ko Gemini ke required format me convert karo
    const formattedHistory = conversation.map((msg) => ({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const userMessage = conversation[conversation.length - 1].content;

    // console.log(userMessage)

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return null;
  }
};

export default generateAIResponse;
