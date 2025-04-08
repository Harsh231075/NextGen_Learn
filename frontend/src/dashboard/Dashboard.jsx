import React, { useState } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import Sidebar from './components/Sidebar';
import PerformanceOverview from './components/PerformanceOverview';
import LearningPath from './components/LearningPath';
import AIAssistant from './components/AIAssistant';
import Community from './components/Community';
import ReferralSystem from './components/ReferralSystem';
import ProfileSettings from './components/ProfileSettings';
import Certificates from './components/Certificates';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <PerformanceOverview />;
      case 'learning':
        return <LearningPath />;
      case 'ai':
        return <AIAssistant />;
      case 'community':
        return <Community />;
      case 'referral':
        return <ReferralSystem />;
      case 'profile':
        return <ProfileSettings />;
      case 'certificates':
        return <Certificates />;
      default:
        return <PerformanceOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-900 rounded-lg text-white"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, sliding on mobile */}
      <aside className={`
        fixed lg:fixed inset-y-0 left-0 z-40 w-72
        transform transition-transform duration-300 ease-in-out
        lg:transform-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          onSectionChange={(section) => {
            setActiveSection(section);
            setIsSidebarOpen(false);
          }}
          activeSection={activeSection}
        />
      </aside>

      {/* Main Content - Always scrollable */}
      <main className="flex-1 ml-0 lg:ml-72">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 pt-16 lg:pt-4">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;