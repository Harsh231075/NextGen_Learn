import React, { useState, useEffect, useCallback } from 'react';
import { Plus, MessageSquare, X, Upload, Heart } from 'lucide-react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { likePostAsync, commentPostAsync } from '../../redux/features/postSlice';
import { jwtDecode } from 'jwt-decode';

function PostsTab({ posts }) {
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
  const [expandedPosts, setExpandedPosts] = useState({});
  const [localPosts, setLocalPosts] = useState([...posts]); // State for local post updates
  const descriptionMaxLength = 100;

  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);


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

  const updateLocalPost = useCallback((postId, updates) => {
    setLocalPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId ? { ...p, ...updates } : p
      )
    );
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
      postData.append('role', 'Post')
      if (formData.file) {
        postData.append('file', formData.file);
      }

      const token = localStorage.getItem('token');

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/community/create`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      setFormData({ title: '', description: '', file: null });
      setFileName('');
      setShowModal(false);
      // Refresh posts after successful creation.  Ideally, the new post
      // would be added to the list, but a full refresh is simpler for this example.
      // You'd likely fetch posts again, or add the new post to the local state.
      window.location.reload();

    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = useCallback(async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Token is missing");
      return; // Or redirect to login
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;

      // Optimistically update the UI
      const post = localPosts.find(p => p.id === postId);
      const alreadyLiked = post.likes?.some(like => like._id === userId);

      if (alreadyLiked) {
        // Unlike: Remove the user's like
        updateLocalPost(postId, {
          likes: post.likes.filter(like => like._id !== userId)
        });
      } else {
        // Like: Add the user's like (simplified)
        updateLocalPost(postId, {
          likes: [...(post.likes || []), { _id: userId, name: 'You' }]
        });
      }

      // Dispatch the async action to update the server
      await dispatch(likePostAsync(postId));

    } catch (error) {
      console.error("Error liking/unliking post:", error);
      // Handle error (e.g., show a message to the user)
      //  If the server update fails, you might want to revert the local update
      //  but for this example, we'll keep the UI optimistic.
    }
  }, [dispatch, localPosts, updateLocalPost]);



  const showLikeDetails = (likes) => {
    if (likes && likes.length > 0) {
      setCurrentLikes(likes);
      setShowLikesModal(true);
    }
  };

  const handleCommentInputChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = useCallback(async (postId) => {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Token is missing");
        return;
      }
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;
      const userName = "You"; //  Get the user's name

      // Optimistically update the comment count
      const post = localPosts.find(p => p.id === postId);
      const newComment = {
        _id: `local-${Date.now()}`, //  Unique local ID
        text: commentText,
        name: userName,
        userId: userId,
      };

      updateLocalPost(postId, {
        comments: [...(post.comments || []), newComment]
      });
      setCommentText('');
      setShowCommentInput(null);


      // Dispatch the comment to the server
      await dispatch(commentPostAsync({ postId, text: commentText }));


    } catch (error) {
      console.error("Error submitting comment:", error);
      //  Handle error (e.g., revert local update on failure)
    }
  }, [commentText, dispatch, localPosts, updateLocalPost]);

  const toggleCommentInput = (postId) => {
    setShowCommentInput(showCommentInput === postId ? null : postId);
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

  const toggleReadMore = (postId) => {
    setExpandedPosts(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
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
        {localPosts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
            <div className="p-5 flex flex-col h-full">
              {/* User info with photo */}
              <div className="flex items-center space-x-2 mb-2">
                {post.authorPhoto && (
                  <img
                    src={post.authorPhoto}
                    alt={post.author}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-800 text-sm">{post.author}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-2 text-gray-800">{post.title}</h3>

              {/* Post image */}
              {post.fileUrl && (
                <div className="mb-3 overflow-hidden rounded-md">
                  <img
                    src={post.fileUrl}
                    alt={post.title}
                    className="w-full h-24 object-fill aspect-square"
                  />
                </div>
              )}

              {/* Post description with ReadMore integrated */}
              {post.content && (
                <div className="mb-3 text-gray-700 text-sm flex-grow">
                  {post.content.length > descriptionMaxLength ? (
                    <>
                      {expandedPosts[post.id] ? (
                        <p>{post.content} <button onClick={() => toggleReadMore(post.id)} className="text-indigo-600 text-xs">[Read Less]</button></p>
                      ) : (
                        <p>{post.content.substring(0, descriptionMaxLength)}... <button onClick={() => toggleReadMore(post.id)} className="text-indigo-600 text-xs">[Read More]</button></p>
                      )}
                    </>
                  ) : (
                    <p>{post.content}</p>
                  )}
                </div>
              )}

              {/* Like and comment section */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex space-x-4 text-gray-500">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 transition-colors duration-200 ${hasUserLiked(post.likes) ? 'text-red-600' : 'hover:text-red-600'
                        }`}
                    >
                      <Heart className={`h-4 w-4 ${hasUserLiked(post.likes) ? 'fill-current' : 'fill-none'
                        }`} />
                      <span className="text-xs">{post.likes?.length || 0}</span>
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
                    <span className="text-xs">{post.comments?.length || 0}</span>
                  </button>
                </div>
              </div>

              {/* Comment input */}
              {showCommentInput === post.id && (
                <div className="mt-2">
                  <textarea
                    value={commentText}
                    onChange={handleCommentInputChange}
                    placeholder="Write a comment..."
                    className="w-full p-2 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="bg-blue-600 text-white py-1 px-3 rounded-md text-xs font-medium hover:bg-blue-700 transition mt-1"
                  >
                    Post
                  </button>
                </div>
              )}

              {/* Comments section */}
              {post.comments && post.comments.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-gray-700 font-semibold text-sm mb-1">Comments:</h4>
                  {post.comments.map(comment => (
                    <div key={comment._id} className="mb-1 p-2 bg-gray-100 rounded-md">
                      <div className="flex items-center gap-2">
                        {comment.photo && (
                          <img
                            src={comment.photo}
                            alt={comment.name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                        )}
                        <p className="font-semibold text-xs">{comment.name || "Anonymous"}</p>
                      </div>
                      <p className="text-xs mt-1">{comment.text}</p>
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
                <div className="mb-3">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter post title"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter post description"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Image Upload (PNG, JPG only)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-3 pb-4">
                        <Upload className="w-6 h-6 mb-2 text-gray-400" />
                        <p className="mb-1 text-xs text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xxs text-gray-500">
                          PNG, JPG only
                        </p>
                        {fileName && (
                          <p className="mt-1 text-xs text-indigo-600 font-medium">{fileName}</p>
                        )}
                        {fileTypeError && (
                          <p className="mt-1 text-xs text-red-600 font-medium">{fileTypeError}</p>
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

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3 py-2 text-gray-700 bg-gray-200 rounded-md text-sm hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || fileTypeError}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition disabled:opacity-75"
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
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              {currentLikes.map(like => (
                <div key={like._id} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-0">
                  {like.photo ? (
                    <img src={like.photo} alt={like.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-semibold">
                      {like.name ? like.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <p className="font-medium text-sm">{like.name}</p>
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

