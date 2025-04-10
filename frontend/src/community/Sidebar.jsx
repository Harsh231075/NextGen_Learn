import React from 'react';
import { Menu, X, Home, Megaphone, BookOpen, UserCircle } from 'lucide-react';

const Sidebar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeSection,
  setActiveSection
}) => {
  const menuItems = [
    { icon: <Home size={20} />, label: 'Overview', id: 'overview' },
    { icon: <Megaphone size={20} />, label: 'Announcements', id: 'announcements' },
    { icon: <BookOpen size={20} />, label: 'Resources', id: 'resources' },
    { icon: <UserCircle size={20} />, label: 'Profile', id: 'profile' },
  ];

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-40
          transition-transform duration-300 ease-in-out
          w-64
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg
                transition-colors duration-200
                ${activeSection === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;