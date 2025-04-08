import React, { useState } from "react";
import { Send, PenTool, ArrowLeft } from "lucide-react";

export default function QuestionStep({ question, handleAnswer }) {
  const [customAnswer, setCustomAnswer] = useState("");
  const [isTypingMode, setIsTypingMode] = useState(false);

  const handleCustomSubmit = () => {
    if (customAnswer.trim()) {
      handleAnswer(customAnswer);
      setCustomAnswer("");
      setIsTypingMode(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6">
      <div className="bg-white rounded-lg sm:rounded-2xl shadow p-4 sm:p-6">
        {/* Question Header */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
            {question.question}
          </h3>
        </div>

        {isTypingMode ? (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={customAnswer}
                onChange={(e) => setCustomAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full min-h-[120px] sm:min-h-[160px] p-3 sm:p-4 text-sm sm:text-base rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all resize-none"
              />
              <div className="absolute bottom-2 right-3 text-gray-400 text-xs">
                {customAnswer.length} characters
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={() => setIsTypingMode(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleCustomSubmit}
                disabled={!customAnswer.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-2">
              {question.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-3 sm:p-4 text-sm sm:text-base rounded-lg border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsTypingMode(true)}
              className="w-full mt-2 p-3 rounded-lg border border-blue-100 text-blue-600 text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <PenTool className="w-4 h-4" />
              Write custom answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}