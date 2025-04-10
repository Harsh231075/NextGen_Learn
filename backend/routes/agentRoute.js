import express from "express";
import { generateCoursePath, generateFeedback, generateQuiz, generateStudyPlan } from "../controller/agentController.js";

const router = express.Router();

router.post('/quiz', generateQuiz);
router.post('/study-plan', generateStudyPlan);
router.post('/course-path', generateCoursePath);
router.post('/feedback', generateFeedback);

export default router;
