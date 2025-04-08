import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle, ChevronRight, ChevronLeft, Briefcase,
  ThumbsUp, Target, BookOpen, ArrowLeft, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CompletionScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const aiResponse = location.state?.aiResponse || null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPath, setSelectedPath] = useState(null);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);


  // Parse AI Response
  useEffect(() => {
    if (!aiResponse) {
      setLoading(false);
      return;
    }

    try {
      const cleanedText = aiResponse.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(cleanedText);

      if (parsedData.recommended_paths && parsedData.recommended_paths.length > 0) {
        setPaths(parsedData.recommended_paths);
      } else {
        console.error("Invalid AI response structure");
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
    } finally {
      setLoading(false);
    }
  }, [aiResponse]);


  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl"
        >
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-purple-900 mt-4 text-lg font-medium">
            Analyzing your responses...
          </p>
          <p className="text-purple-600/80 mt-2">Creating your personalized career path</p>
        </motion.div>
      </div>
    );
  }

  // Error UI
  if (!paths.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl max-w-md w-full"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h3>
          <p className="text-gray-600 mb-6">We couldn't find any career paths. Let's try again!</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-all duration-300 inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Start Over
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentPath = paths[currentIndex];

  const handleNext = () => {
    if (currentIndex < paths.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSelect = () => {
    setSelectedPath(currentPath.title);
  };

  const handleConfirm = () => {
    navigate("/selected-course", {
      state: { selectedPath },
    });
  };

  const handleBackToChoices = () => {
    setSelectedPath(null);
  };

  // Selected Path UI
  if (selectedPath) {
    const selectedPathData = paths.find((path) => path.title === selectedPath);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8"
        >
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="text-center space-y-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Great Choice!</h2>
                <p className="text-lg text-gray-600">
                  You selected:{" "}
                  <span className="font-semibold text-purple-600">{selectedPath}</span>
                </p>
                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Career Overview</h3>
                    <p className="text-gray-700 text-sm sm:text-base">{selectedPathData?.summary}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Why This Path Suits You</h3>
                    <p className="text-gray-700 text-sm sm:text-base">{selectedPathData?.why_suitable}</p>
                  </div>
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={handleBackToChoices}
                      className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base flex items-center gap-2"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      Back
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm sm:text-base flex items-center gap-2"
                    >
                      Confirm
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main Career Paths UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
      >

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Target className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-medium text-purple-900">Your Goal: {aiResponse.user_goal}</h2>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
                Explore Your Career Path
              </h1>
              <p className="mt-2 text-gray-600 text-center text-sm sm:text-base">
                We've curated the best career paths based on your learning preferences.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="space-y-5 sm:space-y-6">
                <div className="bg-purple-50 rounded-lg p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold text-purple-900">{currentPath.title}</h2>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base">{currentPath.summary}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-purple-900">Why This Could Be Perfect for You</h3>
                  </div>
                  <p className="text-gray-600">
                    {currentPath.why_suitable}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mt-6">
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <button
                    onClick={handleSelect}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span>Choose This Path</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentIndex === paths.length - 1}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </motion.div>
    </div>
  );
}