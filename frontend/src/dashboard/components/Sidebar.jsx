// Sidebar.jsx
import React from 'react';
import { Menu, Home, BookOpen, Bot, Users, Gift, Settings, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ onSectionChange, activeSection }) => {
  const menuItems = [
    { path: 'overview', icon: <Home />, title: 'Performance Overview' },
    { path: 'learning', icon: <BookOpen />, title: 'Learning Path' },
    { path: 'ai', icon: <Bot />, title: 'AI Assistant' },
    { path: 'community', icon: <Users />, title: 'Community' },
    { path: 'referral', icon: <Gift />, title: 'Referral & Earnings' },
    { path: 'profile', icon: <Settings />, title: 'Profile & Settings' },
    { path: 'certificates', icon: <Award />, title: 'Certificates' }
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
          <SidebarItem
            key={item.path}
            icon={item.icon}
            title={item.title}
            isActive={activeSection === item.path}
            onClick={() => onSectionChange(item.path)}
          />
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <Link to="/my-mentors" className='w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 bg-green-400 mb-2'>
          <Users /> Talk To Mentor
        </Link>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <div className="font-medium">Alex Johnson</div>
              <div className="text-sm text-blue-200">Pro Member</div>
            </div>
          </div>
          <div className="text-sm text-blue-200">
            Learning streak: <span className="text-white font-medium">15 days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, title, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive
        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg'
        : 'hover:bg-white/10'
        }`}
    >
      <div className={`${isActive ? 'text-white' : 'text-blue-300'}`}>
        {icon}
      </div>
      <span className="font-medium">{title}</span>
    </button>
  );
};

export default Sidebar;