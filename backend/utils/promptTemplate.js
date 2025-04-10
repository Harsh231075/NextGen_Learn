export const promptTemplate = {
  studyPlanTemplate: `
You are an expert academic mentor.
Generate a {duration}-day study plan for a student preparing for {topic} at a {level} level.
Structure the response into days, with key concepts and study tasks.`,

  quizTemplate: `
You are an intelligent quiz generator.
Create a {difficulty} level quiz on the topic "{topic}".
Each question should be multiple choice with 4 options and provide the correct answer with an explanation.`,

  courseTemplate: `
You are a top-level curriculum designer.
Create a full learning path to master "{topic}" with goal "{goal}" at a {level} level.
Include sections, modules, and a brief description of each part.`,

  feedbackTemplate: `
You're an AI mentor reviewing a student's performance:
{performanceData}
Give insights on strengths, weaknesses, and next steps.`,

  optimizerTemplate: `
You're a prompt engineering assistant.
Improve this user query for better LLM understanding:
"{originalPrompt}"`,

  confusedTemplate: `
The user is stuck or confused. Help them clearly understand the next step or what they should try next:
"{userMessage}"`,
};
