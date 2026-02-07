import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { question, quizAttempt } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existingAttempt = await db.query.quizAttempt.findFirst({
    where: eq(quizAttempt.userId, session.user.id),
  });

  if (existingAttempt) {
    return NextResponse.json({ error: "Quiz already taken" }, { status: 403 });
  }

  const body = await request.json();

  if (!body.answers || !Array.isArray(body.answers)) {
    return NextResponse.json({ error: "Invalid answers format" }, { status: 400 });
  }

  const questions = await db
    .select({
      id: question.id,
      correctIndex: question.correctIndex,
      order: question.order,
    })
    .from(question)
    .orderBy(asc(question.order));

  if (body.answers.length !== questions.length) {
    return NextResponse.json({ error: "Answer count mismatch" }, { status: 400 });
  }

  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (body.answers[i] === questions[i].correctIndex) {
      score++;
    }
  }

  const attemptId = crypto.randomUUID();

  try {
    await db.insert(quizAttempt).values({
      id: attemptId,
      userId: session.user.id,
      score,
      totalQuestions: questions.length,
    });
  } catch {
    return NextResponse.json({ error: "Quiz already taken" }, { status: 403 });
  }

  return NextResponse.json({ score, total: questions.length });
}
