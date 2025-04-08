import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, BrainCircuit, Plus, ArrowLeft, Pencil, Calendar, ArrowRight, Trophy } from 'lucide-react';
import AIGuidance from '../AIGuidance/AIGuidance';
import UserForm from '../AIGuidance/UserForm'
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegisteredCourses, getRegisteredCourses } from '../../redux/features/coursesSlice';
import { Link } from 'react-router-dom';

const LearningPath = () => {
  const [showAIGuidance, setShowAIGuidance] = useState(false);
  const [showOwnStudy, setShowOwnStudy] = useState(false);
  const dispatch = useDispatch();
  const courses = useSelector(getRegisteredCourses);
  console.log(courses);

  useEffect(() => {
    dispatch(fetchRegisteredCourses);
  }, [dispatch]);

  const handleBack = () => {
    setShowAIGuidance(false);
    setShowOwnStudy(false);
  };

  if (showAIGuidance || showOwnStudy) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Learning Path</span>
            </button>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              {showAIGuidance ? 'AI-Guided Learning' : 'Custom Study Plan'}
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {showAIGuidance ? <AIGuidance /> : <UserForm />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold">Learning Journey</h1>
              <p className="text-blue-100">Create and track your personalized learning path</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowAIGuidance(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium"
              >
                <BrainCircuit className="h-5 w-5" />
                AI-Guided Study
              </button>
              <button
                onClick={() => setShowOwnStudy(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-medium"
              >
                <Pencil className="h-5 w-5" />
                Custom Study
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 px-1">
            <BookOpen className="w-6 h-6 text-blue-500" />
            Your Learning Paths
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <div
                key={course._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                        {course.studyContent.study_topic}
                      </h3>
                      <p className="text-sm text-gray-500">{course.studyContent.difficulty}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.completed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                      }`}>
                      {course.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Week {course.week} of {course.studyContent.total_weeks}</span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(course.week / course.studyContent.total_weeks) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between items-center border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={`/learn/${course._id}`}
                      className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:gap-2 transition-all"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {courses.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-blue-100" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Your Journey!</h3>
              <p className="text-gray-500 mb-6">Choose AI-guided or custom study to begin learning</p>
              <button
                onClick={() => setShowAIGuidance(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <BrainCircuit className="w-5 h-5" />
                Get AI Recommendations
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;