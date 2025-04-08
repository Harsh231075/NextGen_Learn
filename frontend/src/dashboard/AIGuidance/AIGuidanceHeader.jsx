import React from "react";
import { Brain, ArrowLeft } from "lucide-react";

export default function AIGuidanceHeader({ step, handleBack }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">AI Learning Assistant</h2>
      </div>
      {step > 0 && (
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-sm sm:text-base text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          Back
        </button>
      )}
    </div>
  );
}
