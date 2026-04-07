"use client";

import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";
import type { GetWorkoutDayById200ExercisesItem } from "@/app/_lib/api/fetch-generated";

export function ExerciseCard({
  exercise,
}: {
  exercise: GetWorkoutDayById200ExercisesItem;
}) {
  const [isOpen, setIsOpen] = useQueryState("chat_open", parseAsBoolean.withDefault(false));
  const [, setInitialMsg] = useQueryState("chat_initial_message", parseAsString.withDefault(""));

  const handleOpenChat = () => {
    setIsOpen(true);
    setInitialMsg(`Como executar o exercício ${exercise.name} corretamente?`);
  };

  return (
    <div className="flex items-start justify-between rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col gap-2">
        <span className="font-heading text-sm font-semibold text-foreground">
          {exercise.name}
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {exercise.sets} SÉRIES
          </span>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {exercise.reps} REPS
          </span>
          <span className="flex items-center gap-0.5 rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            ⚡ {exercise.restTimeInSeconds}S
          </span>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleOpenChat}
        className="mt-0.5 size-7 rounded-full border border-border text-muted-foreground transition-colors"
      >
        <CircleHelp className="size-4" />
      </Button>
    </div>
  );
}
