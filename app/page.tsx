"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return <div className="h-screen bg-black flex items-center justify-center text-white font-sans">Carregando...</div>;
  }

  return (
    <h1>Home</h1>
  );
}
