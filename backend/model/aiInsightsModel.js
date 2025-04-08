import mongoose from 'mongoose';

const aiInsightsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  strongAreas: [String],
  focusAreas: [String],
  learningStyle: String,
});

export default mongoose.model("AIInsights", aiInsightsSchema);

