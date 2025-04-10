import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Thunk function: fetch all community posts
export const fetchCommunityPosts = createAsyncThunk(
  "community/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // Adjust as needed
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/community/get-posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }); // API endpoint yeh ho sakta h
      console.log(res.data);
      return res.data.posts; // formatted data array
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



const communitySlice = createSlice({
  name: "community",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
    // extra reducers ke alawa agar koi filter/sort feature chahiye to bana sakte ho
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchCommunityPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
      });
  },
});

export default communitySlice.reducer;
