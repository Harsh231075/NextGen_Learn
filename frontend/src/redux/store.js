// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice'; // Aapki authSlice file
import dashboardReducer from './features/dashboardSlice';
import coursesSlice from './features/coursesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    courses: coursesSlice
  },
});