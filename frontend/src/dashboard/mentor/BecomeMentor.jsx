import React, { useState } from 'react';
import { ArrowLeft, Check, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BecomeMentor({ onBack }) {
  const [formData, setFormData] = useState({
    selectedCourse: '',
    knowledgeLevel: '',
    experience: '',
    practicalExperience: '',
    strengthAreas: '',
    weaknessAreas: '',
    learningApproach: '',
    timeCommitment: '',
    futureGoals: '',
    agreeToTerms: false
  });
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [showWarning, setShowWarning] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  const [submissionError, setSubmissionError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state
    setSubmissionError(null);

    const token = localStorage.getItem('token');
    const dataToSend = {
      role: "mentor_test", // Changed to mentor_test as requested
      promptType: "mentor_test",
      variables: {
        test: formData,
      }
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/study`, // Corrected route
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Assessment data submitted:', response);
      navigate("/mentor-test", { state: response.data.finalresponse });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setSubmissionError(error.message || "An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const renderWarningMessage = () => (
    <div className={`bg-amber-50 border-l-4 border-amber-500 p-5 rounded-lg mb-6 transition-all ${showWarning ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
      <div className="flex items-start">
        <AlertTriangle className="text-amber-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-bold text-amber-800 mb-1">Important Notice</h3>
          <p className="text-amber-700">
            Please fill in all details accurately and thoroughly. Your responses will be used to assess your knowledge level and will affect your test evaluation. Taking time to provide detailed answers will help us better understand your expertise.
          </p>
          <button
            onClick={() => setShowWarning(false)}
            className="mt-2 text-amber-700 text-sm font-medium hover:text-amber-900 underline"
          >
            I understand, don't show again
          </button>
        </div>
      </div>
    </div>
  );

  const renderStepOne = () => (
    <>
      {renderWarningMessage()}

      <div className="mb-6">
        <label htmlFor="selectedCourse" className="block text-gray-700 font-semibold mb-2">Which course are you enrolling for?</label>
        <input
          type="text"
          id="selectedCourse"
          name="selectedCourse"
          value={formData.selectedCourse}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Enter your course name"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="knowledgeLevel" className="block text-gray-700 font-semibold mb-2">How would you rate your current knowledge in this subject?</label>
        <select
          id="knowledgeLevel"
          name="knowledgeLevel"
          value={formData.knowledgeLevel}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          required
        >
          <option value="">Select knowledge level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="experience" className="block text-gray-700 font-semibold mb-2">How much experience do you have in this field?</label>
        <select
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          required
        >
          <option value="">Select experience level</option>
          <option value="0-1 year">0-1 year</option>
          <option value="1-3 years">1-3 years</option>
          <option value="3-5 years">3-5 years</option>
          <option value="5+ years">5+ years</option>
        </select>
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      <div className="mb-6">
        <label htmlFor="practicalExperience" className="block text-gray-700 font-semibold mb-2">Describe your practical experience in this field</label>
        <textarea
          id="practicalExperience"
          name="practicalExperience"
          value={formData.practicalExperience}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Projects you've completed, work experience, self-learning activities, etc."
          required
        ></textarea>
      </div>

      <div className="mb-6">
        <label htmlFor="strengthAreas" className="block text-gray-700 font-semibold mb-2">What specific areas in this field are you strongest in?</label>
        <textarea
          id="strengthAreas"
          name="strengthAreas"
          value={formData.strengthAreas}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="List specific technologies, concepts, or skills you excel at"
          required
        ></textarea>
      </div>

      <div className="mb-6">
        <label htmlFor="weaknessAreas" className="block text-gray-700 font-semibold mb-2">What areas do you think you need improvement in?</label>
        <textarea
          id="weaknessAreas"
          name="weaknessAreas"
          value={formData.weaknessAreas}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Areas where you'd like to improve your knowledge"
          required
        ></textarea>
      </div>
    </>
  );

  const renderStepThree = () => (
    <>
      <div className="mb-6">
        <label htmlFor="learningApproach" className="block text-gray-700 font-semibold mb-2">How do you approach learning new concepts?</label>
        <textarea
          id="learningApproach"
          name="learningApproach"
          value={formData.learningApproach}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Describe your learning style and methods"
          required
        ></textarea>
      </div>

      <div className="mb-6">
        <label htmlFor="timeCommitment" className="block text-gray-700 font-semibold mb-2">How much time can you commit to this course weekly?</label>
        <input
          type="text"
          id="timeCommitment"
          name="timeCommitment"
          value={formData.timeCommitment}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Describe your weekly time commitment"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="futureGoals" className="block text-gray-700 font-semibold mb-2">What are your goals after completing this course?</label>
        <textarea
          id="futureGoals"
          name="futureGoals"
          value={formData.futureGoals}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Career advancement, personal projects, further education, etc."
          required
        ></textarea>
      </div>

      <div className="mb-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              required
            />
          </div>
          <label htmlFor="agreeToTerms" className="ml-3 text-gray-700">
            I confirm that all information provided is accurate and understand this will be used for test evaluation purposes.
          </label>
        </div>
      </div>
    </>
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <button
        onClick={onBack}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Course Knowledge Assessment</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Help us understand your current knowledge and experience level to personalize your learning journey.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5 md:p-8 border border-gray-100">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex flex-col items-center ${step >= stepNumber - 1 ? 'text-indigo-600' : 'text-gray-400'}`}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 transition-all ${step > stepNumber - 1
                  ? 'bg-indigo-100 text-indigo-600'
                  : step === stepNumber - 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-400'
                  }`}>
                  {step > stepNumber - 1 ? <Check size={16} /> : stepNumber}
                </div>
                <span className={`text-xs md:text-sm ${step >= stepNumber - 1 ? 'font-medium' : ''}`}>
                  {stepNumber === 1 ? 'Basic Info' : stepNumber === 2 ? 'Experience' : 'Learning Style'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 0 && renderStepOne()}
          {step === 1 && renderStepTwo()}
          {step === 2 && renderStepThree()}

          {submissionError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{submissionError}</span>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 md:px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Previous
              </button>
            )}

            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className={`ml-auto px-4 md:px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg shadow-sm text-sm font-medium text-white hover:from-indigo-700 hover:to-indigo-800 transition-all`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`ml-auto px-4 md:px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm text-sm font-medium text-white hover:from-green-600 hover:to-emerald-700 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Assessment"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default BecomeMentor;

