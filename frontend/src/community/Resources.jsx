import React from 'react';
import { FileText, Video, Link as LinkIcon, Download, Upload } from 'lucide-react';

const Resources = () => {
  const resources = [
    {
      title: 'Getting Started Guide',
      type: 'Document',
      icon: FileText,
      size: '2.4 MB',
      updated: '2 days ago',
    },
    {
      title: 'Community Welcome Video',
      type: 'Video',
      icon: Video,
      size: '45 MB',
      updated: '1 week ago',
    },
    {
      title: 'Useful Resources Collection',
      type: 'Link',
      icon: LinkIcon,
      updated: '3 days ago',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Resources</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-blue-100 rounded-full">
                <resource.icon size={24} className="text-blue-600" />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Download size={20} className="text-gray-600" />
              </button>
            </div>
            <h3 className="text-lg font-semibold mt-4">{resource.title}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-500">Type: {resource.type}</p>
              {resource.size && (
                <p className="text-sm text-gray-500">Size: {resource.size}</p>
              )}
              <p className="text-sm text-gray-500">Updated: {resource.updated}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Upload New Resource</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Upload size={24} className="text-blue-600" />
          </div>
          <p className="text-gray-600">
            Drag and drop your files here, or{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              browse
            </button>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Maximum file size: 50MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default Resources;