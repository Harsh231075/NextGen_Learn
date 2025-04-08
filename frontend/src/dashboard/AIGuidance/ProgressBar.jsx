import React from "react";

export default function ProgressBar({ step, totalSteps }) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-purple-600 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
