import React, { useEffect, useState } from 'react';
import { Search, User, Users, Menu, X } from 'lucide-react';
import HomeTab from '../community/HomeTab'; // Updated path
import PostsTab from '../community/PostsTab'; // Updated path
import ResourcesTab from '../community/ResourcesTab'; // Updated path
import MentorshipTab from '../community/MentorshipTab'; // Updated path
import { useDispatch, useSelector } from "react-redux";
import { fetchCommunityPosts } from '../../redux/features/communitySlice'
// import { formatDistanceToNowStrict } from 'date-fns';

export default function CommunityPlatform() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.community);

  useEffect(() => {
    dispatch(fetchCommunityPosts());
  }, [dispatch]);

  const resources = [
    { id: 1, title: 'Complete React Guide', type: 'PDF', size: '2.5 MB', downloads: 123 },
    { id: 2, title: 'CSS Cheat Sheet', type: 'PDF', size: '1.2 MB', downloads: 89 },
    { id: 3, title: 'JavaScript Examples', type: 'ZIP', size: '4.8 MB', downloads: 67 }
  ];

  const mentors = [
    { id: 1, name: 'Vikram Patel', expertise: 'Frontend Development', experience: '8 years', students: 12 },
    { id: 2, name: 'Neha Gupta', expertise: 'UX Design', experience: '5 years', students: 8 },
    { id: 3, name: 'Sanjay Mehta', expertise: 'Backend Development', experience: '10 years', students: 15 }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading posts...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error loading posts.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 text-transparent bg-clip-text">
                DevCommunity
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {['Home', 'Posts', 'Resources', 'Mentorship'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`font-medium px-3 py-2 rounded-lg transition-all hover:bg-white/10 ${activeTab === item.toLowerCase()
                    ? 'text-white bg-white/10'
                    : 'text-indigo-100'
                    }`}
                  onClick={() => handleTabClick(item.toLowerCase())}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search..."
                  className="py-2 px-4 pr-10 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-48 group-hover:w-56"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm">
                <User className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 bg-white/10 rounded-xl backdrop-blur-sm">
              {['Home', 'Posts', 'Resources', 'Mentorship'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-4 py-3 text-indigo-100 hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl transition-all"
                  onClick={() => handleTabClick(item.toLowerCase())}
                >
                  {item}
                </a>
              ))}
              <div className="p-4 border-t border-white/10">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full py-2 px-4 pr-10 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <HomeTab
            setActiveTab={setActiveTab}
            posts={posts}
            resources={resources}
          />
        )}
        {activeTab === 'posts' && (
          <PostsTab
            posts={posts.map(post => ({
              id: post._id,
              author: post.author?.name || 'Unknown Author',
              authorPhoto: post.author?.photo,
              title: post.title,
              content: post.description,
              likes: post?.likes || 0,
              comments: post.comments?.length || 0,
              createdAt: post.createdAt,
              fileUrl: post.fileUrl
            }))}
          />
        )}
        {activeTab === 'resources' && <ResourcesTab resources={resources} />}
        {activeTab === 'mentorship' && <MentorshipTab mentors={mentors} />}
      </main>
    </div>
  );
}