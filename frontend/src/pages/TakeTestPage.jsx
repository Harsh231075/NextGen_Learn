import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  const { title, topics, courseId } = location.state || {};

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const dataToSend = {
          role: "quiz",
          promptType: "quiz",
          total_questions: "10",
          variables: {
            tilte: title,
            topic: topics
          }
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/ai/study`,
          dataToSend,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data && response.data.finalresponse) {
          const jsonString = response.data.finalresponse.replace(/```json\n|\n```/g, '');
          const parsedData = JSON.parse(jsonString);
          setQuizData(parsedData);
        } else {
          throw new Error('Invalid response format from server');
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch quiz questions');
        setLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [location.state?.title, location.state?.topics]);

  const handleAnswerChange = (questionIndex, selectedAnswer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: selectedAnswer,
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizData?.questions?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Prepare user answers in the required format
      const formattedUserAnswers = {};
      quizData?.questions?.forEach((question, index) => {
        formattedUserAnswers[index + 1] = userAnswers[index] || null; // Use index + 1 as question identifier
      });

      console.log("Course Id", courseId)

      const evaluationDataToSend = {
        role: "performance",
        courseId,
        promptType: "quiz_evaluation",
        total_questions: quizData?.questions?.length || 0,
        variables: {
          quiz: {
            quiz_topic: quizData?.quiz_topic || "",
            difficulty: quizData?.difficulty || "",
            questions: quizData?.questions?.map(q => ({
              question: q.question,
              correct_answer: q.correct_answer,
            })) || [],
          },
          user_answers: formattedUserAnswers,
        },
      };

      console.log("Data bheja ja raha hai:", evaluationDataToSend);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/study`, // Backend evaluation endpoint
        evaluationDataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log("Evaluation response:", response.data);
      setLoading(false);
      navigate('/quiz-results', { state: response.data.finalresponse }); // Navigate to results page with backend response
    } catch (err) {
      setError(err.message || 'Failed to submit quiz for evaluation');
      setLoading(false);
      console.error("Quiz submission error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Loading Quiz</h2>
        <p className="text-gray-600 text-center max-w-md">
          We're preparing your questions. This may take a moment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Something Went Wrong</h2>
          <p className="text-center text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-yellow-100 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-2">No Questions Available</h2>
          <p className="text-center text-gray-600 mb-6">We couldn't find any quiz questions for this topic.</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const questionsAnswered = Object.keys(userAnswers).length;
  const totalQuestions = quizData.questions.length;
  const progressPercentage = (questionsAnswered / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Quiz header */}
        <div className="bg-white rounded-t-2xl shadow-md px-6 py-5 mb-1">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{quizData.quiz_topic}</h1>
            <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {quizData.difficulty || "Standard"} Level
            </span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{questionsAnswered} of {totalQuestions} questions answered</span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-gray-500">Question {currentQuestionIndex + 1} of {quizData.questions.length}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${userAnswers[currentQuestionIndex] ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {userAnswers[currentQuestionIndex] ? 'Answered' : 'Not answered'}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${userAnswers[currentQuestionIndex] === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                    }`}
                  onClick={() => handleAnswerChange(currentQuestionIndex, option)}
                >
                  <label className="flex items-center cursor-pointer w-full">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${userAnswers[currentQuestionIndex] === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                      }`}>
                      {userAnswers[currentQuestionIndex] === option && (
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                      )}
                    </div>
                    <span className="text-gray-800">{option}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${currentQuestionIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50'
                  }`}
              >
                Previous
              </button>
              {currentQuestionIndex < quizData.questions.length - 1 ? (
                <button
                  onClick={goToNextQuestion}
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quizData.questions.length}
              </span>
            </div>
            <div className="flex gap-1">
              {quizData.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center transition-all duration-200 ${index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : userAnswers[index]
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;