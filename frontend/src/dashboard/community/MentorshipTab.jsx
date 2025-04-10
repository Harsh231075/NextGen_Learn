import React from 'react';
import { User } from 'lucide-react';

function MentorshipTab({ mentors }) {
  return (
    <div>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white p-6 mb-8 shadow-md">
        <div className="md:flex justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Mentorship Program</h2>
            <p className="text-indigo-100">Connect with experienced developers or share your knowledge</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition">
              Find a Mentor
            </button>
            <button className="bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-800 border border-indigo-300 transition">
              Become a Mentor
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {mentors.map(mentor => (
          <div key={mentor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-200 flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{mentor.name}</h3>
                  <p className="text-indigo-600">{mentor.expertise}</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{mentor.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">{mentor.students}</span>
                </div>
              </div>
              <button className="w-full bg-indigo-100 text-indigo-700 py-2 rounded-lg font-medium hover:bg-indigo-200 transition">
                Request Mentorship
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MentorshipTab;