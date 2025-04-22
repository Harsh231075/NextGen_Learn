// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home/Home";
import SignupLogin from "./pages/SignupLogin";
import CompletionScreen from './dashboard/AIGuidance/CompletionScreen'
import SelectedCourse from './dashboard/AIGuidance/SelectedCoure'
import LearnCourse from "./pages/LearnCourse";
import TakeTestPage from "./pages/TakeTestPage";
import QuizResultsPage from "./pages/QuizResultsPage";
import MentorChatUI from "./pages/MyMentors";
import CompeteCourse from "./pages/CompeteCourse";
import CommunityDashboard from "./community/Dashboard"
import MentorTest from "./pages/MentorTest";
import MentorResult from "./pages/MentorResult";
import Dashboard from "./dashboard/Dashboard"; // Keep the import
import VoiceInputOutput from "./pages/VoiceInputOutput";
import Chat from "./components/Chat";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

function App() {

  const token = localStorage.getItem("token");

  // Decode JWT to get current user info
  let currentUser = null;
  if (token) {
    try {
      currentUser = jwtDecode(token); // contains _id, name, etc.
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-login" element={<SignupLogin />} />
      <Route path="/learn/:courseId" element={<LearnCourse />} />
      <Route path="/test" element={<TakeTestPage />} />
      <Route path="/selected-course" element={<SelectedCourse />} />
      <Route path="/completion" element={<CompletionScreen />} />
      <Route path="/dashboard/*" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
      <Route path="/quiz-results" element={<QuizResultsPage />} />
      <Route path="/my-mentors" element={<MentorChatUI />} />
      <Route path="/certificate-download" element={<CompeteCourse />} />
      {/* <Route path="/community-dashboard" element={<CommunityDashboard />} /> */}
      <Route path="/mentor-test" element={<MentorTest />} />
      <Route path="/mentor-result" element={<MentorResult />} />
      <Route path="/voice" element={<VoiceInputOutput></VoiceInputOutput>} />
      <Route path="/chat" element={<Chat user={currentUser} />} />
    </Routes>
  );
}

export default App;