// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home/Home";
import SignupLogin from "./pages/SignupLogin";
import CompletionScreen from './dashboard/AIGuidance/CompletionScreen';
import SelectedCourse from './dashboard/AIGuidance/SelectedCoure';
import LearnCourse from "./pages/LearnCourse";
import TakeTestPage from "./pages/TakeTestPage";
import QuizResultsPage from "./pages/QuizResultsPage";
import MentorChatUI from "./pages/MyMentors";
import CompeteCourse from "./pages/CompeteCourse";
import MentorTest from "./pages/MentorTest";
import MentorResult from "./pages/MentorResult";
import Dashboard from "./dashboard/Dashboard";
import VoiceInputOutput from "./pages/VoiceInputOutput";
import Chat from "./components/Chat";
import Protfolio from './pages/Portfolio'
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  const token = localStorage.getItem("token");

  let currentUser = null;
  if (token) {
    try {
      currentUser = jwtDecode(token); // decode user details from token
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/sign-login" element={<SignupLogin />} />

      {/* Protected Routes */}
      <Route path="/learn/:courseId" element={<ProtectedRoute><LearnCourse /></ProtectedRoute>} />
      <Route path="/test" element={<ProtectedRoute><TakeTestPage /></ProtectedRoute>} />
      <Route path="/selected-course" element={<ProtectedRoute><SelectedCourse /></ProtectedRoute>} />
      <Route path="/completion" element={<ProtectedRoute><CompletionScreen /></ProtectedRoute>} />
      <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/quiz-results" element={<ProtectedRoute><QuizResultsPage /></ProtectedRoute>} />
      <Route path="/my-mentors" element={<ProtectedRoute><MentorChatUI /></ProtectedRoute>} />
      <Route path="/certificate-download" element={<ProtectedRoute><CompeteCourse /></ProtectedRoute>} />
      <Route path="/mentor-test" element={<ProtectedRoute><MentorTest /></ProtectedRoute>} />
      <Route path="/mentor-result" element={<ProtectedRoute><MentorResult /></ProtectedRoute>} />
      <Route path="/voice" element={<ProtectedRoute><VoiceInputOutput /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat user={currentUser} /></ProtectedRoute>} />
      <Route path='/protfolio/:userId' element={<ProtectedRoute><Protfolio/></ProtectedRoute>}/>
    </Routes>
  );
}

export default App;
