"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resetWorkoutSessionAction } from "../../_actions";

export function ResetWorkoutButton({
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

  function handleReset() {
    if (
      !confirm(
        "Tem certeza que deseja reiniciar o treino? O progresso de conclusão será desfeito."
      )
    ) {
      return;
    }

    startTransition(async () => {
      const response = await resetWorkoutSessionAction(
        workoutPlanId,
        workoutDayId,
        sessionId,
      );

      if (response.status === 200) {
        router.push(
          `/workout-plans/${workoutPlanId}/days/${workoutDayId}`,
        );
      }
    });
  }

  return (
    <Button
      variant="ghost"
      disabled={isPending}
      onClick={handleReset}
      className="h-14 rounded-full border border-border bg-background/5 font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 gap-2"
    >
      <RotateCcw className="size-4" />
      {isPending ? "Reiniciando..." : "Reiniciar treino"}
    </Button>
  );
}
