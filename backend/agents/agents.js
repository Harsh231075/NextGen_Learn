import { model } from "../config/langchainClient.js"
import { courseChain } from "./chains/courseChain.js";
import { feedbackChain } from "./chains/feedbackChain.js";
import { optimizerChain } from "./chains/optimizerChain.js";
import { quizChain } from "./chains/quizChain.js";
import { studyPlanChain } from "./chains/studyPlanChain.js";

export async function assistUserAgent(userMessage) {
  try {
    const prompt = `The user is stuck or confused. Provide a helpful, simple explanation or next step: "${userMessage}"`;
    const response = await model.invoke(prompt);
    return response;
  } catch (err) {
    // log(`ConfusedUserAgent Error: ${err.message}`, 'error');
    throw err;
  }
}


export async function generateCourseOutlineAgent(topic, goal, level) {
  try {
    const result = await courseChain.invoke({ topic, goal, level });
    return result;
  } catch (err) {
    // log(`CourseGeneratorAgent Error: ${err.message}`, 'error');
    throw err;
  }
}


export async function trackProgressAgent(performanceData) {
  try {
    const result = await feedbackChain.invoke({ performanceData });
    return result;
  } catch (err) {
    // log(`ProgressTrackerAgent Error: ${err.message}`, 'error');
    throw err;
  }
}


export async function optimizePromptAgent(originalPrompt) {
  try {
    const result = await optimizerChain.invoke({ originalPrompt });
    return result;
  } catch (err) {
    // log(`PromptOptimizerAgent Error: ${err.message}`, 'error');
    throw err;
  }
}


export async function generateQuizAgent(topic, difficulty) {
  try {
    const result = await quizChain.invoke({ topic, difficulty });
    return result;
  } catch (err) {
    // log(`QuizAgent Error: ${err.message}`, 'error');
    throw err;
  }
}


export async function generateStudyPlanAgent(topic, duration, level) {
  try {
    const result = await studyPlanChain.invoke({ topic, duration, level });
    return result;
  } catch (err) {
    // log(`StudyPlanAgent Error: ${err.message}`, 'error');
    throw err;
  }
}

