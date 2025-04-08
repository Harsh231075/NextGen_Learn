import React, { useState } from 'react';
import { Upload, X, Hash, Info, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import axios from 'axios'; // Import Axios (you'll need to install it: npm install axios)

const CreateCommunity = ({ onGoBack }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false); // For potential loading state
  const [uploadError, setUploadError] = useState(''); // For potential error messages

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file); // Store the File object for potential FormData
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!communityName.trim() || !description.trim()) {
      setUploadError('Please fill in the community name and description.');
      return;
    }

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }
    formData.append('name', communityName);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags)); // Or you might handle tags differently on the backend

    const apiURL = `${import.meta.env.VITE_API_URL}/community/create`; // Replace with your actual API endpoint
    const authToken = localStorage.getItem('token'); // Replace with your actual auth token
    console.log(formData);
    try {
      const response = await axios.post(apiURL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
          'Authorization': `Bearer ${authToken}`, // Include your token
        },
      });

      console.log('Community created successfully:', response.data);
      // Optionally, redirect the user or show a success message
      setUploading(false);
      onGoBack(); // Go back to the community list after successful creation
    } catch (error) {
      console.error('Error creating community:', error);
      setUploadError('Failed to create community. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create New Community</h2>
              <button
                onClick={onGoBack}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Community Cover
                </label>
                <div className="relative">
                  {coverImage ? (
                    <div className="relative rounded-md overflow-hidden h-32 w-full object-cover border border-gray-200">
                      <img
                        src={typeof coverImage === 'string' ? coverImage : URL.createObjectURL(coverImage)}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setCoverImage(null)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="relative border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer bg-gray-50 hover:border-indigo-500 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-1 block w-full">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-1 text-sm text-gray-500">
                          Drag and drop an image here, or click to select
                        </p>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={handleCoverUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Community Name */}
              <div>
                <label htmlFor="communityName" className="block text-sm font-medium text-gray-700">
                  Community Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="communityName"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter community name"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="What's your community about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags (up to 5)
                </label>
                <div className="mt-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-700"
                      >
                        <Hash className="h-4 w-4 mr-1" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-1 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  {tags.length < 5 && (
                    <div className="relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Hash className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="tags"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Add tags (press Enter)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                      />
                    </div>
                  )}
                  {tags.length >= 5 && (
                    <p className="mt-1 text-sm text-gray-500">You have reached the maximum number of tags (5).</p>
                  )}
                </div>
              </div>

              {/* Guidelines Notice */}
              <div className="bg-indigo-50 rounded-md p-3 flex items-start gap-2">
                <Info className="text-indigo-500 h-5 w-5" />
                <p className="text-sm text-indigo-700">
                  Ensure your community follows our <a href="#" className="font-semibold underline">community guidelines</a>.
                </p>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {uploadError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
                  disabled={uploading}
                >
                  {uploading ? 'Creating...' : 'Create Community'}
                  {uploading && <svg className="animate-spin -ml-1 ml-3 h-5 w-5 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>}
                </button>
              </div>
            </form>
          </div>
          {/* Optional: Preview Section (for larger screens) */}
          <div className="hidden md:block md:w-64 bg-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Community Preview</h3>
            <div className="rounded-md overflow-hidden shadow-sm border border-gray-200">
              <div className="h-32 bg-gray-300 flex items-center justify-center text-gray-500">
                {coverImage ? (
                  <img
                    src={typeof coverImage === 'string' ? coverImage : URL.createObjectURL(coverImage)}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-16 w-16" />
                )}
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-gray-800">{communityName || 'Community Name'}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{description || 'A brief description of the community...'}</p>
                {tags.length > 0 && (
                  <div className="mt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 mr-1"
                      >
                        <Hash className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Add more preview elements if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;