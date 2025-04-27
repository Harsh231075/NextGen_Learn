// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import dashboardReducer from './features/dashboardSlice';
import coursesSlice from './features/coursesSlice';
import communityReducer from './features/communitySlice'
import leaderboardReducer from './features/leaderbaordSlice';
// import postReducer from './features/postSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    courses: coursesSlice,
    community: communityReducer,
    leaderboard: leaderboardReducer,
    // posts: postReducer,
  },
});