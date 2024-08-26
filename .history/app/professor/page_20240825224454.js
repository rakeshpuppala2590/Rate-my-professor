"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ChatbotInterface from "../components/ChatBotInterface";
import DynamicNavbar from "../components/DynamicNavbar";
import Spline from "@splinetool/react-spline";

// import Background3D from "../components/Background3D";

// Dynamically import Spline to avoid SSR issues
// const Spline = dynamic(() => import('@splinetool/react-spline'),{
//   ssr: false,
//   loading: () => <p>Loading 3D model...</p>,
// });

export default function Home() {
  const [professorId, setProfessorId] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

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
      const text = `Professor Information: ${professorInfo}\n\nFeedbacks: ${feedbacks}`;
      const chunkSize = 5000; // Adjust this value based on your needs
      const chunks = [];

      for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
      }

      for (let i = 0; i < chunks.length; i++) {
        const response = await fetch("/api/add-professor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source,
            text: chunks[i],
            chunkIndex: i,
            totalChunks: chunks.length,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorData.error}`
          );
        }

        const result = await response.json();
        console.log(`Chunk ${i + 1}/${chunks.length} processed:`, result);
      }

      console.log("All chunks processed successfully");
    } catch (error) {
      console.error("Error sending data for embedding:", error);
      setError(`Error: ${error.message}`);
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

  // return (
  //   <div>
  //     <h1>RateMyProfessors Feedback Scraper</h1>
  //     <div>
  //       <input
  //         type="text"
  //         value={professorId}
  //         onChange={(e) => setProfessorId(e.target.value)}
  //         placeholder="Enter Professor URL: "
  //       />
  //       <button onClick={handleSubmit} disabled={isLoading}>
  //         {isLoading ? "Scraping..." : "Scrape Feedback"}
  //       </button>
  //     </div>
  //     <div>
  //       <input
  //         type="text"
  //         value={userQuery}
  //         onChange={(e) => setUserQuery(e.target.value)}
  //         placeholder="Ask a question about the professor"
  //       />
  //       <button onClick={handleQuery} disabled={isQuerying}>
  //         {isQuerying ? "Querying..." : "Ask Question"}
  //       </button>
  //     </div>
  //     {error && <p style={{ color: "red" }}>Error: {error}</p>}
  //     {answer && (
  //       <div>
  //         <h2>Answer:</h2>
  //         <p>{answer}</p>
  //       </div>
  //     )}
  //   </div>
  // );
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 overflow-hidden">
      <DynamicNavbar />
      <div className="container mx-auto px-4 py-20 flex flex-col lg:flex-row justify-between items-center">
        {/* Spline model container */}
        <div className="w-full lg:w-1/2 h-[500px] mb-8 lg:mb-0 relative">
          <div className="absolute inset-0 z-0">
            <Spline scene="https://prod.spline.design/h-MzhlKtinRO8ewm/scene.splinecode" />
          </div>
        </div>

        {/* Chatbot Interface */}
        <div className="w-full lg:w-1/2 lg:pl-8">
          <ChatbotInterface
            professorId={professorId}
            setProfessorId={setProfessorId}
            userQuery={userQuery}
            setUserQuery={setUserQuery}
            handleSubmit={handleSubmit}
            handleQuery={handleQuery}
            isLoading={isLoading}
            isQuerying={isQuerying}
            error={error}
            answer={answer}
          />
        </div>
      </div>
    </div>
  );
}
