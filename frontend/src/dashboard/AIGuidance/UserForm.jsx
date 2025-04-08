import React, { useState } from "react";
import axios from "axios";
import { CheckCircle, Loader2 } from "lucide-react";

export default function UserForm() {
  const [formData, setFormData] = useState({
    studyTopic: "",
    experience: "",
    timeCommitment: "",
    learningStyle: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsSuccess(false);
    setMessage("");

    const requestData = {
      role: "study", // Or whatever the backend truly expects for 'role'
      promptType: "study_plan",
      variables: {
        course: formData.studyTopic,
        week: formData.timeCommitment,
        level: formData.experience,
      },
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/study`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setMessage("🎉 Your study plan is ready! Visit the Study Plan section and start your learning journey! 🚀");
      setIsSuccess(true);
    } catch (error) {
      console.error("Error fetching study plan:", error);
      setMessage("❌ Sorry! We couldn't generate your study plan. Please try again later.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Create Your Study Plan
      </h2>
      {message ? (
        <div className="text-center space-y-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
            {isSuccess ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.932 3.374h14.74c1.715 0 2.802-1.874 1.932-3.374M12 3v1.5m0 12.75v1.5m-4.5-15h9m-9 2.25h.015m8.985 0h.015M5.25 21h13.5" />
              </svg>
            )}
          </div>
          <p className={`text-md font-medium ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
          {isSuccess && (
            <p className="text-sm text-gray-600">
              Find your generated plan in the "Study Plan" section.
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div>
            <label htmlFor="studyTopic" className="block text-gray-700 text-sm font-bold mb-1">
              What to learn?
            </label>
            <input
              type="text"
              id="studyTopic"
              name="studyTopic"
              placeholder="e.g., React, Data Science"
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
            />
          </div>
          <div>
            <label htmlFor="experience" className="block text-gray-700 text-sm font-bold mb-1">
              Experience
            </label>
            <select
              id="experience"
              name="experience"
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
            >
              <option value="">Select</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label htmlFor="timeCommitment" className="block text-gray-700 text-sm font-bold mb-1">
              Time Commitment
            </label>
            <select
              id="timeCommitment"
              name="timeCommitment"
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
            >
              <option value="">Select</option>
              <option value="1-2 hours/week">1-2 hours/week</option>
              <option value="3-5 hours/week">3-5 hours/week</option>
              <option value="5-10 hours/week">5-10 hours/week</option>
            </select>
          </div>
          <div>
            <label htmlFor="learningStyle" className="block text-gray-700 text-sm font-bold mb-1">
              Learning Style
            </label>
            <select
              id="learningStyle"
              name="learningStyle"
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
            >
              <option value="">Select</option>
              <option value="Hands-on Projects">Hands-on Projects</option>
              <option value="Videos">Videos</option>
              <option value="Books & Articles">Books & Articles</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Generating...
              </div>
            ) : (
              "Get Plan"
            )}
          </button>
        </form>
      )}
    </div>
  );
}