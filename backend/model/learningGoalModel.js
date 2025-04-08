import mongoose from 'mongoose';

const learningGoalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: String,
  deadline: Date,
  progress: Number, // 0 to 100
});

export default mongoose.model("LearningGoal", learningGoalSchema);

