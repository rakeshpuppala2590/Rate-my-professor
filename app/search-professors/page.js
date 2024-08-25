'use client';

import { useEffect, useState } from 'react';
import DynamicNavbar from '../components/DynamicNavbar';
import { analyzeComments } from '../api/analyze/route';

export default function Professors() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfessors() {
      try {
        const response = await fetch('/api/get-professor', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProfessors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfessors();
  }, []);

  useEffect(() => {
    if (professors.length > 0) {
      const performAnalysis = async () => {
        try {
          const results = await analyzeComments(professors);
          console.log('Analysis Results:', results);
        } catch (error) {
          console.error('Error using analyzeComments:', error);
        }
      };

      performAnalysis();
    }
  }, [professors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
      <DynamicNavbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-white mb-8">Professors List</h1>
        {loading && <p className="text-white">Loading...</p>}
        {/* Render professors here */}
      </div>
    </div>
  );
}