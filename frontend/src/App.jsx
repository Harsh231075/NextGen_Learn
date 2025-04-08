import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Dashboard from "./dashboard/Dashboard";
import SignupLogin from "./pages/SignupLogin";
import CompletionScreen from './dashboard/AIGuidance/CompletionScreen'
import SelectedCourse from './dashboard/AIGuidance/SelectedCoure'
import LearnCourse from "./pages/LearnCourse";
import TakeTestPage from "./pages/TakeTestPage";
import QuizResultsPage from "./pages/QuizResultsPage";
import MentorChatUI from "./pages/MyMentors";
import CompeteCourse from "./pages/CompeteCourse";
function App() {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-login" element={<SignupLogin />} />
      <Route path="/learn/:courseId" element={<LearnCourse />} />
      <Route path="/test" element={<TakeTestPage />} />
      <Route path="/selected-course" element={<SelectedCourse />} />
      <Route path="/completion" element={<CompletionScreen />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quiz-results" element={<QuizResultsPage />} />
      <Route path="/my-mentors" element={<MentorChatUI />} />
      <Route path="/certificate-download" element={<CompeteCourse />} />
    </Routes>

  );
}

export default App;
