import React, { useState } from 'react';
import { MessageCircle, Plus, Search, ArrowRight, UserPlus } from 'lucide-react';
import CreateCommunity from '../community/CreateCommunity';
import FindMentor from '../mentor/FindMentor';
import BecomMentor from '../mentor/BecomMentor';

const Community = () => {
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showFindMentor, setShowFindMentor] = useState(false);
  const [showBecomMentor, setShowBecomMentor] = useState(false);

  const handleCreateCommunityClick = () => {
    setShowCreateCommunity(true);
    setShowFindMentor(false);
    setShowBecomMentor(false);
  };

  const handleFindMentorClick = () => {
    setShowFindMentor(true);
    setShowCreateCommunity(false);
    setShowBecomMentor(false);
  };

  const handleBecomMentorClick = () => {
    setShowBecomMentor(true);
    setShowCreateCommunity(false);
    setShowFindMentor(false);
  };

  const handleGoBackToCommunity = () => {
    setShowCreateCommunity(false);
    setShowFindMentor(false);
    setShowBecomMentor(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {!showCreateCommunity && !showFindMentor && !showBecomMentor ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Community & Collaboration</h2>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
              onClick={handleCreateCommunityClick}
            >
              <Plus className="h-5 w-5" />
              Create Community
            </button>
          </div>

          {/* Featured Communities */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Featured Communities</h3>
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search communities..."
                  className="pl-10 pr-4 py-2 border rounded-xl w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Community Card 1 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                {/* ... (rest of Community Card 1 content) ... */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                    Join Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Community Card 2 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                {/* ... (rest of Community Card 2 content) ... */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                    Join Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Create Community Card (now a button to trigger the state change) */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-all cursor-pointer" onClick={handleCreateCommunityClick}>
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Create Your Community</h4>
                  <p className="text-sm text-gray-600 mb-4">Start your own community and connect with like-minded developers</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                    <Plus className="h-4 w-4" />
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mentorship Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="h-7 w-7 text-purple-600" />
                <h3 className="text-2xl font-bold">Mentorship Program</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Looking for Guidance?</h4>
                  <p className="text-gray-600">Connect with experienced developers and accelerate your learning journey.</p>
                  <button
                    className="w-full bg-white text-purple-600 py-3 rounded-xl font-medium border border-purple-200 hover:bg-purple-50 transition-all"
                    onClick={handleFindMentorClick}
                  >
                    Find a Mentor
                  </button>
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Want to Share Knowledge?</h4>
                  <p className="text-gray-600">Help others grow by sharing your expertise and experience.</p>
                  <button
                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-all"
                    onClick={handleBecomMentorClick}
                  >
                    Become a Mentor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : showCreateCommunity ? (
        <CreateCommunity onGoBack={handleGoBackToCommunity} />
      ) : showFindMentor ? (
        <FindMentor onGoBack={handleGoBackToCommunity} />
      ) : showBecomMentor ? (
        <BecomMentor onGoBack={handleGoBackToCommunity} />
      ) : null}
    </div>
  );
};

export default Community;