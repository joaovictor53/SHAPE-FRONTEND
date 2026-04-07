import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { Chatbot } from "@/app/_components/chatbot";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  return (
    <div className="relative flex min-h-svh flex-col">
      <Chatbot inline />
      <div className="absolute right-5 top-5 z-50">
        <Link href="/">
          <Button className="rounded-full shadow-md font-heading font-semibold text-sm">
            Ir para a Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
