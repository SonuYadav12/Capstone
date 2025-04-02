"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import Select from "react-select";

const predefinedTopics = [
  { label: "Data Structures", value: "Data Structures" },
  { label: "Algorithms", value: "Algorithms" },
  { label: "Databases", value: "Databases" },
  { label: "System Design", value: "System Design" },
  { label: "Networking", value: "Networking" },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]); // Tracked internally
  const [customTopics, setCustomTopics] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  // Fetch weak topics from the API when the component mounts
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/weak-topics");
        if (!res.ok) throw new Error("Failed to fetch weak topics");
        const data = await res.json();
        console.log("Fetched Weak Topics:", data);
        setWeakTopics(data); // Store weak topics internally
      } catch (err) {
        console.error("Error fetching weak topics:", err);
      }
    })();
  }, []);

  // When quizData is loaded, initialize the answers array.
  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const calculateScoreAndWeakTopics = () => {
    let correct = 0;
    let weakTopicsSet = new Set();

    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      } else {
        weakTopicsSet.add(quizData[index].topic);
      }
    });

    const weakTopicsArray = [...weakTopicsSet];
    setWeakTopics(weakTopicsArray); // Update weak topics internally
    return {
      score: (correct / quizData.length) * 100,
      weakTopics: weakTopicsArray,
    };
  };

  const finishQuiz = async () => {
    const { score, weakTopics } = calculateScoreAndWeakTopics();

    try {
      await saveQuizResultFn(quizData, answers, score);
      setWeakTopics(weakTopics); // Update weak topics for tracking
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);

    // Get selected topics and custom topics
    const selectedValues = selectedTopics.map((topic) => topic.value);
    const customValues = customTopics
      .split(",")
      .map((topic) => topic.trim())
      .filter(Boolean);

    // Combine all topics into one array (excluding weak topics from UI)
    const allTopics = [...selectedValues, ...customValues];

    console.log("Starting new quiz with topics:", allTopics);

    if (allTopics.length === 0) {
      toast.error("Please select at least one topic before starting the quiz.");
      return;
    }

    generateQuizFn(allTopics);
    setResultData(null);
  };

  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Choose Your Quiz Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select predefined topics or add custom topics.
          </p>
          {/* Predefined Topics */}
          <Select
            options={predefinedTopics}
            value={selectedTopics}
            onChange={setSelectedTopics}
            isMulti
            placeholder="Select predefined topics..."
            className="mt-2 text-black"
          />
          {/* Custom Topics */}
          <input
            type="text"
            placeholder="Add custom topics (comma separated)"
            value={customTopics}
            onChange={(e) => setCustomTopics(e.target.value)}
            className="mt-4 w-full p-2 border rounded bg-white"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={startNewQuiz} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleNext} className="ml-auto">
          {currentQuestion < quizData.length - 1 ? "Next" : "Finish"}
        </Button>
      </CardFooter>
    </Card>
  );
}
