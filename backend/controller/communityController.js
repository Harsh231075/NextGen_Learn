import cloudinary from 'cloudinary';
const { v2 } = cloudinary;
import User from "../model/userModel.js";
import Community from '../model/communityModel.js'; // Corrected import path

export const createCommunityController = async (req, res) => {
  try {
    const { name, description, tags } = req.body;
    console.log(name, description, tags);
    const parsedTags = JSON.parse(tags || '[]');
    const userId = req.userId; // Assuming you're using auth middleware

    let photoUrl;
    if (req.files && req.files.coverImage) {
      try {
        const file = req.files.coverImage;
        const uploadResult = await v2.uploader.upload(file.tempFilePath, {
          folder: "community_covers", // Changed folder name for clarity
        });
        photoUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Image Upload Error:", uploadError);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    // Create new community document using the correct Community model
    const newCommunity = new Community({
      name,
      description,
      coverImageUrl: photoUrl,
      tags: parsedTags,
      members: [userId],
      createdBy: userId,
    });

    const savedCommunity = await newCommunity.save();

    // Add this community ID to the user's createdCommunities array
    await User.findByIdAndUpdate(userId, {
      $push: { createdCommunities: savedCommunity._id }
    });

    res.status(201).json({
      message: 'Community created successfully',
      community: savedCommunity
    });

  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ message: 'Failed to create community', error: error.message });
  }
};