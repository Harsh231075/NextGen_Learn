import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, X, Upload, Heart } from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { likePostAsync, commentPostAsync } from '../../redux/features/postSlice';
import { jwtDecode } from 'jwt-decode';

function PostsTab({ posts }) {
  console.log(posts);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null
  });
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(null);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [currentLikes, setCurrentLikes] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.id || decoded._id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({
        ...formData,
        file: e.target.files[0]
      });
      setFileName(e.target.files[0].name);
    }
  };

  const openModal = () => {
    setShowModal(true);
    setFormData({ title: '', description: '', file: null });
    setFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('description', formData.description);
      if (formData.file) {
        postData.append('file', formData.file);
      }

      const token = localStorage.getItem('token');

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/community/create`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("saved post =>", response);

      setFormData({ title: '', description: '', file: null });
      setFileName('');
      setShowModal(false);

    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = (postId) => {
    dispatch(likePostAsync(postId));
  };

  const showLikeDetails = (likes) => {
    if (likes && likes.length > 0) {
      setCurrentLikes(likes);
      setShowLikesModal(true);
    }
  };

  const handleCommentInputChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = (postId) => {
    if (commentText.trim()) {
      console.log("comment data =>", commentText, postId);
      dispatch(commentPostAsync({ postId, text: commentText }));
      setCommentText('');
      setShowCommentInput(null);
    }
  };

  const toggleCommentInput = (postId) => {
    setShowCommentInput(showCommentInput === postId ? null : postId);
    setSelectedPostId(postId);
    setCommentText('');
  };

  const validateFileType = (file) => {
    if (!file) return true;
    return file.type.startsWith('image/');
  };

  const getFileTypeErrorMessage = () => {
    if (!formData.file) return null;
    if (!validateFileType(formData.file)) {
      return 'Only image files (PNG, JPG, etc.) are allowed for posts';
    }
    return null;
  };

  const fileTypeError = getFileTypeErrorMessage();

  const hasUserLiked = (likes) => {
    if (!currentUserId || !likes || !Array.isArray(likes)) return false;
    return likes.some(like => {
      if (typeof like === 'string') {
        return like === currentUserId;
      } else if (like._id) {
        return like._id === currentUserId;
      } else if (like.userId) {
        return like.userId === currentUserId;
      }
      return false;
    });
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Community Posts</h2>
        <div className="flex gap-3">
          <button
            onClick={openModal}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-5">
              <div className="flex items-center space-x-2 mb-3">
                {post.authorPhoto && (
                  <img
                    src={post.authorPhoto}
                    alt={post.author}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-800">{post.author}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-xl mb-2 text-gray-800">{post.title}</h3>
              <p className="text-gray-700 mb-4">{post.content}</p>

              {post.fileUrl && (
                <img
                  src={post.fileUrl}
                  alt={post.title}
                  className="w-full h-auto rounded-md mb-3"
                />
              )}

              <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-4 text-gray-500">
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 transition-colors duration-200 ${hasUserLiked(post.likes) ? 'text-red-600' : 'hover:text-red-600'
                        }`}
                    >
                      <Heart className={`h-4 w-4 ${hasUserLiked(post.likes) ? 'fill-current' : 'fill-none'
                        }`} />
                      <span>{post.likes?.length || 0}</span>
                    </button>

                    {post.likes && post.likes.length > 0 && (
                      <div
                        className="text-xs text-gray-500 cursor-pointer hover:underline mt-1"
                        onClick={() => showLikeDetails(post.likes)}
                      >
                        {post.likes.length === 1
                          ? `Liked by ${post.likes[0].name}`
                          : `Liked by ${post.likes[0].name} and ${post.likes.length - 1} others`
                        }
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleCommentInput(post.id)}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Read More
                </button>
              </div>

              {showCommentInput === post.id && (
                <div className="mt-4">
                  <textarea
                    value={commentText}
                    onChange={handleCommentInputChange}
                    placeholder="Write a comment..."
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition mt-2"
                  >
                    Post Comment
                  </button>
                </div>
              )}

              {post.comments && post.comments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-gray-700 font-semibold mb-2">Comments:</h4>
                  {post.comments.map(comment => (
                    <div key={comment._id} className="mb-2 p-2 bg-gray-100 rounded-md">
                      <div className="flex items-center gap-2">
                        {comment.photo && (
                          <img
                            src={comment.photo}
                            alt={comment.name}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        )}
                        <p className="font-semibold text-sm">{comment.name || "Anonymous"}</p>
                      </div>
                      <p className="text-sm mt-1">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Create New Post
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter post title"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter post description"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Image Upload (PNG, JPG only)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG only
                        </p>
                        {fileName && (
                          <p className="mt-2 text-sm text-indigo-600 font-medium">{fileName}</p>
                        )}
                        {fileTypeError && (
                          <p className="mt-2 text-sm text-red-600 font-medium">{fileTypeError}</p>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || fileTypeError}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-75"
                  >
                    {isSubmitting ? 'Posting...' : 'Create Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showLikesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-sm relative max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Likes</h3>
              <button
                onClick={() => setShowLikesModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              {currentLikes.map(like => (
                <div key={like._id} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-0">
                  {like.photo ? (
                    <img src={like.photo} alt={like.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {like.name ? like.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <p className="font-medium">{like.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostsTab;