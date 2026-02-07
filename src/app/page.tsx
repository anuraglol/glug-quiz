import { SignInClient } from "@/components/sign-in";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <SignInClient />
    </div>
  );
}
