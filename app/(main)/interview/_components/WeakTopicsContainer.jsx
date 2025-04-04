"use client"; 
import { useState } from "react";
import WeakTopicsProgress from "./WeakTopicsProgress"
import WeakTopicQuiz from "@/components/WeakTopicQuiz"; 

export default function WeakTopicsContainer({ assessments }) {
  const [selectedTopic, setSelectedTopic] = useState(null); 

  const handleStartQuiz = (topic) => {
    setSelectedTopic(topic); 
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
