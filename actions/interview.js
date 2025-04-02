"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateQuiz(selectedTopics = [], customTopics = []) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const pastWeakTopics = await getWeakTopics();

  const combinedTopics = [
    ...new Set([...(user.skills || []), ...selectedTopics, ...customTopics, ...pastWeakTopics]),
  ];

  if (combinedTopics.length === 0) throw new Error("No topics selected!");

  const prompt = `
    Generate 15 technical interview questions for a ${user.industry} professional 
    covering the following topics: ${combinedTopics.join(", ")}.

    Each question should be multiple choice with 4 options.
    Include the topic for each question.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string",
          "topic": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}


export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index] || "No Answer",
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation || "No explanation available",
    topic: q.topic || "General",
  }));

  
  const weakTopics = [
    ...new Set(questionResults.filter((q) => !q.isCorrect).map((q) => q.topic)),
  ];

  const previousAssessments = await db.assessment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { weakTopicProgress: true },
  });

  let weakTopicProgress = [];

  
  previousAssessments.forEach((assessment) => {
    if (assessment.weakTopicProgress) {
      weakTopicProgress = [...weakTopicProgress, ...assessment.weakTopicProgress];
    }
  });

  
  weakTopics.forEach((topic) => {
    const existing = weakTopicProgress.find((item) => item.topic === topic);
    if (existing) {
      existing.attempts += 1;
      existing.score = Math.max(existing.score, score);
    } else {
      weakTopicProgress.push({ topic, attempts: 1, score });
    }
  });

 
  const MASTERY_THRESHOLD = 80;
  weakTopicProgress = weakTopicProgress.filter((item) => item.score < MASTERY_THRESHOLD);

 
  let improvementTip = "Keep practicing and review your weak topics.";
  if (weakTopics.length > 0) {
    const improvementPrompt = `
      The user struggled with the following topics: ${weakTopics.join(", ")}.
      Provide a short, motivating improvement tip for these topics.
      Keep it under 2 sentences.
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);
      improvementTip = tipResult.response.text().trim() || improvementTip;
    } catch (error) {
      console.error("Error generating improvement tip:", error);
    }
  }

  try {
    console.log("Saving quiz result:", {
      userId: user.id,
      quizScore: score,
      questions: questionResults,
      weakTopics,
      weakTopicProgress,
      improvementTip,
    });

    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        weakTopics,
        weakTopicProgress,
        improvementTip,
      },
    });

    console.log("✅ Quiz Result Saved Successfully:", assessment);
    return assessment;
  } catch (error) {
    console.error("❌ Error saving quiz result:", error);
    throw new Error("Failed to save quiz result. Check logs for details.");
  }
}


export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}

export async function getWeakTopics() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const assessments = await db.assessment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5, 
      select: { weakTopicProgress: true },
    });

    let weakTopicProgress = [];

    
    assessments.forEach((assessment) => {
      if (assessment.weakTopicProgress) {
        weakTopicProgress = [...weakTopicProgress, ...assessment.weakTopicProgress];
      }
    });

    
    const topicMap = new Map();
    weakTopicProgress.forEach(({ topic, score }) => {
      if (topicMap.has(topic)) {
        topicMap.set(topic, topicMap.get(topic) + score);
      } else {
        topicMap.set(topic, score);
      }
    });

   
    const finalWeakTopics = Array.from(topicMap, ([topic, score]) => ({ topic, score }));

    console.log("Fetched Weak Topics with Progress:", finalWeakTopics);
    
    return finalWeakTopics; 
  } catch (error) {
    console.error("Error fetching weak topics:", error);
    return [];
  }
}

export async function generateWeakTopicQuiz(weakTopic) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
    },
  });

  if (!user) throw new Error("User not found");

  if (!weakTopic) throw new Error("No weak topic selected!");

  const prompt = `
    Generate 15 technical interview questions for a ${user.industry} professional 
    focused on the topic: ${weakTopic}.

    Each question should be multiple choice with 4 options.
    Include the topic in the response.

    Return the response in this JSON format only:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string",
          "topic": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating weak topic quiz:", error);
    throw new Error("Failed to generate weak topic quiz questions");
  }
}

