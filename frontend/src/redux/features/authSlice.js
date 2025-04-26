// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  referralCode: '',
  isRegistered: false, // Added state to track registration success
};

// Async Thunk for Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async Thunk for Registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('photo', userData.photo);
      if (userData.referralCode) {
        formData.append('referralCode', userData.referralCode);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for FormData
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setReferral: (state, action) => {
      state.referralCode = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
      state.isRegistered = false; // Reset isRegistered when clearing errors
    },
  },
  extraReducers: (builder) => {
    // Login Cases
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.isRegistered = false; // Reset on pending
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.isRegistered = false; // Reset on success
      // Aap user details bhi yahaan set kar sakte hain agar API response mein ho
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isRegistered = false; // Reset on error
    });

    // Registration Cases
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.isRegistered = false; // Reset on pending
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isRegistered = true; // Set to true on successful registration
      // Registration successful, aap yahaan kuch state update kar sakte hain agar zaroorat ho
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isRegistered = false; // Reset on error
    });
  },
});

export const { setReferral, logout, clearError } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;