"use client";

import { Trophy, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function QuizResult({
  result,
  hideStartNew = false,
  onStartNew,
}) {
  if (!result) return null;

  const quizScore = result.quizScore ? result.quizScore.toFixed(1) : "0.0";
  const questions = result.questions || [];

  return (
    <div className="mx-auto">
      <h1 className="flex items-center gap-2 text-3xl dark:gradient-title">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Quiz Results
      </h1>

      <CardContent className="space-y-6">
        {/* Score Overview */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">{quizScore}%</h3>
          <Progress value={parseFloat(quizScore)} className="w-full" />
        </div>

        {/* Improvement Tip (if available) */}
        {result.improvementTip && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Improvement Tip:</p>
            <p className="text-muted-foreground">{result.improvementTip}</p>
          </div>
        )}

        {/* Questions Review */}
        {questions.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-medium">Question Review</h3>
            {questions.map((q, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{q.question || "No question text available"}</p>
                  {q.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Your answer: {q.userAnswer || "N/A"}</p>
                  {!q.isCorrect && <p>Correct answer: {q.answer || "N/A"}</p>}
                </div>
                {q.explanation && (
                  <div className="text-sm bg-muted p-2 rounded">
                    <p className="font-medium">Explanation:</p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">No questions available for review.</p>
        )}
      </CardContent>

      {!hideStartNew && (
        <CardFooter>
          <Button onClick={onStartNew} className="w-full">
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
