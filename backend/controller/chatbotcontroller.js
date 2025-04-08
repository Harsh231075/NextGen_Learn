import ChatHistory from "../model/ChatHistoryModel.js";
import User from "../model/userModel.js";
import generateAIResponse from "../ai/chatService.js";

export const chatWithAI = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt } = req.body;

    if (!userId || !prompt) {
      return res.status(400).json({ error: "User ID and prompt are required" });
    }

    // 🔹 **User check karo**
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔹 **Chat history fetch karo**
    let chat = await ChatHistory.findOne({ userId });

    // **Agar nahi mila toh naya doc create karo**
    if (!chat) {
      chat = new ChatHistory({ userId, messages: [] });
      await chat.save(); // **Document ko save karna zaroori hai**
    }

    // 🔹 **Last 5 messages as context**
    const lastMessages = chat.messages.map(msg => `${msg.role}: ${msg.content}`).join("\n");

    // 🔹 **AI ko chat history ke saath prompt bhejo**
    const aiPrompt = `Chat History:\n${lastMessages}\n\nUser: ${prompt}\nBot:`;
    const aiResponse = await generateAIResponse(aiPrompt);

    if (!aiResponse) {
      return res.status(400).json({ error: "AI response error" });
    }

    // 🔹 **Chat history update karo**
    chat.messages.push({ role: "user", content: prompt });
    chat.messages.push({ role: "bot", content: aiResponse });
    await chat.save();

    res.status(200).json({ response: aiResponse, history: chat.messages.slice(-5) });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


