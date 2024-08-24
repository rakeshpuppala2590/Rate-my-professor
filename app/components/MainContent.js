import React from 'react';
import { motion } from 'framer-motion';

function MainContent() {
  return (
    <motion.div 
      className="w-full lg:w-2/3 p-8 flex flex-col justify-center items-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-5xl md:text-6xl font-bold text-white mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        ProfScore Insights
      </motion.h1>
      <motion.p 
        className="text-xl text-indigo-200 mb-8 text-center max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Discover in-depth insights about your professors and make informed decisions about your education journey.
      </motion.p>
      <AnimatedStats />
    </motion.div>
  );
}

function AnimatedStats() {
  const stats = [
    { label: 'Professors Rated', value: 10000 },
    { label: 'Average Score', value: 4.2 },
    { label: 'Student Reviews', value: 50000 },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.label} 
          className="bg-white bg-opacity-10 rounded-lg p-6 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
        >
          <motion.div 
            className="text-4xl font-bold text-indigo-300 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
          >
            {stat.value}
          </motion.div>
          <div className="text-white">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default MainContent;