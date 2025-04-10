import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { RunnableSequence } from '@langchain/core/runnables';
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { getEnv } from '../utils/getEnv.js';


export const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash-001', // or 'gemini-1.0-pro', 'gemini-2.0' etc.
  apiKey: getEnv('GEMINI_API_KEY'),
  temperature: 0.7,
  maxOutputTokens: 2048,
});

/**
 * Create a LangChain runnable sequence from system and user prompts
 * @param {string} systemPrompt - Instruction for the AI's role
 * @param {string} humanPrompt - Actual user query/template
 * @returns {RunnableSequence}
 */
export const createPromptChain = (systemPrompt, humanPrompt) => {
  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt),
    HumanMessagePromptTemplate.fromTemplate(humanPrompt),
  ]);

  return RunnableSequence.from([
    prompt,
    model,
  ]);
};
