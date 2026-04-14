"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  function handleComplete() {
    startTransition(async () => {
      const response = await completeWorkoutSessionAction(
        workoutPlanId,
        workoutDayId,
        sessionId,
      );

      if (response.status === 200) {
        router.push(
          `/workout-plans/${workoutPlanId}/days/${workoutDayId}/complete?sessionId=${sessionId}`,
        );
      }
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
