// FeaturesSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Trophy, Users, Gift, ChartBar, BookOpen } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "AI-Powered Personalized Learning",
      description: "Tailored courses for every user with adaptive learning paths",
      color: "from-blue-500 to-blue-600",
      delay: 0.2
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI Chatbot Support",
      description: "24/7 assistance for doubts and instant problem-solving",
      color: "from-purple-500 to-purple-600",
      delay: 0.3
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Gamified Learning & Rewards",
      description: "Earn badges & track progress while learning",
      color: "from-yellow-500 to-yellow-600",
      delay: 0.4
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community & Collaboration",
      description: "Connect with peers & mentors for enhanced learning",
      color: "from-green-500 to-green-600",
      delay: 0.5
    },
    {
      icon: <Gift className="h-8 w-8" />,
      title: "Referral & Mentorship System",
      description: "Learn & earn via mentorship opportunities",
      color: "from-pink-500 to-pink-600",
      delay: 0.6
    },
    {
      icon: <ChartBar className="h-8 w-8" />,
      title: "Progress Tracking & AI Feedback",
      description: "Improve learning with AI analysis and insights",
      color: "from-indigo-500 to-indigo-600",
      delay: 0.7
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
              Features
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              {" "}Succeed
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of education with AI-powered features designed to accelerate your learning journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {feature.description}
              </p>
              <div className="mt-6">
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center group/link">
                  Learn more
                  <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;