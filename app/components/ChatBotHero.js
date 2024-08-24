"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Navbar2 from './Navbar2';
import ChatbotInterface from './ChatBotInterface';
import Background3D from './Background3D';

export default function ChatbotHero() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar2 />
      <div className="flex flex-col lg:flex-row pt-20">
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
        </motion.div>
        <ChatbotInterface />
      </div>
      <Background3D />
    </div>
  );
}