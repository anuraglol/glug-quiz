import { getQuizStatus } from "@/lib/api/quiz";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ResultClient } from "./result";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const data = await getQuizStatus(session.user);

  if (!data.taken) {
    redirect("/quiz");
  }

  return <ResultClient score={data.score!} total={data.total!} />;
}
