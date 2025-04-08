import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: String,
  referral: { type: Number, default: 0 },
  referralPoint: { type: Number, default: 0 },
  point: { type: Number, default: 0 },
  createdCommunities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
  referralCode: {
    type: String,
    unique: true
  },
  referral: { type: Number, default: 0 },
  skills: {
    type: [String], // 👈 yeh important hai
    default: [],    // optional, agar koi skill nahi ho initially
  },
  bio: { type: String, },
  projects: [
    {
      id: Number,
      title: String,
      description: String,
      link: String,
    },
  ],
  education: [
    {
      id: Number,
      degree: String,
      institute: String,
      year: String,
    },
  ],
});

export default mongoose.model('User', userSchema);
