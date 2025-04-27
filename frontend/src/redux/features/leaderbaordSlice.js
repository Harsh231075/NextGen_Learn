// src/redux/leaderboardSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Call ka thunk
export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/leaderbaord`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch leaderboard data');
    }
  }
);

// Slice
const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {}, // abhi koi direct reducers nahi, sirf async ka handle
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default leaderboardSlice.reducer;
