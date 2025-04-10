import { createPromptChain } from "../../config/langchainClient.js";

const systemPrompt = `
You are a prompt optimization AI. Your goal is to enhance user queries to be more effective, specific, and precise
for use with AI tools like LLMs.
`;

const humanPrompt = `{input}`; // e.g., "Optimize: How do I study effectively?"

export const optimizerChain = createPromptChain(systemPrompt, humanPrompt);
