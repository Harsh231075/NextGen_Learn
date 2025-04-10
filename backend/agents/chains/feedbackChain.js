import { createPromptChain } from "../../config/langchainClient.js";

const systemPrompt = `
You are an AI performance coach. Based on user quiz results or topic understanding, generate detailed feedback.
Highlight mistakes, improvement tips, and confidence levels.
`;

const humanPrompt = `{input}`; // e.g., "Feedback for student who failed 4/10 questions in Physics"

export const feedbackChain = createPromptChain(systemPrompt, humanPrompt);

