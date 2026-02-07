import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { question, quizAttempt } from "@/lib/db/schema/quiz";

export const getQuizStatus = async (user: { id: string }) => {
  const attempt = await db.query.quizAttempt.findFirst({
    where: eq(quizAttempt.userId, user.id),
  });

  if (attempt) {
    return {
      taken: true,
      score: attempt.score,
      total: attempt.totalQuestions,
    };
  }

  return { taken: false };
};

export const getQuiz = async (user: { id: string }) => {
  const attempt = await db.query.quizAttempt.findFirst({
    where: eq(quizAttempt.userId, user.id),
  });

  const questions = await db
    .select({
      id: question.id,
      text: question.text,
      options: question.options,
      order: question.order,
    })
    .from(question)
    .orderBy(asc(question.order));
};
