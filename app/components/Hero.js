"use client";

import { motion } from 'framer-motion';
import DynamicNavbar from './DynamicNavbar';
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Hero() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/professor');
    }
  }, [isSignedIn, router]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 overflow-hidden">
      <DynamicNavbar />
      
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Rate Your Professors
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-indigo-800 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Discover and share insights about your educators
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <SignInButton>
            <button className="px-8 py-3 bg-indigo-600 text-white text-lg rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300">
              Get Started
            </button>
          </SignInButton>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}