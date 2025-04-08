import mongoose from 'mongoose';

const learningProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  completedCourses: { type: Number, default: 0 },
  ongoingTopics: { type: Number, default: 0 },
  totalCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudyModel" }], // Array to store multiple course IDs
});

export default mongoose.model("LearningProgress", learningProgressSchema);
