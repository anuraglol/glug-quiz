import { getQuizStatus } from "@/lib/api/quiz";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { QuizClient } from "./quiz";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const data = await getQuizStatus(session.user);

  if (data.taken) {
    redirect("/quiz/result");
  }

  return <QuizClient />;
}
