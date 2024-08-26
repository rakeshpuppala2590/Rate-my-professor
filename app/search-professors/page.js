'use client';

import { useEffect, useState } from 'react';
import DynamicNavbar from '../components/DynamicNavbar';

export default function Professors() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfessors();
  }, []);

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

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
      <DynamicNavbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-white mb-8">Top 30 Professors (Sorted by Rating)</h1>
        <ul className="text-white">
          {professors.map((professor, index) => (
            <li key={professor.id} className="mb-4 bg-purple-700 p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{index + 1}. {professor.metadata.name}</h2>
              <p>Department: {professor.metadata.department}</p>
              <p>Overall Rating: {professor.metadata.overallRating.toFixed(1)}</p>jhg
              <p>Number of Ratings: {professor.metadata.numberOfRatings}</p>
              <p>Would Take Again: {professor.metadata.wouldTakeAgain || 'N/A'}</p>
              <p>Difficulty: {professor.metadata.difficulty ? professor.metadata.difficulty.toFixed(1) : 'N/A'}</p>
              <p>Top Tags: {professor.metadata.topTags.length > 0 ? professor.metadata.topTags.join(", ") : 'N/A'}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}