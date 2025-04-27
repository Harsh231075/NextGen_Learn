import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Award, Medal } from 'lucide-react';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/leaderbaord`);
        setUsers(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch leaderboard data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };
    fetchLeaderboardData();
  }, []);

  // Function to navigate to user's portfolio page
  const navigateToPortfolio = (userId) => {
    navigate(`/protfolio/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Get top 3 users for special styling
  const topUsers = users.slice(0, 3);
  const otherUsers = users.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-blue-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header - Reduced Height */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
            Champions Leaderboard
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto"></div>
        </div>

        {/* Top 3 Users - Fixed Horizontal Alignment */}
        {topUsers.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-8 w-full">
            {/* Second Place */}
            <div className="flex flex-col items-center justify-end">
              {topUsers.length >= 2 ? (
                <div 
                  className="cursor-pointer flex flex-col items-center w-full"
                  onClick={() => navigateToPortfolio(topUsers[1]._id)}
                >
                  <div className="bg-gradient-to-b from-gray-200 to-gray-300 rounded-full p-1 mb-1">
                    <Award size={24} className="text-gray-600" />
                  </div>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-300 overflow-hidden">
                    {topUsers[1]?.photo ? (
                      <img
                        src={topUsers[1].photo}
                        alt={`${topUsers[1].name}'s avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(topUsers[1].name)}&background=random`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                        {topUsers[1]?.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2 mt-1 shadow-md text-center w-full hover:bg-gray-200 transition-all">
                    <div className="font-bold text-gray-700 truncate max-w-full text-sm">{topUsers[1].name}</div>
                    <div className="text-xs text-gray-500">2nd Place</div>
                    <div className="font-bold text-gray-800 mt-1">{topUsers[1].point} pts</div>
                  </div>
                </div>
              ) : <div></div>}
            </div>

            {/* First Place */}
            <div className="flex flex-col items-center">
              {topUsers.length >= 1 ? (
                <div 
                  className="cursor-pointer flex flex-col items-center w-full"
                  onClick={() => navigateToPortfolio(topUsers[0]._id)}
                >
                  <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full p-1 mb-1">
                    <Trophy size={28} className="text-yellow-700" />
                  </div>
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-yellow-400 overflow-hidden">
                    {topUsers[0].photo ? (
                      <img
                        src={topUsers[0].photo}
                        alt={`${topUsers[0].name}'s avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(topUsers[0].name)}&background=random`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-yellow-100 flex items-center justify-center text-xl font-bold text-yellow-800">
                        {topUsers[0].name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-2 mt-1 shadow-md text-center w-full hover:from-yellow-100 hover:to-yellow-200 transition-all">
                    <div className="font-bold text-gray-800 truncate max-w-full">{topUsers[0].name}</div>
                    <div className="text-xs text-yellow-600">Champion</div>
                    <div className="font-bold text-yellow-700 text-lg mt-1">{topUsers[0].point} pts</div>
                  </div>
                </div>
              ) : <div></div>}
            </div>

            {/* Third Place */}
            <div className="flex flex-col items-center justify-end">
              {topUsers.length >= 3 ? (
                <div 
                  className="cursor-pointer flex flex-col items-center w-full"
                  onClick={() => navigateToPortfolio(topUsers[2]._id)}
                >
                  <div className="bg-gradient-to-b from-orange-200 to-orange-300 rounded-full p-1 mb-1">
                    <Medal size={24} className="text-orange-700" />
                  </div>
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-orange-300 overflow-hidden">
                    {topUsers[2].photo ? (
                      <img
                        src={topUsers[2].photo}
                        alt={`${topUsers[2].name}'s avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(topUsers[2].name)}&background=random`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-orange-100 flex items-center justify-center text-lg font-bold text-orange-700">
                        {topUsers[2].name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2 mt-1 shadow-md text-center w-full hover:bg-orange-100 transition-all">
                    <div className="font-bold text-gray-700 truncate max-w-full text-sm">{topUsers[2].name}</div>
                    <div className="text-xs text-orange-600">3rd Place</div>
                    <div className="font-bold text-orange-700 mt-1">{topUsers[2].point} pts</div>
                  </div>
                </div>
              ) : <div></div>}
            </div>
          </div>
        )}

        {/* Rest of the leaderboard */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white flex items-center">
            <div className="w-12 text-center font-semibold">Rank</div>
            <div className="w-12"></div>
            <div className="flex-1 font-semibold">Player</div>
            <div className="w-24 text-right font-semibold">Score</div>
          </div>

          <div className="divide-y divide-gray-100">
            {otherUsers.map((user, index) => (
              <div 
                key={user._id} 
                className="px-6 py-3 flex items-center hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => navigateToPortfolio(user._id)}
              >
                {/* Rank */}
                <div className="w-12 text-center">
                  <span className="bg-gray-100 text-gray-700 font-bold rounded-full h-8 w-8 flex items-center justify-center">
                    {index + 4}
                  </span>
                </div>

                {/* Avatar */}
                <div className="w-12">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={`${user.name}'s avatar`}
                      className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-blue-200">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 font-medium truncate text-gray-800">
                  {user.name}
                </div>

                {/* Points */}
                <div className="w-24 text-right">
                  <span className="font-bold text-blue-600">{user.point}</span>
                  <span className="text-gray-500 text-sm ml-1">pts</span>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M12 20h.01M12 4a8 8 0 100 16 8 8 0 000-16z" />
              </svg>
              <p className="mt-3 font-medium">No users found</p>
              <p className="text-sm text-gray-400">Check back later for leaderboard updates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}