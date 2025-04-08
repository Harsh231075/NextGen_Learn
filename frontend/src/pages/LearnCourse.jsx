import React, { useState, useEffect } from 'react';
import {
  ChevronDown, ChevronUp, BookOpen, GraduationCap, Code, ExternalLink, CheckCircle,
  Clock, Target, ChevronRight, Award, ArrowRight

} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
const LearnCourse = () => {
  const [courseData, setCourseData] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [currentUserWeek, setCurrentUserWeek] = useState(1);
  const [completedTopics, setCompletedTopics] = useState({});
  const { courseId } = useParams();
  const navigate = useNavigate();
  const apiUrl = `${import.meta.env.VITE_API_URL}/api/users/coures-detail/${courseId}`;// You will provide this URL

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(apiUrl);
        console.log(response.data.course);
        setCourseData(response.data.course);

        // Initialize the first week as expanded if data is fetched successfully
        if (response.data && response.data.week) {
          setExpandedWeeks({ [response.data.week]: true });
          setCurrentUserWeek(response.data.week);
        } else if (response.data && response.data.studyContent?.weekly_plan?.length > 0) {
          // If 'week' is not directly in the response, default to expanding the first week
          setExpandedWeeks({ 1: true });
          setCurrentUserWeek(1);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        // Optionally set a default state or display an error message
        setCourseData(null);
        setExpandedWeeks({ 1: true });
        setCurrentUserWeek(1);
      }
    };

    if (courseId) { // Only fetch data if courseId is available
      fetchCourseData();
    } else {
      console.warn('courseId not found in URL parameters.');
      // Optionally set a default state or display a message
      setCourseData(null);
      setExpandedWeeks({});
      setCurrentUserWeek(1);
    }
  }, [apiUrl, courseId]);

  const toggleWeekExpansion = (weekNumber) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNumber]: !prev[weekNumber]
    }));
  };

  const markTopicComplete = (weekNumber, topicName) => {
    setCompletedTopics(prev => {
      const weekKey = `week-${weekNumber}`;
      return {
        ...prev,
        [weekKey]: {
          ...(prev[weekKey] || {}),
          [topicName]: !(prev[weekKey] && prev[weekKey][topicName])
        }
      };
    });
  };

  const isTopicCompleted = (weekNumber, topicName) => {
    return courseData.test + 3 >= weekNumber;
    // const weekKey = `week-${weekNumber}`;
    // return completedTopics[weekKey] && completedTopics[weekKey][topicName];
  };

  const openAIAssistant = (weekNumber, topicName) => {
    // This would integrate with your AI learning feature
    alert(`Opening AI Assistant for Week ${weekNumber}: ${topicName}`);
  };

  const takeWeekTest = (weekTitle, topics) => {
    // Navigate to test, passing data in location.state
    navigate(`/test`, {
      state: {
        title: weekTitle,
        topics: topics,
        courseId: courseId
      }
    });
  };

  if (!courseData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { studyContent } = courseData;
  const { study_topic, difficulty, total_weeks, weekly_plan } = studyContent;

  // Calculate course progress
  const totalTopics = weekly_plan.reduce((count, week) => count + week.topics.length, 0);
  const completedCount = Object.values(completedTopics).reduce((count, week) => {
    return count + Object.values(week).filter(completed => completed).length;
  }, 0);
  const progressPercentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white py-8 sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col gap-6">
            {/* Course Title & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-300" />
                  <h1 className="text-2xl sm:text-4xl font-bold">{study_topic}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-sm">
                    <Target className="w-4 h-4" />
                    {difficulty} Level
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-sm">
                    <Clock className="w-4 h-4" />
                    {total_weeks} Weeks
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-sm">
                    <Award className="w-4 h-4" />
                    Week {currentUserWeek}
                  </span>
                </div>
              </div>

              <button className="group flex items-center gap-2 bg-white hover:bg-opacity-95 text-indigo-700 font-semibold py-2.5 px-6 rounded-lg transition shadow-lg shadow-blue-900/20">
                Continue Learning
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="w-full h-full opacity-50 bg-[linear-gradient(45deg,_rgba(255,255,255,0.15)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.15)_50%,_rgba(255,255,255,0.15)_75%,_transparent_75%)] bg-[length:1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite]"></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{progressPercentage}% Complete</span>
                <span className="text-blue-200">
                  Week {currentUserWeek} of {total_weeks}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Progress Card */}
          <div className="group bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-blue-100/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-3 rounded-xl rotate-3 group-hover:rotate-6 transition-transform">
                  <BookOpen className="text-white w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                  Your Progress
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-600">{completedCount}</span>
                <div className="space-y-0.5">
                  <span className="text-gray-400 text-sm">of {totalTopics}</span>
                  <p className="text-gray-600 text-sm">Topics Completed</p>
                </div>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / totalTopics) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Test Card */}
          <div className="group bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-indigo-100/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-3 rounded-xl rotate-3 group-hover:rotate-6 transition-transform">
                  <GraduationCap className="text-white w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 text-transparent bg-clip-text">
                  Next Test
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-indigo-600">Week {currentUserWeek}</span>
              </div>
              <p className="text-gray-600">Complete current topics to unlock your next assessment</p>
              <button className="mt-2 flex items-center gap-2 text-indigo-600 font-medium group-hover:text-indigo-800 transition-colors">
                View Requirements
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Project Card */}
          <div className="group bg-gradient-to-br from-white to-purple-50/50 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-purple-100/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-3 rounded-xl rotate-3 group-hover:rotate-6 transition-transform">
                  <Code className="text-white w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-800 text-transparent bg-clip-text">
                  Active Project
                </h3>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                Week {currentUserWeek}
              </span>
            </div>
            <div className="space-y-3">
              <p className="text-gray-800 font-medium line-clamp-2 text-lg">
                {weekly_plan.find(w => w.week === currentUserWeek)?.project || "No active project"}
              </p>
              <button className="mt-2 flex items-center gap-2 text-purple-600 font-medium group-hover:text-purple-800 transition-colors">
                View Project Details
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Weeks Accordion */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
          <h2 className="text-2xl font-bold p-6 border-b border-gray-200">Course Curriculum</h2>

          {weekly_plan.map((weekItem, i) => {
            const isExpanded = expandedWeeks[weekItem.week];
            const isCurrentWeek = (i === courseData.test);
            const isCompleted = (i < courseData.test);
            const isLocked = !(i <= courseData.test);

            return (
              <div
                key={weekItem.week}
                className={`border-b border-gray-200 last:border-b-0 ${isCurrentWeek ? 'bg-blue-50' : ''}`}
              >
                {/* Week Header */}
                <div
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${isExpanded ? 'bg-gray-50' : ''} ${isLocked ? 'opacity-60' : ''}`}
                  onClick={() => !isLocked && toggleWeekExpansion(weekItem.week)}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${isCompleted ? 'bg-green-100 text-green-600' :
                      isCurrentWeek ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                      {isCompleted ? <CheckCircle size={18} /> : weekItem.week}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Week {weekItem.week}: {weekItem.title}</h3>
                      <p className="text-sm text-gray-600">{weekItem.topics.length} topics</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {!isLocked && (
                      <button
                        className="mr-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          takeWeekTest(weekItem.topics, weekItem.title);
                        }}
                      >
                        Take Test
                      </button>
                    )}
                    {isLocked ? (
                      <div className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </div>
                    ) : (
                      isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />
                    )}
                  </div>
                </div>

                {/* Week Content */}
                {isExpanded && !isLocked && (
                  <div className="p-4 pl-16 bg-white">
                    {/* Topics */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Topics</h4>
                      <div className="space-y-3">
                        {weekItem.topics.map((topic, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`topic-${weekItem.week}-${idx}`}
                                checked={isTopicCompleted(weekItem.week, topic)}
                                onChange={() => markTopicComplete(weekItem.week, topic)}
                                className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
                              />
                              <label htmlFor={`topic-${weekItem.week}-${idx}`} className="text-gray-700">
                                {topic}
                              </label>
                            </div>
                            <button
                              onClick={() => openAIAssistant(weekItem.week, topic)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              Learn with AI
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    {weekItem.resources && weekItem.resources.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Resources</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {weekItem.resources.map((resource, index) => (
                            <a
                              key={index}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition duration-200"
                            >
                              <ExternalLink className="text-blue-600 mr-3" size={18} />
                              <span className="text-blue-600 hover:underline line-clamp-1">
                                {resource.name}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Project */}
                    {weekItem.project && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Weekly Project</h4>
                        <div className="bg-gray-50 p-4 rounded-md border-l-4 border-indigo-500">
                          <p className="text-gray-700">{weekItem.project}</p>
                          <div className="mt-4 flex space-x-3">
                            <button className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium py-2 px-4 rounded-md text-sm transition duration-200">
                              Get AI Help
                            </button>
                            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 px-4 rounded-md text-sm transition duration-200">
                              Submit Project
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {weekItem.notes && Object.keys(weekItem.notes).length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Detailed Notes</h4>
                        <div className="space-y-4">
                          {Object.entries(weekItem.notes).map(([noteTitle, noteContent]) => (
                            <div key={noteTitle} className="bg-gray-50 p-4 rounded-md">
                              <h5 className="font-semibold text-gray-800 mb-2">{noteTitle}</h5>
                              <p className="text-gray-700">{noteContent}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearnCourse;
