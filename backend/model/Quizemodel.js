import mongoose from "mongoose";

const quizPerformanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Foreign key reference
  quizzesTaken: { type: Number, default: 0 }, // Total number of quizzes taken
  totalQuestions: { type: Number, default: 0 }, // Total attempted questions
  correctAnswers: { type: Number, default: 0 }, // Total correct answers
  wrongAnswers: { type: Number, default: 0 }, // Total wrong answers
  averageScore: { type: Number, default: 0 }, // Average score percentage
});

export default mongoose.model("QuizPerformance", quizPerformanceSchema);
