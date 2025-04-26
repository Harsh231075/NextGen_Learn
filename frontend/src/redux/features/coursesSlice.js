// src/features/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for fetching dashboard data
export const fetchRegisteredCourses = createAsyncThunk(
  'courses/fetchRegisterdCourses',
  async (_, thunkAPI) => {
    try {
      console.log("call");
      const token = localStorage.getItem('token'); // Adjust as needed
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/registered-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response:", response.data);
      return response.data.courses; // Assuming your API response has a 'courses' array
    } catch (error) {
      console.error("Error fetching registered courses:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  courses: [], // Changed 'data' to 'courses' to match the selector name
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {}, // If you have synchronous actions, define them here
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisteredCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegisteredCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload; // Store the fetched courses directly in the 'courses' array
      })
      .addCase(fetchRegisteredCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const getRegisteredCourses = (state) => state.courses.courses; // Selector now directly accesses state.courses.courses
export const getCoursesLoading = (state) => state.courses.loading;
export const getCoursesError = (state) => state.courses.error;

export default coursesSlice.reducer;