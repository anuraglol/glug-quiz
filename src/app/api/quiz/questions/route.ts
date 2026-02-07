import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { question, quizAttempt } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const attempt = await db.query.quizAttempt.findFirst({
    where: eq(quizAttempt.userId, session.user.id),
  });

  if (attempt) {
    return NextResponse.json({ error: "Quiz already taken" }, { status: 403 });
  }

  const questions = await db
    .select({
      id: question.id,
      text: question.text,
      options: question.options,
      order: question.order,
    })
    .from(question)
    .orderBy(asc(question.order));

  return NextResponse.json({ questions });
}
