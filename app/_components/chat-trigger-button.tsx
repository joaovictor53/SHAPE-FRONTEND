"use client";

import { useQueryState, parseAsBoolean } from "nuqs";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatTriggerButton() {
  const [isOpen, setIsOpen] = useQueryState("chat_open", parseAsBoolean.withDefault(false));

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="flex size-14 items-center justify-center rounded-full bg-primary shadow-lg ring-4 ring-background"
      style={{ transform: "translateY(-12px)" }}
    >
      <Sparkles className="size-6 text-primary-foreground" />
    </button>
  );
}
