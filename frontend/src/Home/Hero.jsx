// HeroSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, BookOpen, Users, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6"
            >
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">AI-Powered Learning Platform</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Learn Smarter, Not{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                Harder
              </span>
            </h1>

            <p className="mt-4 text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              Get personalized AI-powered courses, real-time assistance, and earn rewards while you learn. 
              Join thousands of learners building their future today!
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/sign-login"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-full text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transform hover:scale-105 transition-all duration-300 shadow-md">
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-6"
            >
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600 mt-1">Active Learners</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600 mt-1">Courses</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900">4.9★</div>
                <div className="text-sm text-gray-600 mt-1">Rating</div>
              </div>
            </motion.div>

          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-20 blur-2xl animate-pulse"></div>
              
              {/* Main Image */}
              <div className="relative rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
                <img
                  src="https://cms.techwish.com/wp-content/uploads/2025/01/Hero-Section-3.png"
                  alt="Learning Dashboard"
                  className="w-full h-auto"
                />
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Progress</div>
                    <div className="text-xs text-gray-600">85% Complete</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">AI Help</div>
                    <div className="text-xs text-gray-600">24/7 Available</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;