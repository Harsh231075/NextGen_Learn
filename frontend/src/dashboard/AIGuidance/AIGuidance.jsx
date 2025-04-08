import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AIGuidanceHeader from "./AIGuidanceHeader";
import ProgressBar from "./ProgressBar";
import WelcomeScreen from "./WelcomeScreen";
import QuestionStep from "./QuestionStep";
import axios from "axios";

function AIGuidance() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const navigate = useNavigate();

  // Questions
  const questions = [
    { id: "my_choice", question: "What would you like to learn?", options: ["Programming", "Digital Marketing", "Data Science", "Design", "Business"] },
    { id: "learning_style", question: "How do you prefer to learn new things?", options: ["Visual Learning", "Reading & Writing", "Interactive Practice", "Audio & Discussion"] },
    { id: "time_commitment", question: "How much time can you dedicate daily to learning?", options: ["30 minutes", "1-2 hours", "2-4 hours", "4+ hours"] },
    { id: "challenge_level", question: "What level of challenge are you comfortable with?", options: ["Basic - Take it slow", "Moderate - Steady pace", "Advanced - Push my limits", "Expert - Deep dive"] },
    { id: "goal_timeframe", question: "When do you want to achieve your learning goal?", options: ["Within 1 month", "3-6 months", "6-12 months", "More than a year"] },
    { id: "motivation", question: "What drives you to learn this subject?", options: ["Career Growth", "Personal Interest", "Specific Project", "Academic Requirement"] },
    { id: "current_background", question: "What's your current background in this subject?", options: ["Complete Beginner", "Some Basic Knowledge", "Intermediate", "Advanced"] },
    { id: "preferred_resources", question: "What type of learning resources do you prefer?", options: ["Video Tutorials", "Interactive Courses", "Books & Articles", "Project-Based Learning"] }
  ];

  // Start AI Guidance
  const handleStart = () => {
    setStarted(true);
  };

  // Handle Answer Selection
  const handleAnswer = (answer) => {
    const currentQuestion = questions[step];
    setAnswers({ ...answers, [currentQuestion.id]: answer });

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  // Handle Back Button
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Submit User Answers to Backend
  const handleFinalSubmit = async () => {
    setSubmitted(true);
    setLoading(true);

    // Transform frontend answers to backend expected format
    const backendData = {
      role: "confuse_user",
      promptType: "confuse_user",
      variables: {}
    };

    questions.forEach(question => {
      backendData.variables[question.id] = {
        question: question.question,
        answer: answers[question.id]
      };
    });

    console.log("Sending data to backend:", backendData);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/study`,
        backendData, // Send the transformed data
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      console.log("AI Response Received:", response.data.finalresponse);
      setAiResponse(response.data.finalresponse);

      navigate("/completion", { state: { aiResponse: response.data.finalresponse } });

    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white ">
      <div>
        {started && <AIGuidanceHeader step={step} handleBack={handleBack} />}
        {started && !submitted && <ProgressBar step={step} totalSteps={questions.length} />}

        {!started ? (
          <WelcomeScreen handleStart={handleStart} />
        ) : submitted ? (
          loading ? (
            <div className="text-center py-3">
              <div className="flex justify-center mb-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">Creating your path...</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">AI is analyzing your preferences</p>
            </div>
          ) : (
            <div className="text-center py-3">
              <h3 className="text-base sm:text-lg font-semibold text-green-600">✨ Ready!</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Taking you to results...</p>
            </div>
          )
        ) : (
          <QuestionStep
            question={questions[step]}
            handleAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  );
}

export default AIGuidance;