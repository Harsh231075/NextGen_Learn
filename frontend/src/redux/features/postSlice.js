// features/post/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Async thunk for liking a post
export const likePostAsync = createAsyncThunk(
  'posts/likePost',
  async (postId, { getState }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/community/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      // return { postId, likes: response.data.likesCount }; // Assuming the API returns the updated like count
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }
);

// Async thunk for commenting on a post
export const commentPostAsync = createAsyncThunk(
  'posts/commentPost',
  async ({ postId, text }, { getState }) => {
    console.log(postId, text);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/community/${postId}/comment`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { postId, comment: response.data }; // Assuming the API returns the new comment object
    } catch (error) {
      console.error('Error commenting on post:', error);
      throw error;
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [], // Assuming your component receives 'posts' as a prop, you might not manage the whole list here
    loading: false,
    error: null,
  },
  reducers: {
    // You might have other reducers here if you manage the list of posts in the store
  },
  extraReducers: (builder) => {
    builder
      .addCase(likePostAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likePostAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Update the like count for the specific post in your local 'posts' array
        if (state.posts) {
          state.posts = state.posts.map((post) =>
            post.id === action.payload.postId ? { ...post, likesCount: action.payload.likes } : post
          );
        }
      })
      .addCase(likePostAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(commentPostAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(commentPostAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Update the comments for the specific post in your local 'posts' array
        if (state.posts) {
          state.posts = state.posts.map((post) =>
            post.id === action.payload.postId
              ? { ...post, comments: [...(post.comments || []), action.payload.comment], commentsCount: (post.commentsCount || 0) + 1 }
              : post
          );
        }
      })
      .addCase(commentPostAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// ... other imports and code ...

// Export the async thunks
// export { likePostAsync, commentPostAsync };

// Export the reducer
export default postSlice.reducer;