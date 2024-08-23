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

      // Print the data to the console
      console.log("Professor Information:", professorInfo);
      console.log("Feedbacks:", feedbacks);
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
