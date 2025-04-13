// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import Sidebar from './components/Sidebar';
import PerformanceOverview from './components/PerformanceOverview';
import LearningPath from './components/LearningPath';
import AIAssistant from './components/AIAssistant';
import Community from './components/Community';
import ReferralSystem from './components/ReferralSystem';
import ProfileSettings from './components/ProfileSettings';
import Certificates from './components/Certificates';
import { Routes, Route, Outlet } from 'react-router-dom'; // Use Routes and Route
import { useDispatch } from 'react-redux';
import { fetchRegisteredCourses } from '../redux/features/coursesSlice';
import { fetchDashboardData } from '../redux/features/dashboardSlice';
const DashboardLayout = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const dispatch = useDispatch();
  // Fetch dashboard data when component mounts
  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchRegisteredCourses());
  }, [dispatch]);

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

      {/* Sidebar - Always rendered */}
      <aside className={`
        fixed lg:fixed inset-y-0 left-0 z-40 w-72
        transform transition-transform duration-300 ease-in-out
        lg:transform-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar />
      </aside>

      {/* Main Content Area - Contains the outlet for nested routes */}
      <main className="flex-1 ml-0 lg:ml-72">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 pt-16 lg:pt-4">
          <Outlet /> {/* This is where the child routes will render */}
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/*" element={<DashboardLayout />}> {/* Apply the layout to all sub-routes */}
        <Route path="overview" element={<PerformanceOverview />} />
        <Route path="learning" element={<LearningPath />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="community" element={<Community />} />
        <Route path="referral" element={<ReferralSystem />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="" element={<PerformanceOverview />} /> {/* Default nested route */}
      </Route>
    </Routes>
  );
};

export default Dashboard;