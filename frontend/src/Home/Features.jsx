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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {" "}Smart Learning
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Experience the future of education with our innovative features
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
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
              <div className="mt-6">
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
                  Learn more
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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