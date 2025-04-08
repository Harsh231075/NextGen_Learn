import React, { useState } from 'react';
import { User, Award, Book, Code, Briefcase, Camera, Save, Edit, X, Plus, Calendar, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectDashboardData } from '../../redux/features/dashboardSlice';
import axios from "axios";

const ProfileSettings = () => {

  const dashboardData = useSelector(selectDashboardData);

  // Sample initial data (this would come from your backend)
  const [userData, setUserData] = useState({
    name: dashboardData?.user.name,
    photo: dashboardData?.user.photo,
    bio: dashboardData?.user?.bio || "Write your bio ",
    skills: dashboardData?.user?.skills || ["add skill", "add skill"],
    education: dashboardData?.user?.education || [
      { id: 1, degree: "Bachelor of Science", institute: "MIT", year: "2022" }
    ],
    certificates: dashboardData?.user?.certificates || [
      { id: 1, name: "AWS Certified Developer", issuer: "Amazon", year: "2023" },
      { id: 2, name: "React Advanced Concepts", issuer: "Meta", year: "2024" }
    ],
    projects: dashboardData?.user?.projects || [
      {
        id: 1,
        title: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform with React, Node.js and MongoDB",
        link: "https://github.com/johndoe/ecommerce"
      },
      {
        id: 2,
        title: "Task Management App",
        description: "Developed a task management application with drag and drop functionality",
        link: "https://github.com/johndoe/taskapp"
      }
    ]
  });

  const [editing, setEditing] = useState({
    profile: false,
    skills: false,
    education: false,
    certificates: false,
    projects: false
  });

  const [formData, setFormData] = useState({
    profile: { ...userData }
  });

  const toggleEdit = async (section) => {
    if (editing[section]) {
      // First update local state
      if (section === 'profile') {
        setUserData({ ...userData, ...formData.profile });
      }

      // Determine what data to send to the server
      let dataToUpdate;
      if (section === 'profile') {
        dataToUpdate = formData.profile;
      } else {
        dataToUpdate = userData[section];
      }

      const token = localStorage.getItem("token");

      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/update-profile`,
          {
            section,
            data: dataToUpdate,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ Updated successfully:", response.data);
      } catch (error) {
        console.error("❌ Failed to update:", error.response?.data || error.message);
      }
    } else if (section === 'profile') {
      // Only create form data for profile section
      setFormData({
        ...formData,
        profile: { ...userData }
      });
    }

    // Toggle editing state for the section
    setEditing({
      ...editing,
      [section]: !editing[section],
    });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        [name]: value
      }
    });
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim());
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        skills: skillsArray
      }
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          profile: {
            ...formData.profile,
            photo: event.target.result
          }
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Education Add
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institute: "",
    year: ""
  });

  const handleAddEducation = async () => {
    if (newEducation.degree && newEducation.institute) {
      const newEntry = {
        id: Date.now(), // Use timestamp for unique ID
        ...newEducation
      };

      // Update local state first
      const updatedEducation = [...userData.education, newEntry];
      setUserData({ ...userData, education: updatedEducation });

      // Reset the form
      setNewEducation({ degree: "", institute: "", year: "" });

      // Update on server
      const token = localStorage.getItem("token");
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/update-profile`,
          {
            section: 'education',
            data: updatedEducation,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ Updated education successfully");
      } catch (error) {
        console.error("❌ Failed to update education:", error.response?.data || error.message);
      }

      // Close the edit mode
      setEditing({
        ...editing,
        education: false
      });
    }
  };

  // Certificate Add
  const [newCertificate, setNewCertificate] = useState({
    name: "",
    issuer: "",
    year: ""
  });

  const handleAddCertificate = async () => {
    if (newCertificate.name && newCertificate.issuer) {
      const newEntry = {
        id: Date.now(), // Use timestamp for unique ID
        ...newCertificate
      };

      // Update local state first
      const updatedCertificates = [...userData.certificates, newEntry];
      setUserData({ ...userData, certificates: updatedCertificates });

      // Reset the form
      setNewCertificate({ name: "", issuer: "", year: "" });

      // Update on server
      const token = localStorage.getItem("token");
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/update-profile`,
          {
            section: 'certificates',
            data: updatedCertificates,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ Updated certificates successfully");
      } catch (error) {
        console.error("❌ Failed to update certificates:", error.response?.data || error.message);
      }

      // Close the edit mode
      setEditing({
        ...editing,
        certificates: false
      });
    }
  };

  // Project Add
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    link: ""
  });

  const handleAddProject = async () => {
    if (newProject.title && newProject.description) {
      const newEntry = {
        id: Date.now(), // Use timestamp for unique ID
        ...newProject
      };

      // Update local state first
      const updatedProjects = [...userData.projects, newEntry];
      setUserData({ ...userData, projects: updatedProjects });

      // Reset the form
      setNewProject({ title: "", description: "", link: "" });

      // Update on server
      const token = localStorage.getItem("token");
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/update-profile`,
          {
            section: 'projects',
            data: updatedProjects,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ Updated projects successfully");
      } catch (error) {
        console.error("❌ Failed to update projects:", error.response?.data || error.message);
      }

      // Close the edit mode
      setEditing({
        ...editing,
        projects: false
      });
    }
  };

  // Delete item
  const handleDelete = async (section, id) => {
    // Update local state first
    const updatedItems = userData[section].filter(item => item.id !== id);
    setUserData({ ...userData, [section]: updatedItems });

    // Update on server
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/update-profile`,
        {
          section,
          data: updatedItems,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`✅ Updated ${section} successfully after deletion`);
    } catch (error) {
      console.error(`❌ Failed to update ${section} after deletion:`, error.response?.data || error.message);
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen">

      <main className="max-w-6xl mx-auto p-6">
        {/* Profile Section */}
        <section className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-sm border border-blue-100/30 p-6 sm:p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2.5 rounded-xl">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Profile Information
              </h2>
            </div>
            <button
              onClick={() => toggleEdit('profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 group"
            >
              {editing.profile ? (
                <>
                  <Save className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-600">Save Changes</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                  <span className="font-medium text-gray-600 group-hover:text-blue-600">Edit Profile</span>
                </>
              )}
            </button>
          </div>

          {editing.profile ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <img
                      src={formData.profile.photo || "/api/placeholder/150/150"}
                      alt="Profile"
                      className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-md group-hover:shadow-xl transition-all duration-300"
                    />
                    <label className="cursor-pointer absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.profile.name}
                    onChange={handleProfileChange}
                    className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.profile.bio}
                    onChange={handleProfileChange}
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Skills</label>
                  <input
                    type="text"
                    value={formData.profile.skills.join(', ')}
                    onChange={handleSkillsChange}
                    className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="React, TypeScript, Node.js..."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <img
                  src={userData.photo || "/api/placeholder/150/150"}
                  alt="Profile"
                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-lg"
                />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{userData.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{userData.bio}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-xl bg-blue-100/50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Education Section */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Book className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Education</h2>
            </div>
            <button
              onClick={() => toggleEdit('education')}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
            >
              {editing.education ? (
                <>
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  <span>Add New</span>
                </>
              )}
            </button>
          </div>

          {editing.education ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree / Course
                  </label>
                  <input
                    type="text"
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute
                  </label>
                  <input
                    type="text"
                    value={newEducation.institute}
                    onChange={(e) => setNewEducation({ ...newEducation, institute: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={newEducation.year}
                    onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 p-2"
                  />
                </div>
              </div>
              <button
                onClick={handleAddEducation}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Add Education
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userData.education.map((edu) => (
                <div key={edu.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institute}</p>
                      <p className="text-gray-500 text-sm">{edu.year}</p>
                    </div>
                    <button
                      onClick={() => handleDelete('education', edu.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {userData.education.length === 0 && (
                <p className="text-gray-500 italic">No education details added yet.</p>
              )}
            </div>
          )}
        </section>

        {/* Certificates Section */}
        <section className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-sm border border-blue-100/30 p-6 sm:p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2.5 rounded-xl">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Certificates
              </h2>
            </div>
            <button
              onClick={() => toggleEdit('certificates')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 group"
            >
              {editing.certificates ? (
                <>
                  <X className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-red-500">Cancel</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-600">Add Certificate</span>
                </>
              )}
            </button>
          </div>

          {editing.certificates ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Certificate Name
                  </label>
                  <input
                    type="text"
                    value={newCertificate.name}
                    onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter certificate name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    value={newCertificate.issuer}
                    onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter organization name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <input
                    type="text"
                    value={newCertificate.year}
                    onChange={(e) => setNewCertificate({ ...newCertificate, year: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter year"
                  />
                </div>
              </div>
              <button
                onClick={handleAddCertificate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Add Certificate
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                          <p className="text-gray-600">{cert.issuer}</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <p className="text-gray-500 text-sm">{cert.year}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete('certificates', cert.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-full text-red-500 hover:text-red-600 transition-all duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {userData.certificates.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <Award className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No certificates added yet.</p>
                  <p className="text-sm text-gray-400">Click 'Add Certificate' to get started</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Projects Section */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Projects</h2>
            </div>
            <button
              onClick={() => toggleEdit('projects')}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
            >
              {editing.projects ? (
                <>
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  <span>Add New</span>
                </>
              )}
            </button>
          </div>

          {editing.projects ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Link
                </label>
                <input
                  type="text"
                  value={newProject.link}
                  onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 p-2"
                  placeholder="https://github.com/username/project"
                />
              </div>
              <button
                onClick={handleAddProject}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Add Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData.projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4 relative">
                  <button
                    onClick={() => handleDelete('projects', project.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <h3 className="font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm flex items-center gap-1"
                    >
                      <Briefcase className="h-4 w-4" />
                      View Project
                    </a>
                  )}
                </div>
              ))}
              {userData.projects.length === 0 && (
                <p className="text-gray-500 italic">No projects added yet.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProfileSettings;