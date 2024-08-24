import React from 'react';
import { motion } from 'framer-motion';

export default function ChatbotInterface({
  professorId,
  setProfessorId,
  userQuery,
  setUserQuery,
  handleSubmit,
  handleQuery,
  isLoading,
  isQuerying,
  error,
  answer
}) {
  return (
    <motion.div 
      className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">Professor Insights</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="professorUrl" className="block text-white mb-2">Professor URL</label>
          <input
            type="text"
            id="professorUrl"
            value={professorId}
            onChange={(e) => setProfessorId(e.target.value)}
            className="w-full px-3 py-2 bg-white bg-opacity-20 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter RateMyProfessors URL"
          />
        </div>
        <motion.button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? 'Scraping...' : 'Scrape Feedback'}
        </motion.button>
        <div>
          <label htmlFor="userQuery" className="block text-white mb-2">Your Question</label>
          <textarea
            id="userQuery"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="w-full px-3 py-2 bg-white bg-opacity-20 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ask about the professor"
            rows="3"
          ></textarea>
        </div>
        <motion.button
          onClick={handleQuery}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isQuerying}
        >
          {isQuerying ? 'Querying...' : 'Ask Question'}
        </motion.button>
      </div>
      {error && (
        <motion.p 
          className="mt-4 text-red-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Error: {error}
        </motion.p>
      )}
      {answer && (
        <motion.div 
          className="mt-6 p-4 bg-white bg-opacity-20 rounded text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-2">Answer:</h2>
          <p>{answer}</p>
        </motion.div>
      )}
    </motion.div>
  );
}