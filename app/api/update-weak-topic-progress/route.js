import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { topic, progress } = await req.json();
  if (!topic || progress == null) {
    return new Response("Invalid Data", { status: 400 });
  }

  // Find latest assessment
  const assessment = await db.assessment.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }, // Update latest assessment
  });

  if (!assessment) return new Response("Assessment not found", { status: 404 });

  // Update or add weak topic progress
  let updatedWeakTopicProgress = assessment.weakTopicProgress || [];

  const topicIndex = updatedWeakTopicProgress.findIndex((entry) => entry.topic === topic);

  if (topicIndex !== -1) {
    updatedWeakTopicProgress[topicIndex].progress = Math.max(
      updatedWeakTopicProgress[topicIndex].progress,
      progress
    );
  } else {
    updatedWeakTopicProgress.push({ topic, progress });
  }

  await db.assessment.update({
    where: { id: assessment.id },
    data: { weakTopicProgress: updatedWeakTopicProgress },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
