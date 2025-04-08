// HowItWorks.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Brain, Users } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus className="h-10 w-10" />,
      number: "01",
      title: "Sign Up & Choose Interests",
      description: "AI recommends your learning path based on your interests and goals",
      color: "from-blue-500 to-blue-600",
      delay: 0.2
    },
    {
      icon: <Brain className="h-10 w-10" />,
      number: "02",
      title: "Learn with AI Assistance",
      description: "Interactive lessons & real-time feedback to enhance your learning",
      color: "from-purple-500 to-purple-600",
      delay: 0.4
    },
    {
      icon: <Users className="h-10 w-10" />,
      number: "03",
      title: "Engage & Earn",
      description: "Join the community, refer friends, become a mentor and earn rewards",
      color: "from-indigo-500 to-indigo-600",
      delay: 0.6
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Start your learning journey in three simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: step.delay, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Number Badge */}
                  <div className="absolute -top-4 left-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold py-2 px-4 rounded-full">
                    Step {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white mb-6`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>

                  {/* Animated Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Start Your Journey Now
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;