import React, { useState } from 'react';
import { User, Star, Users, Clock, Award, ChevronRight } from 'lucide-react';
import BecomeMentor from '../mentor/BecomeMentor';
import { useSelector } from 'react-redux';
import { selectDashboardData } from '../../redux/features/dashboardSlice';

function MentorshipTab({ mentors }) {
  const dashboardData = useSelector(selectDashboardData);
  const isMentor = dashboardData?.user?.mentor;
  const [showBecomeMentor, setShowBecomeMentor] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleBecomeMentorClick = () => {
    if (isMentor) {
      setShowBecomeMentor(true);
    } else {
      setShowModal(true);
    }
  };

  const handleBack = () => {
    setShowBecomeMentor(false);
  };

  if (showBecomeMentor) {
    return <BecomeMentor onBack={handleBack} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Mentorship Program</h2>
        <p className="text-gray-600 text-lg mb-8">Connect with experienced developers and accelerate your learning journey</p>
        <button
          onClick={handleBecomeMentorClick}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Become a Mentor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map(mentor => (
          <div key={mentor.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <User className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{mentor.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">{mentor.expertise}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium">{mentor.experience} Experience</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium">{mentor.students} Students</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">4.9</span>
                  <span className="text-gray-500 text-sm">(120 reviews)</span>
                </div>
                <button className="flex items-center gap-2 bg-indigo-50 text-indigo-600 font-semibold py-2 px-4 rounded-xl hover:bg-indigo-100 transition-colors duration-300">
                  Connect
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Not Eligible</h2>
            <p className="text-gray-600 mb-6">
              You need to meet certain criteria to become a mentor. Please check our requirements and try again later.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl transition-colors duration-300"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorshipTab; 