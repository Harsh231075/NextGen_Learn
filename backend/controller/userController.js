import User from '../model/userModel.js'; // Schema import karna
import cloudinary from 'cloudinary';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import StudyModel from '../model/studyModel.js';
const { v2 } = cloudinary;

export const registerUser = ('/register', async (req, res) => {
  try {
    const { name, email, password, referralCode } = req.body;
    console.log(name, email, password, referralCode)
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    let photoUrl = "empty";

    // Handle photo upload
    if (req.files && req.files.photo) {
      try {
        const file = req.files.photo;
        const uploadResult = await v2.uploader.upload(file.tempFilePath, {
          folder: "user_photos",
        });
        photoUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Image Upload Error:", uploadError);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    // Generate unique referral code for new user
    const generateReferralCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      photo: photoUrl,
      referralCode: generateReferralCode(),
      point: 0
    });

    // Handle referral if provided
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        // Add referral points to referrer
        referrer.point += 10;
        referrer.referralPoint += 10;
        // Increment referral count for referrer
        referrer.referral = (referrer.referral || 0) + 1;
        await referrer.save();

        // Link new user to referrer
        newUser.referredBy = referrer._id;
      }
    }

    await newUser.save();
    res.status(201).json({
      message: "Signup Successful",
      user: {
        name: newUser.name,
        email: newUser.email,
        photo: newUser.photo,
        referralCode: newUser.referralCode
      }
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export const login = ('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const isMatch = await bcrypt.compare(password, user.password); // ✅ Added `await`
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" }); // ✅ Fixed typo
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' }); // ✅ Fixed typo
    return res.json({ message: "Login successful", token });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getRegisteredCourses = async (req, res) => {
  const userId = req.userId;
  // console.log(userId);
  try {
    // Saare courses fetch kar raha hai jahan userId match karta ho
    const courses = await StudyModel.find({ userId });

    res.status(200).json({
      message: "Retrieved Successfully",
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params; // Get courseId from URL parameters (as used in frontend)

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const course = await StudyModel.findById(courseId); // Use findById for a single document

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "Retrieved Successfully",
      course,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ message: "Failed to retrieve course details" });
  }
};

export const updateDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const { section, data } = req.body;

    console.log("my-data", section, data);

    if (!section || !data) {
      return res.status(400).json({ message: "Section or data missing" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    switch (section) {
      case "profile":
        user.name = data.name ?? user.name;
        user.photo = data.photo ?? user.photo;
        user.bio = data.bio ?? user.bio;
        user.skills = data.skills ?? user.skills;
        break;

      case "education":
        user.education = data; // Direct assign
        break;

      case "certificates":
        user.certificates = data;
        break;

      case "projects":
        user.projects = data;
        break;

      default:
        return res.status(400).json({ message: "Invalid section" });
    }

    await user.save();

    return res.status(200).json({ message: `${section} updated successfully`, user });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// controllers/leaderboardController.js

// import User from '../models/User.js';

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({}, 'name photo point')
      .sort({ point: -1 }); // points ke hisaab se sort

    // Rank add karna
    const leaderboard = users.map((user, index) => ({
      _id: user._id,
      name: user.name,
      photo: user.photo,
      point: user.point,
      rank: index + 1, // index 0 se start hota hai, isliye +1
    }));

    res.status(200).json({
      success: true,
      message: 'Leaderboard fetched successfully',
      data: leaderboard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching leaderboard',
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // frontend se userId milegi

    const user = await User.findById(userId, 'name photo bio skills projects education');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching user profile',
    });
  }
};