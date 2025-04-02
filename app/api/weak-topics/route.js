// app/api/weak-topics/route.js
import { NextResponse } from "next/server";
import { getWeakTopics } from "@/actions/interview";

export async function GET() {
  try {
    const data = await getWeakTopics();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
