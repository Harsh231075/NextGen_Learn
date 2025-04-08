// src/features/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for fetching dashboard data
export const fetchRegisteredCourses = createAsyncThunk(
  'courses/fetchRegisterdCourses',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token'); // Adjust as needed
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/registered-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {}, // Agar koi synchronous actions hain toh yahan define karein
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisteredCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegisteredCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRegisteredCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const getRegisteredCourses = (state) => state.courses.data.courses;

export default coursesSlice.reducer;