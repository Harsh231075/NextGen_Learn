import React from 'react';
import { Award, Download, Briefcase, Lock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getRegisteredCourses } from '../../redux/features/coursesSlice';
import { useNavigate } from 'react-router-dom';

const Certificates = () => {
  const courses = useSelector(getRegisteredCourses);
  const navigate = useNavigate();

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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Certificates & Achievements</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Your Certificates</h3>
          </div>

          <div className="space-y-4">
            {courses && courses.map((course, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 ${course.completed ? 'bg-green-50 hover:bg-green-100 cursor-pointer' : 'bg-gray-50'} rounded-lg transition-colors`}
                onClick={() => handleCertificateClick(course)}
              >
                <div>
                  <div className="font-medium">{course.studyContent.study_topic}</div>
                  <div className="text-sm text-gray-500">
                    {course.completed
                      ? `Completed: ${new Date(course.createdAt).toLocaleDateString()}`
                      : 'Status: In Progress'}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {course.completed ? (
                    <>
                      <span className="text-green-500 font-semibold">Certified</span>
                      <button className="p-2 hover:bg-green-200 rounded-full">
                        <Download className="h-5 w-5 text-green-600" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-orange-500 font-semibold">Locked</span>
                      <div className="p-2 bg-gray-200 rounded-full opacity-50">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {(!courses || courses.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No courses registered yet.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-semibold">Portfolio Highlights</h3>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                Total Certificates: <span className="font-semibold">
                  {courses ? courses.filter(course => course.completed).length : 0}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Courses In Progress: <span className="font-semibold">
                  {courses ? courses.filter(course => !course.completed).length : 0}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Skills: <span className="font-semibold">
                  {courses ? [...new Set(courses.map(course => course.studyContent.study_topic))].length : 0}
                </span>
              </div>
              <button className="w-full mt-2 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors">
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;