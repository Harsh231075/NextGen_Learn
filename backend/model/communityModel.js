import mongoose from "mongoose";
const { Schema } = mongoose;

const community = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  coverImageUrl: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ],

  joinRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  tags: [String],
  resources: [
    {
      title: String,
      type: String, // e.g. "pdf", "link"
      fileUrl: String,
      uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  announcements: [
    {
      title: String,
      content: String,
      postedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  discussions: [
    {
      content: String,
      postedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      replies: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User"
          },
          reply: String,
          createdAt: {
            type: Date,
            default: Date.now
          }
        }
      ]
    }
  ]
}, { timestamps: true });

export default mongoose.model("Community ", community);
