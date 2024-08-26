"use client";

import { useEffect, useState } from "react";
import DynamicNavbar from "../components/DynamicNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, Book, X } from "lucide-react";

// Modal component
const Modal = ({ isOpen, onClose, professor }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{professor.metadata.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-lg mb-2">{professor.metadata.department}</p>
          <div className="flex items-center mb-2">
            <Star className="text-yellow-400 mr-2" />
            <span className="font-bold">
              {professor.metadata.overallRating.toFixed(1)}
            </span>
            <span className="text-gray-600 ml-2">
              ({professor.metadata.numberOfRatings} ratings)
            </span>
          </div>
          <p className="mb-2">
            Would Take Again: {professor.metadata.wouldTakeAgain || "N/A"}
          </p>
          <p className="mb-4">
            Difficulty:{" "}
            {professor.metadata.difficulty
              ? professor.metadata.difficulty.toFixed(1)
              : "N/A"}
          </p>
          <div className="mb-4">
            <p className="font-semibold">Top Tags:</p>
            <div className="flex flex-wrap mt-1">
              {professor.metadata.topTags.length > 0 ? (
                professor.metadata.topTags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function Professors() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("overallRating");
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  useEffect(() => {
    fetchProfessors();
  }, []);

  async function fetchProfessors() {
    try {
      const response = await fetch("/api/get-professor", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Sort the data by overall rating and take only the top 15
      const sortedData = data.sort(
        (a, b) => b.metadata.overallRating - a.metadata.overallRating
      );

      const top15 = sortedData.slice(0, 15);

      setProfessors(top15);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const sortProfessors = (criteria) => {
    setSortBy(criteria);
    const sorted = [...professors].sort(
      (a, b) => b.metadata[criteria] - a.metadata[criteria]
    );
    setProfessors(sorted);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-white text-2xl font-bold"
        >
          Loading...
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-red-500 text-2xl font-bold"
        >
          {error}
        </motion.div>
      </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
          <DynamicNavbar />
          <div className="container mx-auto px-4 py-20">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-white mb-8 text-center"
            >
              Top 15 Professors
            </motion.h1>
            <div className="mb-6 flex justify-center space-x-4">
              <button
                onClick={() => sortProfessors('overallRating')}
                className={`px-4 py-2 rounded-full ${sortBy === 'overallRating' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-800'}`}
              >
                Sort by Rating
              </button>
              <button
                onClick={() => sortProfessors('numberOfRatings')}
                className={`px-4 py-2 rounded-full ${sortBy === 'numberOfRatings' ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-800'}`}
              >
                Sort by Popularity
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
            >
              {professors.map((professor, index) => (
                <motion.div
                  key={professor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
                >
                  <div 
                    className="bg-purple-600 p-4 h-24 flex flex-col justify-center cursor-pointer"
                    onClick={() => setSelectedProfessor(professor)}
                  >
                    <h2 className="text-xl font-semibold text-white truncate">{professor.metadata.name}</h2>
                    <p className="text-purple-200 truncate">
                      {professor.metadata.department}
                      <span className="text-xs ml-1">(Click for details)</span>
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <Star className="text-yellow-400 mr-2" />
                      <span className="font-bold">{professor.metadata.overallRating.toFixed(1)}</span>
                      <span className="text-gray-600 ml-2">({professor.metadata.numberOfRatings})</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <ThumbsUp className="text-green-500 mr-2" />
                      <span>{professor.metadata.wouldTakeAgain || 'N/A'}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Book className="text-blue-500 mr-2" />
                      <span>Difficulty: {professor.metadata.difficulty ? professor.metadata.difficulty.toFixed(1) : 'N/A'}</span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Top Tags:</p>
                      <div className="flex flex-wrap mt-1">
                        {professor.metadata.topTags.length > 0 ? professor.metadata.topTags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">{tag}</span>
                        )) : <span className="text-gray-500">N/A</span>}
                        {professor.metadata.topTags.length > 3 && (
                          <span className="text-xs text-gray-500">+{professor.metadata.topTags.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <Modal 
            isOpen={!!selectedProfessor} 
            onClose={() => setSelectedProfessor(null)} 
            professor={selectedProfessor} 
          />
        </div>
      );
}
