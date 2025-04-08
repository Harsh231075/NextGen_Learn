import mongoose from 'mongoose';

const studyModelSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // Course/Study title
  studyContent: { type: mongoose.Schema.Types.Mixed, required: true },
  week: Number,
  test: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }  // Timestamp
});

const StudyModel = mongoose.model("StudyModel", studyModelSchema);
export default StudyModel;
