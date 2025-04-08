import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BarChart,
  Trophy,
  Target,
  TrendingUp,
  Award,
  ShieldCheck,
  Users,
  CheckCircle,
  Circle,
  GraduationCap,
  Brain,
  Timer,
  CircleX,
  Star,
} from 'lucide-react';
import {
  fetchDashboardData,
  selectDashboardData,
  selectDashboardLoading,
  selectDashboardError
} from '../../redux/features/dashboardSlice';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchRegisteredCourses } from '../../redux/features/coursesSlice';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Top Stats Card Component
const TopStatCard = ({ icon, label, value, trend }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
    <div className="p-2 rounded-lg bg-blue-50">{icon}</div>
    <div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
    </div>
    {trend && (
      <span className="ml-auto text-sm font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
        {trend}
      </span>
    )}
  </div>
);

// Stats Box Component for the three main metric sections
const StatsBox = ({ icon, title, stats, bgColor = "from-white to-gray-50", textColor = "text-gray-800" }) => (
  <div className={`bg-gradient-to-br ${bgColor} rounded-2xl shadow-lg p-6 h-full flex flex-col`}>
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-3 rounded-xl ${bgColor === "from-white to-gray-50" ? "bg-blue-50" : "bg-white/10"}`}>
        {icon}
      </div>
      <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
    </div>
    <div className="grid grid-cols-1 gap-6 flex-grow">
      {stats.map((stat, index) => (
        <div key={index} className={`${bgColor === "from-white to-gray-50" ? "bg-white" : "bg-white/10 backdrop-blur"} rounded-xl p-4 shadow-sm hover:shadow-md transition-all`}>
          <div className="flex items-center gap-3 mb-2">
            {stat.icon}
            <div className={`text-sm font-medium ${textColor}`}>{stat.label}</div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${textColor}`}>{stat.value}</span>
            {stat.trend && (
              <span className="text-sm font-medium text-green-500 bg-green-50 px-3 py-1 rounded-full">
                {stat.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Progress Bar Component
const ProgressBar = ({ value, max, color = "bg-blue-500" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Simple Dashboard Header Component
const SimpleDashboardHeader = ({ userData }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 sm:p-6 rounded-xl shadow-lg mb-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* User Info Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={userData?.photo || '/default-avatar.png'}
              alt={userData?.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/30 object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold">
              Welcome back, {userData?.name || 'User'}! 👋
            </h1>
            <p className="text-sm text-white/80">Let's continue your learning journey</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-300" />
            <div>
              <p className="text-xs text-white/80">Points</p>
              <p className="font-semibold">{userData?.points + userData?.referralPoint || 0}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-300" />
            <div>
              <p className="text-xs text-white/80">Referrals</p>
              <p className="font-semibold">{userData?.referralNumber || 0}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-2 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-300" />
            <div>
              <p className="text-xs text-white/80">Level</p>
              <p className="font-semibold">15</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerformanceOverview = () => {
  const dispatch = useDispatch();
  const dashboardData = useSelector(selectDashboardData);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  // Fetch dashboard data when component mounts
  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchRegisteredCourses());
  }, [dispatch]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error loading dashboard data: {error}
        </div>
      </div>
    );
  }

  // Calculate quiz success rate safely
  const totalQuizAnswers = (dashboardData?.quizPerformance?.correctAnswers || 0) +
    (dashboardData?.quizPerformance?.wrongAnswers || 0);
  const successRate = totalQuizAnswers > 0
    ? Math.round((dashboardData?.quizPerformance?.correctAnswers || 0) / totalQuizAnswers * 100)
    : 0;

  // Extract all the quiz and learning metrics we need for the dashboard
  const correctAnswers = dashboardData?.quizPerformance?.correctAnswers || 0;
  const wrongAnswers = dashboardData?.quizPerformance?.wrongAnswers || 0;
  const quizzesTaken = dashboardData?.quizPerformance?.quizzesTaken || 0;
  const completedCourses = dashboardData?.learningProgress?.completedCourses || 0;
  const ongoingCourses = dashboardData?.learningProgress?.ongoingTopics || 0;
  const totalCourses = dashboardData?.learningProgress?.totalCoursesCount || 0;
  const totalQuestions = dashboardData?.quizPerformance?.totalQuestions || 0;

  // Top Stats data
  const topStats = [
    {
      icon: <GraduationCap className="h-5 w-5 text-blue-500" />,
      label: "Total Courses",
      value: totalCourses,
    },
    {
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      label: "Success Rate",
      value: `${successRate}%`,
    },
    {
      icon: <Timer className="h-5 w-5 text-green-500" />,
      label: "Test Taken",
      value: quizzesTaken,
    },
    {
      icon: <Award className="h-5 w-5 text-yellow-500" />,
      label: "Total Quize",
      value: totalQuestions,
    },
  ];

  // Learning Goals data
  const goals = [
    { title: 'Complete Advanced React', progress: 75, deadline: '2 days left' },
    { title: 'Master TypeScript', progress: 45, deadline: '1 week left' },
    { title: 'Build Portfolio Project', progress: 60, deadline: '5 days left' }
  ];

  // Learning Progress Stats
  const learningProgressStats = [
    {
      label: 'Completed Courses',
      value: completedCourses,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      label: 'In Progress',
      value: ongoingCourses,
      icon: <Circle className="h-5 w-5 text-blue-500" />,
      trend: 'Active'
    },
  ];

  // Quiz Performance Stats
  const quizStats = [
    {
      label: 'Correct Answers',
      value: correctAnswers,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      label: 'Wrong Answers',
      value: wrongAnswers,
      icon: <CircleX className="h-5 w-5 text-red-500" />,
    },
  ];

  // Profile Stats
  const profileStats = [
    {
      label: 'Current Level',
      value: dashboardData?.user?.level || '15',
      icon: <ShieldCheck className="h-5 w-5 text-white" />,
    },
    {
      label: 'Global Rank',
      value: dashboardData?.user?.rank || 'N/A',
      icon: <Users className="h-5 w-5 text-white" />,
    },
  ];

  // Create normalized data for the chart to maintain consistent visual proportions
  // This ensures the chart looks good regardless of how much the user's data grows
  const calculateChartDatasets = () => {
    // Find the maximum value among all metrics for proper scaling
    const allValues = [
      correctAnswers,
      wrongAnswers,
      quizzesTaken,
      completedCourses,
      ongoingCourses
    ];

    // Get the maximum value to use for scaling (minimum 10 to avoid empty charts)
    const maxValue = Math.max(...allValues, 10);

    // Create datasets with percentage values relative to the maximum
    return [
      {
        label: 'Correct Answers',
        backgroundColor: 'rgba(76, 175, 80, 0.8)', // Green
        data: [correctAnswers],
        // Store original value for tooltip display
        originalValue: correctAnswers
      },
      {
        label: 'Wrong Answers',
        backgroundColor: 'rgba(244, 67, 54, 0.8)', // Red
        data: [wrongAnswers],
        originalValue: wrongAnswers
      },
      {
        label: 'Quizzes Taken',
        backgroundColor: 'rgba(33, 150, 243, 0.8)', // Blue
        data: [quizzesTaken],
        originalValue: quizzesTaken
      },
      {
        label: 'Completed Courses',
        backgroundColor: 'rgba(156, 39, 176, 0.8)', // Purple
        data: [completedCourses],
        originalValue: completedCourses
      },
      {
        label: 'In Progress Courses',
        backgroundColor: 'rgba(255, 193, 7, 0.8)', // Amber
        data: [ongoingCourses],
        originalValue: ongoingCourses
      }
    ];
  };

  // Chart data configuration
  const chartData = {
    labels: ['Learning Performance'],
    datasets: calculateChartDatasets()
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Learning Activities Summary',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            // Show the original value in the tooltip
            const dataset = context.dataset;
            const value = dataset.originalValue;
            return `${dataset.label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        },
        ticks: {
          callback: function (value) {
            // Display whole numbers only
            if (Math.floor(value) === value) {
              return value;
            }
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Metrics'
        }
      }
    },
    // Ensure bars have consistent width regardless of data size
    barPercentage: 0.8,
    categoryPercentage: 0.9,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Simple Header Component */}
        <SimpleDashboardHeader userData={dashboardData?.user} />

        {/* Top Stats Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Key Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topStats.map((stat, index) => (
              <TopStatCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Main Stats Grid - Made taller with pb-12 to fill more screen space */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 pb-12">
          <StatsBox
            icon={<BarChart className="h-8 w-8 text-blue-500" />}
            title="Course Progress"
            stats={learningProgressStats}
          />
          <StatsBox
            icon={<Trophy className="h-8 w-8 text-yellow-500" />}
            title="Quiz Performance"
            stats={quizStats}
          />
          <StatsBox
            icon={<Users className="h-8 w-8 text-white" />}
            title="Profile Overview"
            stats={profileStats}
            bgColor="from-blue-500 to-indigo-600"
            textColor="text-white"
          />
        </div>

        {/* Charts and Goals Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Activities Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Learning Activities</h3>
              </div>
            </div>
            {/* Bar Chart */}
            <div className="h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <p>This chart shows your current learning progress and quiz performance.</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Quiz Success: {successRate}%</span>
                  </div>
                  <ProgressBar value={correctAnswers} max={totalQuizAnswers} color="bg-green-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Course Completion: {totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0}%</span>
                  </div>
                  <ProgressBar value={completedCourses} max={totalCourses} color="bg-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Learning Goals */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Learning Goals</h3>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                + Add Goal
              </button>
            </div>
            <div className="space-y-6">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{goal.title}</span>
                    <span className="text-sm text-gray-500">{goal.deadline}</span>
                  </div>
                  <ProgressBar value={goal.progress} max={100} />
                  <div className="text-sm text-gray-500 text-right">{goal.progress}% Complete</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverview;