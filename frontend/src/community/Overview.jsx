import React from 'react';
import { Users, UserPlus, Building, Calendar } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-blue-100 rounded-full">
        <Icon size={24} className="text-blue-600" />
      </div>
      <div>
        <p className="text-gray-600">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  </div>
);

const Overview = () => {
  const stats = [
    { icon: Users, label: 'Total Members', value: '1,234' },
    { icon: UserPlus, label: 'Join Requests', value: '56' },
    { icon: Building, label: 'Communities', value: '12' },
    { icon: Calendar, label: 'Events This Month', value: '8' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Join Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b">
                  <td className="py-3 px-4">John Doe {i}</td>
                  <td className="py-3 px-4">john{i}@example.com</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                        Accept
                      </button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;