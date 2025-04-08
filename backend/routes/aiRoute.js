import { aiRequest } from '../controller/aiController.js';
import authenticateUser from '../middleware/authMiddleware.js'
import { chatWithAI } from "../controller/chatbotcontroller.js";
import express from "express";

const router = express.Router();

router.post('/study', authenticateUser, aiRequest);

router.post("/chat", authenticateUser, chatWithAI);  // 🟢 AI Chatbot Route

export default router;