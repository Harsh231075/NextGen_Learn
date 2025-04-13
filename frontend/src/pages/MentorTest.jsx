import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MentorTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for MCQ answers
  const [mcqAnswers, setMcqAnswers] = useState([]);

  // State for written answers
  const [writtenAnswers, setWrittenAnswers] = useState([]);

  // State for current section (mcq or written)
  const [activeSection, setActiveSection] = useState('mcq');

  // State for tracking if test is submitted for review
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State to track if test is confirmed and submitted to API
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Process incoming data from location.state
  useEffect(() => {
    try {
      let processedDataa = location.state;
      // If data is a string (possibly a JSON string), parse it
      if (typeof processedDataa === 'string') {
        try {
          const cleanedText = processedDataa.replace(/```json|```/g, "").trim();
          const processedData = JSON.parse(cleanedText);
          console.log(processedData);
          setMcqAnswers(Array(processedData.mentor_test.mcq.length).fill(''));
          setWrittenAnswers(Array(processedData.mentor_test.written.length).fill(''));
          setTestData(processedData);
        } catch (e) {
          console.error("Failed to parse JSON string:", e);
          setError("Invalid data format");
          setLoading(false);
          return;
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error processing test data:", error);
      setError("Failed to process test data");
      setLoading(false);
    }
  }, [location.state]);

  // Handle MCQ option selection
  const handleMcqSelection = (questionIndex, option) => {
    const newAnswers = [...mcqAnswers];
    newAnswers[questionIndex] = option;
    setMcqAnswers(newAnswers);
  };

  // Handle written answer changes
  const handleWrittenChange = (questionIndex, value) => {
    const newAnswers = [...writtenAnswers];
    newAnswers[questionIndex] = value;
    setWrittenAnswers(newAnswers);
  };

  // Switch between MCQ and written sections
  const switchSection = (section) => {
    setActiveSection(section);
  };

  // Handle test submission for review
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  // Handle final confirmation and API call
  const handleConfirm = async () => {
    // Create formatted data for backend
    const submissionData = {
      mcq: testData.mentor_test.mcq.map((question, index) => ({
        question: question.question,
        Answer: mcqAnswers[index],
      })),
      written: testData.mentor_test.written.map((question, index) => ({
        question: question.question,
        answer: writtenAnswers[index]
      }))
    };

    console.log('Submitting test data:', JSON.stringify(submissionData, null, 2));
    const dataToSend = {
      role: "mentor_test_check",
      promptType: "mentor_test_check",
      variables: {
        mentor_test: submissionData,
      }
    };

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/study`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log(response.data.finalresponse);

      // Navigate to the result page with the response data
      navigate("/mentor-result", { state: response.data.finalresponse });

    } catch (error) {
      console.error('Error submitting assessment:', error);
      setError('Failed to submit assessment. Please try again.');
      // Keep the review view open but show error
      setIsConfirmed(false);
    }

    // Set test to confirmed state
    setIsConfirmed(true);
  };

  // Handle cancel and return to editing
  const handleCancel = () => {
    setIsSubmitted(false);
  };

  // Calculate progress
  const calculateProgress = () => {
    if (!testData) return 0;

    let answeredMcq = mcqAnswers.filter(answer => answer !== '').length;
    let answeredWritten = writtenAnswers.filter(answer => answer !== '').length;

    let totalQuestions = testData.mentor_test.mcq.length + testData.mentor_test.written.length;
    let percentComplete = Math.floor(((answeredMcq + answeredWritten) / totalQuestions) * 100);

    return percentComplete;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto mb-4"></div>
          <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading test...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Test</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <p className="text-gray-600">Please try again or contact support.</p>
      </div>
    );
  }

  // Ensure testData is available
  if (!testData) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-yellow-50 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-yellow-600 mb-2">No Test Data Available</h2>
        <p className="text-gray-700">There was a problem loading the test data.</p>
      </div>
    );
  }

  // Render submission review (before API call)
  if (isSubmitted && !isConfirmed) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Review Your Answers</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">MCQ Responses</h2>
          {testData.mentor_test.mcq.map((question, index) => (
            <div key={`mcq-${index}`} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{index + 1}. {question.question}</p>
              <p className="mt-2">
                <strong>Your answer:</strong> {mcqAnswers[index] || 'Not answered'}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Written Responses</h2>
          {testData.mentor_test.written.map((question, index) => (
            <div key={`written-${index}`} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{index + 1}. {question.question}</p>
              <div className="mt-2">
                <strong>Your answer:</strong>
                <p className="whitespace-pre-wrap mt-1 text-gray-700">{writtenAnswers[index] || 'Not answered'}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleCancel}
            className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Edit
          </button>

          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
          >
            Confirm & Submit
          </button>
        </div>
      </div>
    );
  }

  // Show loading while API call is in progress
  if (isConfirmed) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto mb-4"></div>
          <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
        </div>
        <p className="mt-4 text-gray-600">Submitting your test results...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2 text-center">Knowledge Assessment</h1>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1 text-right">{calculateProgress()}% Complete</p>
      </div>

      {/* Section tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => switchSection('mcq')}
          className={`py-2 px-4 font-medium ${activeSection === 'mcq'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Multiple Choice Questions
        </button>
        <button
          onClick={() => switchSection('written')}
          className={`py-2 px-4 font-medium ${activeSection === 'written'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Written Questions
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* MCQ Section */}
        {activeSection === 'mcq' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Multiple Choice Questions</h2>
            {testData.mentor_test.mcq.map((question, questionIndex) => (
              <div key={`mcq-${questionIndex}`} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium mb-3">{questionIndex + 1}. {question.question}</p>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={`option-${questionIndex}-${optionIndex}`}
                      className="flex items-start p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        checked={mcqAnswers[questionIndex] === option}
                        onChange={() => handleMcqSelection(questionIndex, option)}
                        className="mt-1 mr-2"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Written Section */}
        {activeSection === 'written' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Written Questions</h2>
            {testData.mentor_test.written.map((question, questionIndex) => (
              <div key={`written-${questionIndex}`} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium mb-3">{questionIndex + 1}. {question.question}</p>
                <textarea
                  value={writtenAnswers[questionIndex]}
                  onChange={(e) => handleWrittenChange(questionIndex, e.target.value)}
                  rows="6"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  placeholder="Type your answer here..."
                ></textarea>
              </div>
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {activeSection === 'written' && (
            <button
              type="button"
              onClick={() => switchSection('mcq')}
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Previous: MCQ Section
            </button>
          )}

          {activeSection === 'mcq' && (
            <div className="ml-auto">
              <button
                type="button"
                onClick={() => switchSection('written')}
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Next: Written Section
              </button>
            </div>
          )}

          {activeSection === 'written' && (
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Review Answers
            </button>
          )}
        </div>
      </form>
    </div>
  );
}