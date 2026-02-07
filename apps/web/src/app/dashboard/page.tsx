import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getQuizStatus } from "@/lib/api/quiz";
import { DashboardClient } from "./dashboard";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const quizStatus = await getQuizStatus(session.user);

  return <DashboardClient quizStatus={quizStatus} session={session} />;
}
