"use server";

import { revalidatePath } from "next/cache";
import { startWorkoutSession, updateWorkoutSession } from "@/app/_lib/api/fetch-generated";
import dayjs from "dayjs";

export async function startWorkoutSessionAction(
  workoutPlanId: string,
  workoutDayId: string
) {
  const response = await startWorkoutSession(workoutPlanId, workoutDayId);
  
  if (response.status === 201) {
    revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
  }
  
  return response;
}

export async function completeWorkoutSessionAction(
  workoutPlanId: string,
  workoutDayId: string,
  sessionId: string
) {
  const completedAt = dayjs().toISOString();
  
  const response = await updateWorkoutSession(workoutPlanId, workoutDayId, sessionId, {
    completedAt,
  });
  
  if (response.status === 200) {
    // Revalidar tanto a página do dia quanto as páginas iniciais e do calendário
    revalidatePath(`/workout-plans/${workoutPlanId}/days/${workoutDayId}`);
    revalidatePath(`/workout-plans/${workoutPlanId}`);
    revalidatePath("/");
  }
  
  return response;
}
