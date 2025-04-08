import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";

export default function SelectedCourse() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPath = location.state?.selectedPath || "No selection found";

  const [formData, setFormData] = useState({
    experience: "",
    timeCommitment: "",
    learningStyle: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ Already loading? Prevent duplicate call
    if (loading) return;

    setLoading(true);

    const role = "study_plan"; // Assuming this should map to promptType

    const requestData = {
      role: "study", // Or whatever the backend truly expects for 'role'
      promptType: role,
      variables: {
        course: selectedPath, // Assuming selectedPath is the course name
        week: formData.timeCommitment, // Mapping timeCommitment to week
        level: formData.experience, // Mapping experience to level
      },
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/study`,
        requestData, // Sending the structured data
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      setMessage("🎉 Your study plan is ready! Visit the Study Plan section and start your learning journey! 🚀");
    } catch (error) {
      console.error("Error fetching study plan:", error);
      setMessage("❌ Sorry! We couldn't generate your study plan. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">📚 {selectedPath}</h1>

        {message ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg text-gray-800 font-medium">{message}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Experience Level */}
            <div>
              <label className="block text-gray-700 font-medium">Experience Level</label>
              <select name="experience" onChange={handleChange} required className="w-full border p-3 rounded-lg">
                <option value="">Select Experience Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Time Commitment */}
            <div>
              <label className="block text-gray-700 font-medium">Time Commitment</label>
              <select name="timeCommitment" onChange={handleChange} required className="w-full border p-3 rounded-lg">
                <option value="">Select Time Commitment</option>
                <option value="1-2 hours/week">1-2 hours/week</option>
                <option value="3-5 hours/week">3-5 hours/week</option>
                <option value="5-10 hours/week">5-10 hours/week</option>
              </select>
            </div>

            {/* Learning Style */}
            <div>
              <label className="block text-gray-700 font-medium">Preferred Learning Style</label>
              <select name="learningStyle" onChange={handleChange} required className="w-full border p-3 rounded-lg">
                <option value="">Select Learning Style</option>
                <option value="Hands-on Projects">Hands-on Projects</option>
                <option value="Videos">Videos</option>
                <option value="Books & Articles">Books & Articles</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Generating Study Plan...
                </>
              ) : (
                "Generate Study Plan"
              )}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
