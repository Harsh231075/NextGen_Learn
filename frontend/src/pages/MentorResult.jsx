import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MentorResult() {
  const location = useLocation();
  const [processedData, setProcessedData] = useState({
    status: "fail",
    message: "Your responses need improvement. Focus on expanding your answers and providing more detail, real-world examples, and thorough explanations. Revisit core concepts like SOLID principles, design patterns, debugging techniques, and communication strategies for technical concepts.",
    mcqAnalysis: [],
    writtenAnalysis: []
  });

  useEffect(() => {
    if (location.state) {
      try {
        // Check if the response is already an object
        if (typeof location.state === 'object') {
          setProcessedData(location.state);
        } else {
          // If it's a string, try to parse it
          let rawData = location.state;
          console.log("data =>", rawData);
          // Remove code block markers if present
          const cleanedText = rawData.replace(/```json|```/g, "").trim();

          // Parse the JSON
          const parsedData = JSON.parse(cleanedText);
          console.log(parsedData);
          setProcessedData(parsedData);
        }
      } catch (error) {
        console.error("Error parsing result data:", error);
        // Keep default state in case of error
      }
    }
  }, [location.state]);

  const isPassed = processedData.status === "pass";

  // Calculate statistics
  const mcqData = processedData.mcqAnalysis || [];
  const writtenData = processedData.writtenAnalysis || [];

  const totalMCQs = mcqData.length;
  const correctMCQs = mcqData.filter(item => item.isCorrect).length;
  const mcqPercentage = totalMCQs > 0 ? Math.round((correctMCQs / totalMCQs) * 100) : 0;

  const totalWritten = writtenData.length;
  const avgWrittenScore = totalWritten > 0
    ? Math.round(writtenData.reduce((sum, item) => sum + (item.score || 0), 0) / totalWritten)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Result Header */}
        <div className={`rounded-lg shadow-lg p-6 mb-8 ${isPassed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Assessment Results</h1>
            <div className={`text-lg font-bold px-4 py-1 rounded-full ${isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isPassed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
            </div>
          </div>

          {isPassed ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">Congratulations!</h2>
              <p className="text-lg">You've successfully passed the assessment. Great job demonstrating your technical skills and knowledge!</p>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-4">{processedData.message}</p>
              <div className="bg-white p-4 rounded-md border border-red-100">
                <h3 className="font-semibold mb-2">Key Areas for Improvement:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Provide more detailed explanations with specific examples</li>
                  <li>Review fundamental concepts like SOLID principles and design patterns</li>
                  <li>Practice explaining technical concepts clearly</li>
                  <li>Work on debugging approaches for distributed systems</li>
                  <li>Develop stronger communication strategies for technical topics</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">MCQ Performance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p>Correct Answers: <span className="font-semibold">{correctMCQs}/{totalMCQs}</span></p>
                <p className="text-sm text-gray-500 mt-1">Target: 70% or higher</p>
              </div>
              <div className="w-24 h-24 relative rounded-full flex items-center justify-center bg-gray-100">
                <div className="absolute text-xl font-bold">{mcqPercentage}%</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Written Assessment</h2>
            <div className="flex items-center justify-between">
              <div>
                <p>Average Score: <span className="font-semibold">{avgWrittenScore}/10</span></p>
                <p className="text-sm text-gray-500 mt-1">Target: 7 or higher</p>
              </div>
              <div className="w-24 h-24 relative rounded-full flex items-center justify-center bg-gray-100">
                <div className="absolute text-xl font-bold">{avgWrittenScore}/10</div>
              </div>
            </div>
          </div>
        </div>

        {/* MCQ Analysis */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Multiple Choice Questions</h2>
          </div>
          <div className="p-4">
            {mcqData.length > 0 ? (
              <div className="divide-y">
                {mcqData.map((item, index) => (
                  <div key={index} className="py-4">
                    <div className="flex items-start">
                      <div className={`mt-1 mr-3 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${item.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{item.question}</p>
                        <div className="mt-2 text-sm">
                          <p>Your answer: <span className={item.isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{item.selectedAnswer}</span></p>
                          {!item.isCorrect && <p className="text-gray-800">Correct answer: <span className="text-green-600 font-medium">{item.correctAnswer}</span></p>}
                        </div>
                        {item.feedback && <p className="mt-2 text-sm text-gray-600">{item.feedback}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-4 text-center">No MCQ data available</p>
            )}
          </div>
        </div>

        {/* Written Analysis */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Written Assessment</h2>
          </div>
          <div className="p-4">
            {writtenData.length > 0 ? (
              <div className="divide-y">
                {writtenData.map((item, index) => (
                  <div key={index} className="py-4">
                    <h3 className="font-medium mb-2">{item.question}</h3>
                    <div className="bg-gray-50 p-3 rounded mb-3 text-gray-700">
                      <p>Your answer: "{item.answer}"</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Score: {item.score}/10</span>
                      <span className={`text-sm px-2 py-1 rounded ${item.evaluation === "needs improvement" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {item.evaluation}
                      </span>
                    </div>
                    {item.feedback && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="font-medium">Feedback:</p>
                        <p>{item.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-4 text-center">No written assessment data available</p>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>

          {isPassed ? (
            <div>
              <p className="mb-4">You've demonstrated a strong understanding of the required concepts! Here's what you can do next:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Schedule your follow-up interview with the hiring manager</li>
                <li>Review our company documentation to prepare for the next steps</li>
                <li>Consider exploring advanced topics in your areas of expertise</li>
                <li>Prepare questions for your upcoming interviews</li>
              </ul>
            </div>
          ) : (
            <div>
              <p className="mb-4">Here are some resources to help you improve:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Review SOLID principles and design patterns documentation</li>
                <li>Practice explaining technical concepts to non-technical audiences</li>
                <li>Work through debugging exercises for distributed systems</li>
                <li>Study effective communication strategies for technical content</li>
                <li>Consider retaking the assessment in 30 days</li>
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Link to='/dashboard' className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}