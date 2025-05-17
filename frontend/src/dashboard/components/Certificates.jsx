import React from 'react';
import { Award, Download, Briefcase, Lock, Medal, BookOpen } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getRegisteredCourses } from '../../redux/features/coursesSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Certificates = () => {
  const courses = useSelector(getRegisteredCourses);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleCertificateClick = (course) => {
    if (course.completed) {
      // Extract required details from the course
      const certificateDetails = {
        study_topic: course.studyContent.study_topic,
        total_weeks: course.studyContent.total_weeks,
        difficulty: course.studyContent.difficulty
      };

      // Navigate to certificate page with details
      navigate('/certificate-download', { state: certificateDetails });
    }
  };

  const navigateToPortfolio = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id || decodedToken._id;
      navigate(`/protfolio/${userId}`);
    }
  };

  // Calculate stats
  const completedCourses = courses ? courses.filter(course => course.completed).length : 0;
  const inProgressCourses = courses ? courses.filter(course => !course.completed).length : 0;
  const uniqueSkills = courses ? [...new Set(courses.map(course => course.studyContent.study_topic))].length : 0;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Your Achievements Portfolio</h2>
          <p className="text-gray-600 mt-2">Track your learning journey and showcase your skills</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Certificate Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-4 px-6">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-white" />
                <h3 className="text-xl font-semibold text-white">Professional Certificates</h3>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {courses && courses.length > 0 ? (
                courses.map((course, index) => (
                  <div
                    key={index}
                    onClick={() => handleCertificateClick(course)}
                    className={`p-6 transition-all duration-300 ${
                      course.completed 
                        ? 'hover:bg-green-50 cursor-pointer' 
                        : 'opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${course.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {course.completed ? (
                            <Medal className={`h-6 w-6 ${course.completed ? 'text-green-600' : 'text-gray-500'}`} />
                          ) : (
                            <BookOpen className="h-6 w-6 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-gray-800">{course.studyContent.study_topic}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {course.completed
                              ? `Completed: ${new Date(course.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}`
                              : `In Progress • ${course.studyContent.total_weeks} weeks • ${course.studyContent.difficulty} level`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {course.completed ? (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 font-medium py-1 px-3 bg-green-50 rounded-full text-sm">Certified</span>
                            <button 
                              className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                              title="Download Certificate"
                            >
                              <Download className="h-5 w-5 text-blue-600" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-orange-500 font-medium py-1 px-3 bg-orange-50 rounded-full text-sm">In Progress</span>
                            <div className="p-2 bg-gray-100 rounded-full">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                  <h4 className="text-xl font-semibold text-gray-600 mb-2">No Courses Yet</h4>
                  <p className="text-gray-500 max-w-md">
                    Enroll in courses to start your learning journey and earn certificates to showcase your skills.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Portfolio Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 py-4 px-6">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-white" />
                  <h3 className="text-xl font-semibold text-white">Portfolio Summary</h3>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{completedCourses}</div>
                    <div className="text-sm text-gray-600">Certified</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{inProgressCourses}</div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Skills Acquired</span>
                    <span className="font-semibold text-gray-800">{uniqueSkills}</span>
                  </div>
                  
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div style={{ width: `${Math.min(uniqueSkills * 10, 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                    </div>
                  </div>

                  <button 
                    onClick={navigateToPortfolio} 
                    className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Briefcase className="h-5 w-5" />
                    View Full Portfolio
                  </button>
                </div>
              </div>
            </div>

            {/* Achievement Tips */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips to Enhance Your Portfolio</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Complete all course modules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Submit all required projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Add your certificates to LinkedIn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Maintain consistent learning streaks</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;