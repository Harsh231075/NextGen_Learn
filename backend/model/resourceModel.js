import mongoose from "mongoose";

const Resource = new mongoose.Schema({
  title: String,
  description: String,
  fileUrl: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  downlaod: [
    {
      text: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Resource", Resource);
