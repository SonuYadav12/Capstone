"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import WeakTopicQuiz from "@/components/WeakTopicQuiz";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function WeakTopicsProgress({ assessments = [] }) {
  const [activeTopic, setActiveTopic] = useState(null);
  const [progressMap, setProgressMap] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (Array.isArray(assessments)) {
      const mappedProgress = assessments.flatMap(
        (a) => a.weakTopicProgress || []
      );
      setProgressMap(mappedProgress);
    }
  }, [assessments]);

  const MASTERY_THRESHOLD = 80;

  const weakTopics = [...new Set(progressMap.map((t) => t.topic))].filter(
    (topic) => {
      const topicData = progressMap.filter((t) => t.topic === topic);
      if (topicData.length === 0) return true;
      const latestAttempt = topicData[topicData.length - 1];
      return latestAttempt.score < MASTERY_THRESHOLD;
    }
  );

  const getTopicData = (topic) => {
    const topicData = progressMap.filter((t) => t.topic === topic);
    if (topicData.length === 0) return { attempts: 0, score: 0 };
    const latestAttempt = topicData[topicData.length - 1];
    return {
      attempts: latestAttempt.attempts || 0,
      score: latestAttempt.score || 0,
    };
  };

//   const handleQuizCompletion = async (topic, newScore) => {
//     setIsSaving(true);

//     try {
//       await saveQuizResult(topic, newScore);

//       setProgressMap((prev) => {
//         const topicEntries = prev.filter((t) => t.topic === topic);
//         const latestAttempt =
//           topicEntries.length > 0 ? topicEntries[topicEntries.length - 1] : null;

//         const updatedEntry = {
//           topic,
//           score: Math.max(newScore, latestAttempt?.score || 0),
//           attempts: (latestAttempt?.attempts || 0) + 1,
//         };

//         return [...prev.filter((t) => t.topic !== topic), updatedEntry];
//       });

//       setActiveTopic(null);
//     } catch (error) {
//       console.error("Failed to save quiz result:", error);
//     } finally {
//       setIsSaving(false);
//     }
//   };
// const handleQuizCompletion = async (topic, newScore) => {
//     setIsSaving(true);
  
//     try {
//       await saveQuizResult(topic, newScore, true); // Pass `true` to indicate a weak topic quiz
  
//       setProgressMap((prev) => {
//         const topicEntries = prev.filter((t) => t.topic === topic);
//         const latestAttempt =
//           topicEntries.length > 0 ? topicEntries[topicEntries.length - 1] : null;
  
//         const updatedEntry = {
//           topic,
//           score: Math.max(newScore, latestAttempt?.score || 0),
//           attempts: (latestAttempt?.attempts || 0) + 1,
//           isWeakTopicQuiz: true, // ✅ Mark it as a weak topic quiz
//         };
  
//         return [...prev.filter((t) => t.topic !== topic), updatedEntry];
//       });
  
//       setActiveTopic(null);
//     } catch (error) {
//       console.error("Failed to save quiz result:", error);
//     } finally {
//       setIsSaving(false);
//     }
//   };.

const handleQuizCompletion = async (topic, newScore) => {
    setIsSaving(true);
  
    try {
      await saveQuizResult({
        quizScore: newScore,
        category: "Weak Topic",
        questions: [{ topic, weakTopicQuiz: true }], // ✅ Embed marker inside questions array
      });
  
      setProgressMap((prev) => {
        const topicEntries = prev.filter((t) => t.topic === topic);
        const latestAttempt =
          topicEntries.length > 0 ? topicEntries[topicEntries.length - 1] : null;
  
        const updatedEntry = {
          topic,
          score: Math.max(newScore, latestAttempt?.score || 0),
          attempts: (latestAttempt?.attempts || 0) + 1,
        };
  
        return [...prev.filter((t) => t.topic !== topic), updatedEntry];
      });
  
      setActiveTopic(null);
    } catch (error) {
      console.error("Failed to save quiz result:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  
  return (
    <>
      <Card className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-black shadow-lg rounded-xl p-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl font-semibold text-gray-900 dark:text-white">
            <span>📌 Weak Topics & Progress</span>
            {weakTopics.length >3&& (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                {expanded ? "Show Less" : "Show More"}
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {weakTopics.length > 0 ? (
           (expanded ? weakTopics : weakTopics.slice(0, 2)).map((topic) => {

              const { attempts, score } = getTopicData(topic);

              return (
                <div
                  key={topic}
                  className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {topic}
                    </p>
                    <Button
                      size="sm"
                      variant="default"
                      className="bg-black text-white dark:bg-white dark:text-black transition-all duration-300 hover:opacity-80"
                      onClick={() => setActiveTopic(topic)}
                    >
                      Start Quiz
                    </Button>
                  </div>

                  <Progress
                    value={score}
                    className="h-3 rounded-lg overflow-hidden bg-gray-300 dark:bg-gray-700 transition-all"
                  />

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Attempts: {attempts} | Score:{" "}
                    <span
                      className={`font-semibold ${
                        score >= 50
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {score.toFixed(2)}%
                    </span>
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-700 dark:text-gray-300 text-lg font-medium text-center">
              🎉 All weak topics mastered!
            </p>
          )}
        </CardContent>
      </Card>

      {/* 🚀 Quiz Modal */}
      <Dialog
        open={!!activeTopic}
        onOpenChange={() => !isSaving && setActiveTopic(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black border dark:border-gray-700 shadow-2xl rounded-lg p-6 transition-all">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black dark:text-white">
              Weak Topic Quiz: {activeTopic}
            </DialogTitle>
          </DialogHeader>
          {activeTopic && (
            <WeakTopicQuiz topic={activeTopic} onComplete={handleQuizCompletion} />
          )}
          {isSaving && (
            <p className="text-sm text-blue-500 dark:text-white text-center mt-4">
              Saving result...
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Simulated save function (replace with actual API call)
const saveQuizResult = (topic, score) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), 1500));
};
