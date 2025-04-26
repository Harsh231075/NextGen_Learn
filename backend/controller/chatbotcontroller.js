import ChatHistory from "../model/ChatHistoryModel.js";
import User from "../model/userModel.js";

import generateAIResponse from "../ai/chatService.js"

export const chatWithAI = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt } = req.body;

    if (!userId || !prompt) {
      return res.status(400).json({ error: "User ID and prompt are required" });
    }

    // 🔹 User check
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔹 Chat history fetch
    let chat = await ChatHistory.findOne({ userId });

    if (!chat) {
      chat = new ChatHistory({ userId, messages: [] });
      await chat.save();
    }

    // 🔹 Last 10 messages lo
    const lastMessages = chat.messages.slice(-10);

    // 🔹 Current prompt bhi add karo
    const conversation = [
      ...lastMessages,
      { role: "user", content: prompt }
    ];

    // console.log("Conversation going to AI:\n", conversation);

    // 🔹 AI se response lao (ab pura conversation jayega)
    const response = await generateAIResponse(conversation);

    if (!response) {
      return res.status(400).json({ error: "AI response error" });
    }

    // 🔹 Chat history update
    chat.messages.push({ role: "user", content: prompt });
    chat.messages.push({ role: "bot", content: response });
    await chat.save();

    res.status(200).json({ response, history: chat.messages.slice(-10) });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
