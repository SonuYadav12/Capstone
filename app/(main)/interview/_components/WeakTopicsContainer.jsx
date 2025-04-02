"use client"; // ✅ Client component for interactivity
import { useState } from "react";
import WeakTopicsProgress from "./WeakTopicsProgress"
import WeakTopicQuiz from "@/components/WeakTopicQuiz"; // Starts quiz

export default function WeakTopicsContainer({ assessments }) {
  const [selectedTopic, setSelectedTopic] = useState(null); // Track selected weak topic

  const handleStartQuiz = (topic) => {
    setSelectedTopic(topic); // Set the selected topic for the quiz
  };

  return (
    <div className="space-y-6">
      {/* Display weak topics list */}
      <WeakTopicsProgress assessments={assessments} onStartQuiz={handleStartQuiz} />

      {/* Show quiz only if a topic is selected */}
      {selectedTopic && <WeakTopicQuiz topic={selectedTopic} />}
    </div>
  );
}
