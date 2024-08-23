"use client";

import { useState } from "react";

export default function Home() {
  const [professorId, setProfessorId] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleSubmit = async () => {
    const extractedId = extractProfessorId(professorId);
    if (!extractedId) {
      setError(
        "Invalid URL format. Please enter a valid RateMyProfessors URL."
      );
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
        body: JSON.stringify({ professorId: extractedId }),
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

      // Send professor info and feedbacks to the API for embedding and storage
      await sendToEmbeddingAPI(
        professorId,
        professorInfoString,
        feedbacksString
      );

      console.log("Professor Information:", professorInfoString);
      console.log("Feedbacks:", feedbacksString);
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const extractProfessorId = (url) => {
    const match = url.match(/professor\/(\d+)$/);
    return match ? match[1] : null;
  };

  const sendToEmbeddingAPI = async (source, professorInfo, feedbacks) => {
    try {
      const response = await fetch("/api/add-professor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source,
          text: `Professor Information: ${professorInfo}\n\nFeedbacks: ${feedbacks}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Embedding and storage result:", result);
    } catch (error) {
      console.error("Error sending data for embedding:", error);
    }
  };

  const handleQuery = async () => {
    if (!userQuery.trim()) {
      setError("Please enter a question.");
      return;
    }

    setIsQuerying(true);
    setError(null);
    try {
      const response = await fetch("/api/get-professor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userQuery }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data);
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div>
      <h1>RateMyProfessors Feedback Scraper</h1>
      <div>
        <input
          type="text"
          value={professorId}
          onChange={(e) => setProfessorId(e.target.value)}
          placeholder="Enter Professor URL: "
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Scraping..." : "Scrape Feedback"}
        </button>
      </div>
      <div>
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Ask a question about the professor"
        />
        <button onClick={handleQuery} disabled={isQuerying}>
          {isQuerying ? "Querying..." : "Ask Question"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {answer && (
        <div>
          <h2>Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
