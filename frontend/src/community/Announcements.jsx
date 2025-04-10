import React from 'react';
import { Bell, Pin } from 'lucide-react';

const Announcements = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>

      <div className="space-y-4">
        {/* Pinned Announcement */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Pin size={24} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Pinned
                </span>
                <span className="text-sm text-gray-500">Posted 2 days ago</span>
              </div>
              <h3 className="text-lg font-semibold mt-2">Community Guidelines Update</h3>
              <p className="text-gray-600 mt-2">
                We've updated our community guidelines to better serve our growing community.
                Please take a moment to review the changes.
              </p>
            </div>
          </div>
        </div>

        {/* Regular Announcements */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Bell size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Posted {i} days ago</span>
                </div>
                <h3 className="text-lg font-semibold mt-2">
                  {i === 1 && "New Feature Release"}
                  {i === 2 && "Upcoming Community Event"}
                  {i === 3 && "Maintenance Notice"}
                </h3>
                <p className="text-gray-600 mt-2">
                  {i === 1 && "We're excited to announce the launch of our new community features..."}
                  {i === 2 && "Join us for our monthly community meetup this weekend..."}
                  {i === 3 && "The platform will undergo scheduled maintenance on..."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;