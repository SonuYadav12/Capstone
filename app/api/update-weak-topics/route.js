import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { weakTopics } = await req.json();
  if (!weakTopics || weakTopics.length === 0) {
    return new Response("No weak topics provided", { status: 400 });
  }

  // Update latest assessment with weak topics
  const assessment = await db.assessment.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }, // Update latest assessment
  });

  if (!assessment) return new Response("Assessment not found", { status: 404 });

  await db.assessment.update({
    where: { id: assessment.id },
    data: { weakTopics },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
