"use client";

import { useState } from "react";

export default function Home() {
  const [professorId, setProfessorId] = useState("");
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
      const response = await fetch("/api/professor_details", {
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

      const professorInfo = data.professorInfo;
      const feedbacks = data.feedbacks;

      // Format professorInfo as a comma-separated string
      const professorInfoString = [
        `Name: ${professorInfo.name || "Unknown"}`,
        `Department: ${professorInfo.department || "Unknown"}`,
        `Overall Rating: ${professorInfo.overallRating || "N/A"}`,
        `Number of Ratings: ${professorInfo.numRatings || "0"}`,
        `Would Take Again: ${professorInfo.wouldTakeAgain || "N/A"}`,
        `Difficulty: ${professorInfo.difficulty || "N/A"}`,
        `Top Tags: ${professorInfo.topTags.join(", ") || "None"}`,
      ].join(", ");

      // Format feedbacks as a comma-separated string
      const feedbacksString = feedbacks
        .map((feedback) =>
          [
            `Course: ${feedback.course || ""}`,
            `Date: ${feedback.date || ""}`,
            `Quality: ${feedback.qualityRating || ""}`,
            `Difficulty: ${feedback.difficultyRating || ""}`,
            `Comments: ${feedback.comments || ""}`,
            `Tags: ${feedback.tags.join(", ") || "None"}`,
          ].join(", ")
        )
        .join("; ");

      // Print the formatted strings to the console
      console.log("Professor Information:", professorInfoString);
      console.log("Feedbacks:", feedbacksString);
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
        placeholder="Enter Professor ID"
      />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Scraping..." : "Scrape Feedback"}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
