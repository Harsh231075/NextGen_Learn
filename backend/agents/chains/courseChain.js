import { createPromptChain } from "../../config/langchainClient.js";

const systemPrompt = `
You are a world-class AI learning expert. Your job is to generate structured, detailed, and well-paced course plans
for students based on their goals. Include topic breakdowns, difficulty progression, and ideal resources.
`;

const humanPrompt = `{input}`; // e.g., "Create a beginner-friendly Python course"

export const courseChain = createPromptChain(systemPrompt, humanPrompt);

