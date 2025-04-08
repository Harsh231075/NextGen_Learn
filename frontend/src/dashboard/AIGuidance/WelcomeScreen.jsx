"use client";
import React from "react";
import { Sparkles, BookOpen, Brain, Target, Star } from "lucide-react";

export default function WelcomeScreen({ handleStart }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 md:p-6 bg-gradient-to-br from-blue-900 via-black to-purple-900">
      {/* Icon */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
        <Brain className="h-6 w-6 md:h-7 md:w-7 text-white animate-pulse" />
      </div>

      {/* Content */}
      <div className="text-center space-y-3">
        <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          AI-Powered Learning Journey
        </h1>
        <p className="text-sm md:text-base text-white/80 max-w-md">
          Embark on a revolutionary learning experience powered by advanced AI.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <div className="p-2 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
            </div>
            <span className="text-sm md:text-base text-white/90">
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={handleStart}
        className="mt-2 px-6 py-2.5 text-sm md:text-base font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
      >
        <span className="flex items-center gap-2">
          Begin Journey
          <Sparkles className="w-4 h-4 animate-pulse" />
        </span>
      </button>
    </div>
  );
}

const features = [
  { icon: Brain, text: "AI Learning" },
  { icon: Target, text: "Custom Goals" },
  { icon: BookOpen, text: "Interactive" },
  { icon: Star, text: "Track Progress" }
];