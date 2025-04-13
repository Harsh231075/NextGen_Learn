import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      text: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  reports: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Post", PostSchema);
