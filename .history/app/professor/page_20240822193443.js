"use client";

import { useState } from "react";

export default function Home() {
  const [professorId, setProfessorId] = useState("");
  const [professorInfo, setProfessorInfo] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!professorId.trim()) {
      setError("Please enter a professor ID or URL.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/professor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ professorId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setProfessorInfo(data.professorInfo);
      setFeedbacks(data.feedbacks);
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>RateMyProfessors Feedback Scraper</h1>
      <input
        type="text"
        value={professorId}
        onChange={(e) => setProfessorId(e.target.value)}
        placeholder="Enter Professor ID or URL"
      />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Scraping..." : "Scrape Feedback"}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {professorInfo && (
        <div>
          <h2>Professor Information</h2>
          <p>Name: {professorInfo.name}</p>
          <p>Department: {professorInfo.department}</p>
          <p>Overall Rating: {professorInfo.overallRating}</p>
          <p>Number of Ratings: {professorInfo.numRatings}</p>
          <p>Would Take Again: {professorInfo.wouldTakeAgain}</p>
          <p>Difficulty: {professorInfo.difficulty}</p>
          <p>Top Tags: {professorInfo.topTags.join(", ")}</p>
        </div>
      )}
      {feedbacks.length > 0 && (
        <div>
          <h2>Feedbacks</h2>
          <ul>
            {feedbacks.map((feedback, index) => (
              <li key={index}>
                <p>Course: {feedback.course}</p>
                <p>Date: {feedback.date}</p>
                <p>Quality: {feedback.qualityRating}</p>
                <p>Difficulty: {feedback.difficultyRating}</p>
                <p>Comments: {feedback.comments}</p>
                <p>Tags: {feedback.tags.join(", ")}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
