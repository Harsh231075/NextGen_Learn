import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const ref = params.get('ref');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to append ref parameter to any URL if it exists
  const appendRef = (path) => {
    if (ref) {
      // Check if the path already has query parameters
      return path.includes('?')
        ? `${path}&ref=${ref}`
        : `${path}?ref=${ref}`;
    }
    return path;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-white/80 backdrop-blur-md py-6'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to={appendRef("/")} className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              NextGen Learn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link to={appendRef("/")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link> */}
            {/* <Link to={appendRef("/community")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Community
            </Link> */}
            {/* <Link to={appendRef("/leaderboard")} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Leaderboard
            </Link> */}

            <div className="flex items-center space-x-4 ml-8">
              <Link
                to={appendRef("/sign-login")}
                className="px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-all"
              >
                Login
              </Link>
              <Link
                to={appendRef("/sign-login")}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-md"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            {/* <Link to={appendRef("/")} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Home
            </Link>
            <Link to={appendRef("/community")} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Community
            </Link>
            <Link to={appendRef("/leaderboard")} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Leaderboard
            </Link> */}
            <div className="pt-4 space-y-2">
              <Link
                to={appendRef("/sign-login")}
                className="block px-4 py-2 text-center text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50"
              >
                Login
              </Link>
              <Link
                to={appendRef("/sign-login")}
                className="block px-4 py-2 text-center text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;