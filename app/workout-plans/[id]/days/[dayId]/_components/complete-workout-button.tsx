"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { completeWorkoutSessionAction } from "../_actions";

export function CompleteWorkoutButton({
  workoutPlanId,
  workoutDayId,
  sessionId,
}: {
  workoutPlanId: string;
  workoutDayId: string;
  sessionId: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    startTransition(async () => {
      await completeWorkoutSessionAction(workoutPlanId, workoutDayId, sessionId);
    });
  }

  return (
    <Button
      className="w-full h-12 text-base font-semibold rounded-2xl"
      disabled={isPending}
      onClick={handleComplete}
    >
      Marcar como concluído
    </Button>
  );
}
