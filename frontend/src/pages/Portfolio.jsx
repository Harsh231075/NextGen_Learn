import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function EnhancedPortfolio() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('skills');
  
  // Get userId from URL parameters
  const { userId } = useParams();

  useEffect(() => {
    // Fetch user data from API using the userId from parameters
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/getUserProfile/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const result = await response.json();
        setUserData(result.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-2xl font-bold text-white">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            <span className="ml-2">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-red-600 font-bold text-xl p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Background shapes for visual appeal
  const BackgroundShapes = () => (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  );

  const SkillBar = ({ skill, index }) => {
    const colors = [
      'bg-gradient-to-r from-blue-500 to-blue-600', 
      'bg-gradient-to-r from-green-500 to-green-600',
      'bg-gradient-to-r from-purple-500 to-purple-600',
      'bg-gradient-to-r from-red-500 to-red-600',
      'bg-gradient-to-r from-yellow-500 to-yellow-600'
    ];
    const randomWidth = 65 + Math.floor(Math.random() * 30); // Between 65% and 95%
    
    return (
      <div className="mb-5" key={index}>
        <div className="flex justify-between mb-1">
          <span className="text-lg font-medium text-white">{skill}</span>
          <span className="text-sm font-medium text-gray-300">{randomWidth}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${colors[index % colors.length]}`} 
            style={{ width: `${randomWidth}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      <BackgroundShapes />
      
      {/* Header/Hero Section */}
      <header className="relative z-10 pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white">
                <img 
                  src={userData.photo} 
                  alt={userData.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                {userData.name}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto lg:mx-0 mb-4"></div>
              <p className="text-xl text-gray-300 max-w-lg mb-6">
                {userData.bio}
              </p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-full font-medium transition duration-300 shadow-lg hover:shadow-xl flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Me
                </button>
                <button className="px-6 py-3 border-2 border-white hover:bg-white hover:text-gray-900 rounded-full font-medium transition duration-300 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CV
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-800 p-1 rounded-full inline-flex">
              {['skills', 'projects', 'education'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2 rounded-full font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          {activeTab === 'skills' && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold mb-12 text-center">
                <span className="relative">
                  Technical Skills
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></span>
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {userData.skills.map((skill, index) => (
                  <SkillBar key={index} skill={skill} index={index} />
                ))}
              </div>
              
              <div className="mt-16 bg-gray-800 rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold mb-4 text-center">Technical Expertise</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {userData.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-6 py-3 rounded-full text-lg font-medium"
                      style={{
                        background: `linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()})`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Section */}
          {activeTab === 'projects' && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold mb-12 text-center">
                <span className="relative">
                  Featured Projects
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></span>
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userData.projects.map((project) => (
                  <div 
                    key={project.id} 
                    className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-2"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 z-10"></div>
                      <img 
                        src={project.image || "/api/placeholder/600/400"} 
                        alt={project.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 mb-4">{project.description}</p>
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center font-semibold text-blue-400 hover:text-blue-300 transition"
                      >
                        View Project
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                    <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                      Project #{project.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {activeTab === 'education' && (
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold mb-12 text-center">
                <span className="relative">
                  Academic Background
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></span>
                </span>
              </h2>
              
              <div className="max-w-3xl mx-auto">
                {userData.education.map((edu) => (
                  <div 
                    key={edu.id} 
                    className="relative pl-10 pb-10 border-l-4 border-purple-600 last:pb-0"
                  >
                    <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    <div className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                          {edu.degree}
                        </h3>
                        <span className="bg-blue-900 text-blue-200 px-4 py-1 rounded-full text-sm font-semibold">
                          Class of {edu.year}
                        </span>
                      </div>
                      <h4 className="text-xl text-gray-300 mb-3">{edu.institute}</h4>
                      <p className="text-gray-400">{edu.description || "Studying Computer Science with focus on modern web technologies and software development practices."}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 py-8 mt-20 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {userData.name}
              </h2>
              <p className="text-gray-400 mt-1">{userData.bio}</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-1 15h-2v-6h2v6zm-1-7a1 1 0 100-2 1 1 0 000 2zm5 7h-2v-4h-2v-2h4v6z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} {userData.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function getRandomColor() {
  const colors = [
    '#4f46e5', '#3b82f6', '#06b6d4', 
    '#8b5cf6', '#d946ef', '#ec4899',
    '#f43f5e', '#f97316', '#eab308'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}