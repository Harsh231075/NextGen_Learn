// Sidebar.jsx
import React from 'react';
import { Menu, Home, BookOpen, Bot, Users, Gift, Settings, Award, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/authSlice';

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state
    navigate('/', { replace: true }); // Navigate to home and replace history
  };

  const menuItems = [
    { path: '/dashboard/overview', icon: <Home />, title: 'Performance Overview' },
    { path: '/dashboard/learning', icon: <BookOpen />, title: 'Learning Path' },
    { path: '/dashboard/ai', icon: <Bot />, title: 'AI Assistant' },
    { path: '/dashboard/community', icon: <Users />, title: 'Community' },
    { path: '/dashboard/referral', icon: <Gift />, title: 'Referral & Earnings' },
    { path: '/dashboard/profile', icon: <Settings />, title: 'Profile & Settings' },
    { path: '/dashboard/certificates', icon: <Award />, title: 'Certificates' },
    { path: '/dashboard/leaderbaord', icon: <Award />, title: 'leaderbaord' },
    // { path: '/dashboard/protfolio', icon: <Award />, title: 'protfolio' }
  ];

  return (
    <div className="h-screen w-72 bg-gradient-to-b from-blue-900 to-indigo-900 text-white p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2 bg-white/10 rounded-xl">
          <Menu className="h-6 w-6" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-indigo-200 text-transparent bg-clip-text">
          Learning Hub
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/10"
          >
            <div className="text-blue-300">
              {item.icon}
            </div>
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 bg-red-500 hover:bg-red-600 text-white"
        >
          <LogOut />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
