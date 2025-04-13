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

// ✅ Thunk function: fetch all resources
export const fetchCommunityResources = createAsyncThunk(
  "community/fetchResources",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // Adjust as needed
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/community/get-resource`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }); // API endpoint yeh hoga
      console.log(res.data);
      return res.data.resourcesData; // Assuming your backend returns resources in res.data.data array
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const communitySlice = createSlice({
  name: "community",
  initialState: {
    posts: [],
    resources: [], // New state for resources
    loading: false,
    error: null,
  },
  reducers: {
    // extra reducers ke alawa agar koi filter/sort feature chahiye to bana sakte ho
  },
  extraReducers: (builder) => {
    builder
      // Handling fetchCommunityPosts lifecycle
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
      })
      // Handling fetchCommunityResources lifecycle
      .addCase(fetchCommunityResources.pending, (state) => {
        state.loading = true; // You might want a separate loading state for resources
        state.error = null;
      })
      .addCase(fetchCommunityResources.fulfilled, (state, action) => {
        state.loading = false; // You might want a separate loading state for resources
        state.resources = action.payload;
      })
      .addCase(fetchCommunityResources.rejected, (state, action) => {
        state.loading = false; // You might want a separate loading state for resources
        state.error = action.payload || "Failed to fetch resources";
      });
  },
});

export default communitySlice.reducer;