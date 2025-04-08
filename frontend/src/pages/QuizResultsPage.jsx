import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const parsedData = location.state;

  const handleBackToQuiz = () => {
    navigate('/dashboard');
  };

  // Calculate percentage score
  const scorePercentage = parsedData?.total_questions > 0
    ? Math.round((parsedData.correct_answers / parsedData.total_questions) * 100)
    : 0;

  // Determine color and message based on score
  const getScoreInfo = () => {
    if (scorePercentage >= 80) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-500',
        icon: '🏆',
        message: "Excellent work! You've demonstrated a strong understanding of the material.",
        subtitle: "Keep up the great work!"
      };
    }
    if (scorePercentage >= 60) {
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-500',
        icon: '🌟',
        message: "Good effort! You're on the right track.",
        subtitle: "Review the questions you missed to improve your understanding."
      };
    }
    return {
      color: 'text-red-600',
      bgColor: 'bg-red-500',
      icon: '📚',
      message: "Keep practicing! You'll improve with more study.",
      subtitle: "Focus on the areas where you struggled the most."
    };
  };

  const scoreInfo = getScoreInfo();

  if (!parsedData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="p-8 bg-white rounded-xl shadow-lg text-center max-w-md w-full mx-4 border border-indigo-100">
          <div className="w-20 h-20 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-6">We couldn't locate your quiz results. They may have expired or been removed.</p>
          <button
            onClick={handleBackToQuiz}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Results Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-indigo-100">
          {/* Header with confetti effect for high scores */}
          <div className={`relative px-6 py-10 text-center bg-gradient-to-r from-indigo-600 to-purple-600`}>
            <div className="absolute inset-0 overflow-hidden">
              {scorePercentage >= 80 && (
                <div className="confetti-container">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="confetti"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        backgroundColor: ['#FFD700', '#FF6B6B', '#4CAF50', '#64B5F6'][Math.floor(Math.random() * 4)]
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="relative z-10">
              <div className="inline-block text-4xl mb-2">{scoreInfo.icon}</div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Quiz Results</h1>
              <p className="text-indigo-200 max-w-md mx-auto">{scoreInfo.message}</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Score Summary */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
                <div className="relative w-40 h-40 md:w-48 md:h-48">
                  {/* SVG circle progress */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      className="text-gray-200"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="50"
                      cx="60"
                      cy="60"
                    />
                    <circle
                      className={scoreInfo.bgColor.replace('bg-', 'text-')}
                      strokeWidth="10"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="50"
                      cx="60"
                      cy="60"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - scorePercentage / 100)}`}
                    />
                  </svg>
                  {/* Percentage in center */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className={`text-4xl md:text-5xl font-bold ${scoreInfo.color}`}>
                      {scorePercentage}%
                    </div>
                    <div className="text-sm text-gray-500">Score</div>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {parsedData.correct_answers} out of {parsedData.total_questions} correct
                  </h2>
                  <p className="text-gray-600 mb-4">{scoreInfo.subtitle}</p>

                  <div className="inline-flex items-center px-4 py-2 rounded-full font-medium text-sm"
                    style={{
                      backgroundColor: scorePercentage >= 60 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: scorePercentage >= 60 ? '#059669' : '#DC2626'
                    }}>
                    <span className="mr-2">
                      {parsedData.result === 'Pass' ? '✓' : '✗'}
                    </span>
                    {parsedData.result}
                  </div>
                </div>
              </div>

              {/* Score Details Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center shadow-sm border border-green-200 transition-transform hover:transform hover:scale-105">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-200 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-green-700">{parsedData.correct_answers}</div>
                  <div className="text-sm font-medium text-green-800">Correct</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center shadow-sm border border-red-200 transition-transform hover:transform hover:scale-105">
                  <div className="w-12 h-12 mx-auto mb-3 bg-red-200 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-red-700">{parsedData.wrong_answers}</div>
                  <div className="text-sm font-medium text-red-800">Incorrect</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center shadow-sm border border-blue-200 transition-transform hover:transform hover:scale-105">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-200 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-blue-700">{parsedData.total_questions}</div>
                  <div className="text-sm font-medium text-blue-800">Total Questions</div>
                </div>
              </div>
            </div>

            {/* Wrong Questions Section */}
            {parsedData.feedback && parsedData.feedback.wrong_questions && parsedData.feedback.wrong_questions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Areas to Review
                </h2>

                <div className="space-y-6">
                  {parsedData.feedback.wrong_questions.map((question, index) => (
                    <div key={index} className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
                      <div className="flex items-start mb-4">
                        <div className="flex-shrink-0">
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full mr-3 text-sm font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                          {question.question}
                        </h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {question.user_answer && (
                          <div className="mb-3 md:mb-0">
                            <div className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Your Answer:
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 text-gray-700">
                              {question.user_answer}
                            </div>
                          </div>
                        )}

                        {question.correct_answer && (
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              Correct Answer:
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-400 text-gray-700">
                              {question.correct_answer}
                            </div>
                          </div>
                        )}
                      </div>

                      {question.explanation && (
                        <div className="mt-5 animate-fadeIn">
                          <div className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Explanation:
                          </div>
                          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border border-blue-200">
                            {question.explanation}
                          </div>
                        </div>
                      )}

                      {question.resources && question.resources.length > 0 && (
                        <div className="mt-5">
                          <div className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Additional Resources:
                          </div>
                          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                            <ul className="space-y-2">
                              {question.resources.map((resource, idx) => (
                                <li key={idx} className="flex items-center">
                                  <svg className="w-4 h-4 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                  </svg>
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:text-purple-800 hover:underline transition-colors"
                                  >
                                    {resource.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="text-center mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleBackToQuiz}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium"
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </div>
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium"
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
                  </svg>
                  Back to Dashboard
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center max-w-2xl mx-auto border border-indigo-100 transition-all hover:shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Learning Tip</h3>
          </div>
          <p className="text-gray-700">
            {scorePercentage >= 80
              ? "Fantastic performance! Consider challenging yourself with more advanced topics or helping others understand these concepts."
              : scorePercentage >= 60
                ? "Good progress! Try creating flashcards for the concepts you missed to reinforce your understanding."
                : "Study consistently in shorter sessions rather than cramming. Focus on understanding concepts rather than memorizing answers."}
          </p>
        </div>
      </div>

      {/* Add custom CSS for confetti animation */}
      <style jsx>{`
        .confetti-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          overflow: hidden;
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0.7;
          animation: fall 3s linear infinite;
        }
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(300px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>
    </div>
  );
};

export default QuizResultsPage;