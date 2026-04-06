"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className="p-1">
      <ChevronLeft className="size-6 text-foreground" />
    </button>
  );
}
