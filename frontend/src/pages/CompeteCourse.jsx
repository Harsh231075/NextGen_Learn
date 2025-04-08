import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectDashboardData, fetchDashboardData } from '../redux/features/dashboardSlice';
import { useLocation } from 'react-router-dom';
import { Download, Award, Monitor, AlertCircle, Laptop } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CertificateDownload = () => {
  const dispatch = useDispatch();
  const dashboardData = useSelector(selectDashboardData);
  const location = useLocation();
  const courseDetails = location.state;
  const certificateRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    dispatch(fetchDashboardData());

    // Check if user is on desktop
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);

    // Cleanup
    return () => window.removeEventListener('resize', checkDevice);
  }, [dispatch]);

  const userName = dashboardData?.user?.name || "Student";
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const downloadCertificate = () => {
    if (!isDesktop) return;

    const certificateElement = certificateRef.current;

    if (certificateElement) {
      html2canvas(certificateElement, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: null
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`${userName}-${courseDetails?.study_topic || "Course"}-Certificate.pdf`);
      });
    }
  };

  if (!isDesktop) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Laptop size={60} className="text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Desktop Required</h2>
          <p className="mb-6 text-gray-600">
            Your certificate is available only on desktop devices. Please access this page from a computer or switch to desktop mode in your browser settings.
          </p>
          <div className="border-t border-gray-200 pt-6 mt-2">
            <div className="flex items-center justify-center gap-2 text-blue-700">
              <Monitor size={20} />
              <span className="font-medium">Access on Desktop for Best Experience</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl w-full mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-800">Course Certificate</h2>
        <button
          onClick={downloadCertificate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-all hover:shadow-lg text-lg"
        >
          <Download size={20} />
          Download Certificate
        </button>
      </div>

      {/* Certificate Preview */}
      <div className="w-full max-w-4xl bg-white p-4 rounded-xl shadow-xl">
        <div
          ref={certificateRef}
          className="relative w-full aspect-[1.414/1] bg-white p-8 rounded-lg border-8 border-blue-100 overflow-hidden"
          style={{ maxHeight: "550px" }}
        >
          {/* Certificate Background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 0 15 L 60 15 M 15 0 L 15 60" fill="none" stroke="#2563EB" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Certificate Border */}
          <div className="absolute inset-2 border-2 border-blue-200 rounded-lg pointer-events-none"></div>

          {/* Certificate Content */}
          <div className="flex flex-col h-full pt-6 relative z-10">
            {/* Header with Logo */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-blue-600 rounded-full p-3 shadow">
                <Award className="text-white h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold text-blue-800">NextGen Learn</h1>
            </div>

            {/* Certificate Title */}
            <div className="text-center mb-4">
              <p className="text-xl text-gray-600 font-serif">Certificate of Completion</p>
              <div className="w-48 h-1 bg-blue-500 mx-auto mt-1"></div>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 flex-grow">
              <p className="text-gray-600">This is to certify that</p>
              <h2 className="text-4xl font-bold text-blue-900 font-serif">{userName}</h2>
              <p className="text-gray-600">has successfully completed the course</p>
              <h3 className="text-2xl font-bold text-blue-800 font-serif">{courseDetails?.study_topic || "Web Development"}</h3>

              {/* Course Details */}
              <div className="flex justify-center gap-6 mt-6">
                <div className="px-4 py-2 text-sm">
                  <p className="font-medium text-blue-800">Difficulty</p>
                  <p className="text-gray-700">{courseDetails?.difficulty || "Intermediate"}</p>
                </div>
                <div className="px-4 py-2 text-sm border-l border-r border-gray-200">
                  <p className="font-medium text-blue-800">Duration</p>
                  <p className="text-gray-700">{courseDetails?.total_weeks || "10"} Weeks</p>
                </div>
                <div className="px-4 py-2 text-sm">
                  <p className="font-medium text-blue-800">Date</p>
                  <p className="text-gray-700">{currentDate}</p>
                </div>
              </div>
            </div>

            {/* Certificate Footer with Signature */}
            <div className="flex justify-between items-end pt-4 border-t border-blue-100">
              {/* Certificate ID */}
              <div className="text-xs text-gray-500 w-24">
                ID: NGN-{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </div>

              {/* Signature - Fixed width to prevent overflow */}
              <div className="text-center w-32 ">
                <svg width="80" height="30" viewBox="0 0 80 30">
                  <path
                    d="M5,15 C15,25 25,10 35,20 C45,25 55,10 75,15"
                    fill="none"
                    stroke="#1e40af"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="w-24 h-px bg-blue-300 mx-auto mb-1"></div>
                <p className="font-medium text-gray-800 text-xs">Harsh Singh Baghel</p>
                <p className="text-gray-600 text-xs">CEO, NextGen Learn</p>
              </div>

              {/* QR Code Placeholder */}
              <div className="opacity-80 w-24 flex justify-end">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" fill="#EFF6FF" />
                  <rect x="5" y="5" width="30" height="30" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
                  <rect x="10" y="10" width="7" height="7" fill="#3B82F6" />
                  <rect x="23" y="10" width="7" height="7" fill="#3B82F6" />
                  <rect x="10" y="23" width="7" height="7" fill="#3B82F6" />
                  <rect x="21" y="21" width="9" height="9" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-gray-600 text-center max-w-xl bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
        <p>This certificate verifies the completion of the {courseDetails?.study_topic || "Web Development"} course at NextGen Learn, showcasing your dedication and acquired skills.</p>
      </div>
    </div>
  );
};

export default CertificateDownload;