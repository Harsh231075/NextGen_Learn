import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from '@langchain/core/runnables';
import { model } from "../../config/langchainClient.js";

export const buildChatChain = (chatHistory) => {
  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are a helpful AI mentor. Answer the user clearly and provide structured guidance when needed."
    ),
    ...chatHistory.map((msg) =>
      msg.role === "user"
        ? HumanMessagePromptTemplate.fromTemplate(msg.content)
        : SystemMessagePromptTemplate.fromTemplate(msg.content)
    ),
    HumanMessagePromptTemplate.fromTemplate("{{input}}") // Escaped for LangChain templating
  ]);

  return RunnableSequence.from([prompt, model]);
};
