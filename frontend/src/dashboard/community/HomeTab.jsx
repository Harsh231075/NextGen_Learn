import React from 'react';
import { Download } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';

function HomeTab({ setActiveTab, posts, resources }) {
  console.log("Posts in HomeTab:", posts);

  return (
    <div>
      <section className="mb-12">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Welcome to DevCommunity</h2>
          <p className="text-xl mb-6">Connect with developers, find mentors, and share resources.</p>
          <div className="flex flex-wrap gap-4">
            <button
              className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition"
              onClick={() => setActiveTab('posts')}
            >
              Browse Posts
            </button>
            <button
              className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-800 transition"
              onClick={() => setActiveTab('mentorship')}
            >
              Find a Mentor
            </button>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Latest Posts</h3>
            <a href="#" className="text-indigo-600 hover:text-indigo-800" onClick={() => setActiveTab('posts')}>View all</a>
          </div>
          <div className="space-y-4">
            {posts && posts.slice(0, 2).map(post => (
              <div key={post._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                <div className="flex items-center mb-2">
                  {post.author?.photo && (
                    <img
                      src={post.author.photo}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                  )}
                  <h4 className="font-semibold text-lg">{post.title}</h4>
                </div>
                <p className="text-gray-600 text-sm mb-1">
                  by {post.author?.name || 'Unknown Author'} •{' '}
                  {post.createdAt && (
                    <span className="italic text-gray-500">
                      {formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                  )}
                </p>
                <p className="text-gray-700 mb-3">{post.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">❤️ {post.likes?.length || 0}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                </div>
                {post.fileUrl && (
                  <a href={post.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm mt-2">
                    <Download className="h-4 w-4 mr-1" />
                    View File
                  </a>
                )}
              </div>
            ))}
            {!posts && <p className="text-gray-500">No posts available.</p>}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Popular Resources</h3>
            <a href="#" className="text-indigo-600 hover:text-indigo-800" onClick={() => setActiveTab('resources')}>View all</a>
          </div>
          <div className="space-y-4">
            {resources.slice(0, 2).map(resource => (
              <div key={resource.id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{resource.title}</h4>
                    <p className="text-gray-500 text-sm mb-3">{resource.type} • {resource.size}</p>
                  </div>
                  <button className="bg-indigo-100 p-2 rounded-full text-indigo-600 hover:bg-indigo-200 transition">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">{resource.downloads} downloads</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomeTab;