import { createPromptChain } from "../../config/langchainClient.js";

const systemPrompt = `
You are an intelligent quiz generator AI. Based on the given topic and difficulty, generate a JSON quiz.

⚠️ Your response must be strictly JSON formatted and nothing else. Do not add any explanations, headers, or markdown formatting.

Expected output structure:
{{
  "quiz_topic": "<Topic Name>",
  "difficulty": "<Beginner|Intermediate|Advanced>",
  "questions": [
    {{
      "question": "<Question Text>",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": "<Correct Answer>",
      "explanation": "<Short explanation for the correct answer>"
    }}
  ]
}}
`;


const humanPrompt = `Generate a quiz on "{topic}" for "{difficulty}" level. Return ONLY JSON.`;

export const quizChain = createPromptChain(systemPrompt, humanPrompt);
