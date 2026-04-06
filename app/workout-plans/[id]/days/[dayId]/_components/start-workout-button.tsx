"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { startWorkoutSessionAction } from "../_actions";

export function StartWorkoutButton({
  workoutPlanId,
  workoutDayId,
}: {
  workoutPlanId: string;
  workoutDayId: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleStart() {
    startTransition(async () => {
      await startWorkoutSessionAction(workoutPlanId, workoutDayId);
    });
  }

  return (
    <Button
      variant="default"
      className="rounded-full px-6 text-sm font-semibold h-10"
      disabled={isPending}
      onClick={handleStart}
    >
      {isPending ? "Iniciando..." : "Iniciar Treino"}
    </Button>
  );
}
