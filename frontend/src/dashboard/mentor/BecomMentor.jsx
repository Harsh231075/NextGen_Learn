import React from 'react'

export default function BecomMentor({ onGoBack }) {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Find a Mentor</h2>
      {/* Add your content for finding a mentor here */}
      <p className="mb-4">Browse experienced developers and find the right mentor for your needs.</p>
      <button onClick={onGoBack} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-all">
        Back to Community
      </button>
    </div>
  )
}
