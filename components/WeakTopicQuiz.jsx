"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateWeakTopicQuiz, saveQuizResult } from "@/actions/interview";
import { BarLoader } from "react-spinners";

export default function WeakTopicQuiz({ topic, onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuiz() {
      setLoading(true);
      try {
        const data = await generateWeakTopicQuiz(topic);
        setQuizData(data);
        setAnswers(Array(data.length).fill(null)); // Ensure answers array is initialized
      } catch (error) {
        toast.error("Failed to load quiz");
      }
      setLoading(false);
    }

    if (topic) fetchQuiz();
  }, [topic]);

  const handleAnswer = (answer) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = answer;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (answers[currentQuestion] === null) {
      toast.error("Please select an answer before proceeding.");
      return;
    }

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) correct++;
    });

    const score = (correct / quizData.length) * 100;

    try {
      await saveQuizResult(quizData, answers, score);
      toast.success(`Quiz completed! Your score: ${score.toFixed(2)}%`);

      if (onQuizComplete) {
        onQuizComplete(score);
      }
    } catch (error) {
      toast.error("Failed to save quiz results: " + error.message);
    }
  };

  if (loading) return <BarLoader className="mt-4" width={"100%"} color="gray" />;

  if (!quizData || quizData.length === 0) {
    return <p className="text-center text-gray-500">No quiz data available.</p>;
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="border border-gray-200 shadow-lg bg-white rounded-lg">
      {/* Header with topic and question count */}
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-700 text-white p-4 rounded-t-lg">
        <CardTitle className="text-lg font-semibold">
          Practicing: {topic}
        </CardTitle>
        <p className="text-sm text-gray-200 mt-1">
          Question {currentQuestion + 1} of {quizData.length}
        </p>
      </CardHeader>

      {/* Question Content */}
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-indigo-600 text-lg">
            {currentQuestion + 1}.
          </span>
          <p className="text-lg font-medium text-gray-800">{question.question}</p>
        </div>

        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-md border 
                ${
                  answers[currentQuestion] === option
                    ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                    : "border-gray-300 hover:bg-gray-100"
                } cursor-pointer transition`}
            >
              <RadioGroupItem value={option} />
              <span className="text-gray-700 font-medium">{option}</span>
            </label>
          ))}
        </RadioGroup>
      </CardContent>

      {/* Footer with Navigation Button */}
      <CardFooter className="flex justify-between p-4">
        <p className="text-sm text-gray-500">
          {answers[currentQuestion] !== null ? "✔ Answer selected" : "❗ Select an answer"}
        </p>
        <Button
          onClick={handleNext}
          className={`px-6 py-2 rounded-md transition text-white ${
            answers[currentQuestion] !== null
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={answers[currentQuestion] === null}
        >
          {currentQuestion < quizData.length - 1 ? "Next" : "Finish"}
        </Button>
      </CardFooter>
    </Card>
  );
}
