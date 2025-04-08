import express from "express";
import mongoose from 'mongoose';
import User from "../model/userModel.js";
import LearningProgress from "../model/learningModel.js";
import QuizPerformance from "../model/Quizemodel.js";
// import AIInsights from "../model/aiInsightsModel.js";
// import LearningGoal from "../model/learningGoalModel.js";
import authenticateUser from '../middleware/authMiddleware.js'
import StudyModel from "../model/studyModel.js";

const router = express.Router();


router.get("/dashboard", authenticateUser, async (req, res) => {
  try {
    const userIdString = req.userId;
    const userIdObject = new mongoose.Types.ObjectId(userIdString); // Convert string to ObjectId

    // console.log("User ID (String):", userIdString);
    // console.log("User ID (Object):", userIdObject);
    // console.log("Type of User ID (String):", typeof userIdString);
    // console.log("Type of User ID (Object):", typeof userIdObject);

    const [user, progress, quiz, study] = await Promise.all([
      User.findById({ _id: req.userId }),
      LearningProgress.findOne({ userId: userIdObject }),
      QuizPerformance.findOne({ userId: userIdObject }),
      StudyModel.findOne({ userId: userIdObject }),
    ]);

    const formattedResponse = {
      user: {
        name: user.name,
        photo: user.photo,
        referralNumber: user.referral,
        referral: user.referralCode,
        referralPoint: user.referralPoint,
        points: user.point,
        education: user.education,
        projects: user.projects,
        skills: user.skills,
        bio: user.bio,
      },
      learningProgress: progress
        ? {
          completedCourses: progress.completedCourses,
          ongoingTopics: progress.ongoingTopics,
          totalCoursesCount: progress.totalCourses ? progress.totalCourses.length : 0,
        }
        : null,
      quizPerformance: quiz
        ? {
          quizzesTaken: quiz.quizzesTaken,
          totalQuestions: quiz.totalQuestions,
          correctAnswers: quiz.correctAnswers,
          wrongAnswers: quiz.wrongAnswers,
          averageScore: quiz.averageScore,
        }
        : null,
    };

    res.json(formattedResponse);


  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;