import React from 'react';
import { Camera, Mail, MapPin, Globe, Calendar } from 'lucide-react';

const Profile = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Community Profile</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 relative">
          <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg">
            <Camera size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Picture */}
            <div className="relative -mt-20 md:-mt-16">
              <img
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a"
                alt="Community Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-lg">
                <Camera size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">Tech Enthusiasts Hub</h2>
              <p className="text-gray-600 mt-1">A community for technology lovers and innovators</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={18} />
                  <span>contact@techhub.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe size={18} />
                  <span>www.techhub.com</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span>Founded: January 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">About Us</h3>
          <p className="text-gray-600">
            We are a vibrant community of tech enthusiasts dedicated to sharing knowledge,
            fostering innovation, and building meaningful connections in the technology space.
            Our members range from beginners to experts, all united by their passion for technology.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Community Guidelines</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Be respectful and inclusive to all members</li>
            <li>Share knowledge and help others learn</li>
            <li>Keep discussions professional and constructive</li>
            <li>Protect member privacy and confidentiality</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;