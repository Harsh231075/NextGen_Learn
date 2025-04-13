import cloudinary from 'cloudinary';
const { v2 } = cloudinary;
import Post from '../model/PostModel.js'
import User from "../model/userModel.js";
import Resource from '../model/resourceModel.js'

export const createPost = async (req, res) => {
  try {
    const { title, description, role } = req.body;
    const userId = req.userId; // assuming JWT decoded user ID

    let fileUrl;
    if (req.files && req.files.file) {
      try {
        const file = req.files.file;
        const uploadResult = await v2.uploader.upload(file.tempFilePath, {
          folder: "community_post", // Changed folder name for clarity
        });
        fileUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Image Upload Error:", uploadError);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    let CraetedPost;
    let CraetedResource;
    console.log("data recive 1 =>", title, description)
    if (role === "Post") {
      console.log("data recive 2 =>", title, description)
      const post = await Post.create({
        title,
        description,
        fileUrl,
        author: userId
      });
      CraetedPost = await post.save();
      return res.status(201).json({
        message: " Post created succesfully",
        success: true,
        post: CraetedPost
      });

    } else {
      const NewResource = await Resource.create({
        title,
        description,
        fileUrl,
        author: userId
      })
      CraetedResource = await NewResource.save();
      return res.status(201).json({
        message: " Resource created succesfully",
        success: true,
        post: CraetedResource
      });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

export const getAllCommunityPosts = async (req, res) => {
  try {
    const getPhotoUrl = (photo) => {
      if (typeof photo === "string") return photo;
      if (photo?.secure_url) return photo.secure_url;
      if (photo?.url) return photo.url;
      return "";
    };

    const posts = await Post.find().sort({ createdAt: -1 });

    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const author = await User.findById(post.author).select("name photo");

        const likes = await Promise.all(
          post.likes.map(async (userId) => {
            const user = await User.findById(userId).select("name photo");
            return {
              _id: user._id,
              name: user.name,
              photo: getPhotoUrl(user.photo),
            };
          })
        );

        const comments = await Promise.all(
          post.comments.map(async (comment) => {
            const user = await User.findById(comment.user).select("name photo");
            return {
              _id: comment._id,
              text: comment.text,
              createdAt: comment.createdAt,
              user: {
                _id: user._id,
                name: user.name,
                photo: getPhotoUrl(user.photo),
              },
            };
          })
        );

        return {
          _id: post._id,
          title: post.title,
          description: post.description,
          fileUrl: post.fileUrl,
          createdAt: post.createdAt,
          author: {
            _id: author._id,
            name: author.name,
            photo: getPhotoUrl(author.photo),
          },
          likes,
          comments,
        };
      })
    );

    res.status(200).json({
      success: true,
      posts: formattedPosts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch community posts",
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId; // middleware se aa raha

    // 1. Post find karo
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // 2. Check karo user ne already like kiya hai ya nahi
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // 👎 Unlike: remove userId
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // 👍 Like: add userId
      post.likes.push(userId);
    }

    // 3. Save post
    await post.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Post unliked" : "Post liked",
      totalLikes: post.likes.length,
    });

  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while liking/unliking the post",
    });
  }
};

export const getAllResourcesSimplified = async (req, res) => {
  try {
    const resources = await Resource.find().populate('author', 'name photo');

    const allResourcesData = resources.map(resource => ({
      resourceId: resource._id, // Explicitly naming the resource ID
      title: resource.title,
      description: resource.description,
      file: resource.fileUrl,
      authorInfo: {
        authorId: resource.author._id, // Explicitly naming the author ID
        name: resource.author.name,
        photo: resource.author.photo || null,
      },
      totalDownloads: resource.downlaod.length, // Renamed for clarity
      // You can add other relevant resource details here if needed
    }));

    res.status(200).json({
      success: true,
      count: allResourcesData.length,
      resourcesData: allResourcesData, // Using a more descriptive key
      message: "Successfully retrieved individual resource details",
    });

  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve resources",
      error: error.message,
    });
  }
};


