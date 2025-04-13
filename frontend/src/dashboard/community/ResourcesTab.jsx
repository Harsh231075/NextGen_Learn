import React, { useState } from 'react';
import { Plus, X, FileText, Code, LayoutTemplate, Filter, Eye } from 'lucide-react';
import axios from 'axios';

function ResourcesTab({ resources: initialResources }) {
  const [resources, setResources] = useState(initialResources);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);

  // Format the file size in a readable format
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file type icon based on extension
  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'code':
      case 'js':
      case 'py':
      case 'java':
        return <Code className="h-5 w-5 text-blue-500" />;
      case 'template':
        return <LayoutTemplate className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get file type from file URL
  const getFileType = (fileUrl) => {
    if (!fileUrl) return 'document';
    const extension = fileUrl.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return 'pdf';
    if (['js', 'py', 'java', 'html', 'css', 'php', 'ts'].includes(extension)) return 'code';
    if (['docx', 'doc', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension)) return 'template';
    return 'document';
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
    setUploadForm({ title: '', description: '', file: null });
    setUploadError('');
    setUploadSuccess('');
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setUploadForm(prevState => ({
      ...prevState,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess('');
    setIsUploading(true);

    if (!uploadForm.title.trim()) {
      setUploadError('Please enter a title.');
      setIsUploading(false);
      return;
    }

    if (!uploadForm.file) {
      setUploadError('Please select a file to upload.');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('file', uploadForm.file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/community/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Upload successful:', response.data);
      setUploadSuccess('Resource uploaded successfully!');

      // Get user info for the new resource
      const userName = localStorage.getItem('userName') || 'You';
      const userPhoto = localStorage.getItem('userPhoto') || '';

      // Create a new resource object and add it to the resources state
      const newResource = {
        id: response.data.id || Date.now(),
        title: uploadForm.title,
        description: uploadForm.description,
        download: response.data.fileUrl || '',
        name: userName,
        photo: userPhoto,
        ...response.data
      };

      // Update the resources state with the new resource
      setResources(prevResources => [newResource, ...prevResources]);

      setTimeout(() => {
        closeUploadModal();
        setIsUploading(false);
      }, 1500);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to upload resource. Please try again.');
      setIsUploading(false);
    }
  };

  const handleView = (fileUrl) => {
    if (!fileUrl) {
      alert('View link not available');
      return;
    }
    window.open(fileUrl, '_blank');
  };

  // Filter resources based on selected category
  const filteredResources = resources.filter(resource => {
    if (activeFilter === 'all') return true;
    const fileType = getFileType(resource.download);
    return fileType === activeFilter;
  });

  return (
    <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Learning Resources</h2>
        <button
          onClick={openUploadModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          <span>Upload Resource</span>
        </button>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-2 text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Filter Resources</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1.5 rounded-lg transition text-xs sm:text-sm font-medium ${activeFilter === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              onClick={() => setActiveFilter('all')}
            >
              All Resources
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg transition text-xs sm:text-sm font-medium ${activeFilter === 'pdf' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              onClick={() => setActiveFilter('pdf')}
            >
              PDFs
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg transition text-xs sm:text-sm font-medium ${activeFilter === 'code' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              onClick={() => setActiveFilter('code')}
            >
              Code Examples
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg transition text-xs sm:text-sm font-medium ${activeFilter === 'template' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              onClick={() => setActiveFilter('template')}
            >
              Templates
            </button>
          </div>
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
          <p className="text-gray-500">No resources found for this category.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {/* Table for larger screens */}
            <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                  <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResources.map(resource => {
                  const fileType = getFileType(resource.download);
                  return (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                            {getFileIcon(fileType)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{resource.title}</div>
                            {resource.description && (
                              <div className="text-gray-500 text-sm truncate max-w-xs">{resource.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {resource.photo ? (
                            <img src={resource.photo} alt={resource.name} className="h-6 w-6 sm:h-8 sm:w-8 rounded-full mr-2 object-cover" />
                          ) : (
                            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-indigo-200 flex items-center justify-center mr-2">
                              <span className="text-indigo-600 font-medium text-xs sm:text-sm">
                                {resource.name?.charAt(0).toUpperCase() || "U"}
                              </span>
                            </div>
                          )}
                          <span className="text-xs sm:text-sm text-gray-700">{resource.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <span className="px-2 py-1 text-xs font-medium rounded-full capitalize"
                          style={{
                            backgroundColor: fileType === 'pdf' ? 'rgba(239, 68, 68, 0.1)' :
                              fileType === 'code' ? 'rgba(59, 130, 246, 0.1)' :
                                'rgba(139, 92, 246, 0.1)',
                            color: fileType === 'pdf' ? 'rgb(185, 28, 28)' :
                              fileType === 'code' ? 'rgb(30, 64, 175)' :
                                'rgb(109, 40, 217)'
                          }}>
                          {fileType}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleView(resource.download)}
                            className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1 transition"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Card layout for mobile */}
            <div className="sm:hidden divide-y divide-gray-200">
              {filteredResources.map(resource => {
                const fileType = getFileType(resource.download);
                return (
                  <div key={resource.id} className="p-4">
                    <div className="flex items-start mb-2">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                        {getFileIcon(fileType)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{resource.title}</div>
                        {resource.description && (
                          <div className="text-gray-500 text-sm line-clamp-2">{resource.description}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        {resource.photo ? (
                          <img src={resource.photo} alt={resource.name} className="h-6 w-6 rounded-full mr-2 object-cover" />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-indigo-200 flex items-center justify-center mr-2">
                            <span className="text-indigo-600 font-medium text-xs">
                              {resource.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-gray-700">{resource.name || "Unknown"}</span>
                      </div>

                      <span className="px-2 py-1 text-xs font-medium rounded-full capitalize ml-2"
                        style={{
                          backgroundColor: fileType === 'pdf' ? 'rgba(239, 68, 68, 0.1)' :
                            fileType === 'code' ? 'rgba(59, 130, 246, 0.1)' :
                              'rgba(139, 92, 246, 0.1)',
                          color: fileType === 'pdf' ? 'rgb(185, 28, 28)' :
                            fileType === 'code' ? 'rgb(30, 64, 175)' :
                              'rgb(109, 40, 217)'
                        }}>
                        {fileType}
                      </span>
                    </div>

                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => handleView(resource.download)}
                        className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1 transition text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center bg-indigo-50 py-3 px-4 rounded-t-lg">
              <h3 className="text-lg font-semibold text-indigo-800">Upload New Resource</h3>
              <button onClick={closeUploadModal} className="text-gray-500 hover:text-gray-700" disabled={isUploading}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              {uploadError && (
                <div className="mb-4 bg-red-50 text-red-500 p-3 rounded-lg text-sm flex items-start">
                  <span className="flex-shrink-0 mr-2">⚠️</span>
                  <span>{uploadError}</span>
                </div>
              )}
              {uploadSuccess && (
                <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-start">
                  <span className="flex-shrink-0 mr-2">✅</span>
                  <span>{uploadSuccess}</span>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={uploadForm.title}
                    onChange={handleInputChange}
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter resource title"
                    disabled={isUploading}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={uploadForm.description}
                    onChange={handleInputChange}
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add a short description of your resource"
                    rows="3"
                    disabled={isUploading}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="file" className="block text-gray-700 text-sm font-bold mb-2">
                    Upload File <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-4 sm:px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file" className={`relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <span>Upload a file</span>
                          <input
                            id="file"
                            name="file"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            disabled={isUploading}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, CODE, ZIP up to 10MB</p>
                    </div>
                  </div>
                  {uploadForm.file && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected: <span className="font-medium">{uploadForm.file.name}</span> ({formatFileSize(uploadForm.file.size)})
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2 text-sm"
                    onClick={closeUploadModal}
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center text-sm ${isUploading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      'Upload Resource'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourcesTab;