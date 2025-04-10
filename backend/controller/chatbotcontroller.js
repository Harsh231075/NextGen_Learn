import ChatHistory from "../model/ChatHistoryModel.js";
import User from "../model/userModel.js";
import { buildChatChain } from "../agents/chains/chatChain.js";

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

    if (!chat) {
      chat = new ChatHistory({ userId, messages: [] });
      await chat.save();
    }

    console.log("Previous Chats:\n", chat.messages.slice(-5));

    const chain = await buildChatChain(chat.messages.slice(-5)); // Limit to last 5 messages
    // Run chain with current user input
    const response = await chain.invoke({ input: prompt });

    if (!response.content) {
      return res.status(400).json({ error: "AI response error" });
    }

    // 🔹 **Chat history update karo**
    chat.messages.push({ role: "user", content: prompt });
    chat.messages.push({ role: "bot", content: response.content });
    await chat.save();

    res.status(200).json({ response: response.content, history: chat.messages.slice(-5) });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


