import { generateCourseOutlineAgent, generateQuizAgent, generateStudyPlanAgent, trackProgressAgent } from "../agents/agents.js"
import { formatJson } from "../utils/formatter.js";

export const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const result = await generateQuizAgent(topic, difficulty);
    const quizJson = formatJson(result.content);
    res.json({ quiz: quizJson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const generateStudyPlan = async (req, res) => {
  try {
    const { topic, duration, level } = req.body;
    const result = await generateStudyPlanAgent(topic, duration, level);
    const studyPlanJson = formatJson(result.content)
    res.json({ studyPlan: studyPlanJson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateCoursePath = async (req, res) => {
  try {
    const { topic, goal, level } = req.body;
    const result = await generateCourseOutlineAgent(topic, goal, level);
    res.json({ coursePath: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateFeedback = async (req, res) => {
  try {
    const { performanceData } = req.body;
    const result = await trackProgressAgent(performanceData);
    res.json({ feedback: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

