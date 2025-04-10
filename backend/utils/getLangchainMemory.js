import { BufferMemory } from "langchain/memory";

export const getLangChainMemory = (userId) => {
  return new BufferMemory({
    memoryKey: 'chat_history',
    inputKey: 'input',
    returnMessages: true,
    chatHistory: [], // you can use Redis or Mongo
  });
};
