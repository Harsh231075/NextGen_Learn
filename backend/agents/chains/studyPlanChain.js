import { createPromptChain } from "../../config/langchainClient.js";

// SYSTEM PROMPT - sets behavior for the AI agent
const systemPrompt = `
You are a strategic AI mentor that creates personalized study plans for students based on their goals and time constraints.
Ensure the plan is well-paced, modular, and easily trackable.
Always respond strictly in valid JSON format. Do not include any explanations or extra text.
`;

// HUMAN PROMPT - filled dynamically when called
const humanPrompt = `
I want to learn {topic} for {duration} weeks. My level is {level}.
Generate a detailed weekly study plan.
The output must be strictly in this JSON format:

{{
  "study_topic": "{topic}",
  "difficulty": "{level}",
  "total_weeks": {duration},
  "weekly_plan": [
    {{
      "week": <Week Number>,
      "title": "<Title of the Week>",
      "topics": ["Topic 1", "Topic 2", "..."],
      "resources": [
        {{ "name": "<Resource Name>", "url": "https://example.com" }}
      ],
      "project": "<Mini project or assignment for the week>",
      "notes": {{
        "Topic 1": "<Detailed explanation, examples, and use-cases>",
        "Topic 2": "<Insights, key points, and applications>"
      }}
    }}
  ]
}}
`;

export const studyPlanChain = createPromptChain(systemPrompt, humanPrompt);
