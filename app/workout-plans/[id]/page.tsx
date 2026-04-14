import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { getWorkoutPlan, getHomeData, getUserTrainData } from "@/app/_lib/api/fetch-generated";
import dayjs from "dayjs";
import { BottomNav } from "@/app/_components/bottom-nav";
import { WorkoutDayCard } from "@/app/_components/workout-day-card";
import { RestDayCard } from "@/app/_components/rest-day-card";
import { BackButton } from "./days/[dayId]/_components/back-button";

export default async function WorkoutPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { id: workoutPlanId } = await params;
  const [planData, homeData, trainData] = await Promise.all([
    getWorkoutPlan(workoutPlanId),
    getHomeData(dayjs().format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  if (planData.status !== 200) redirect("/");

  if (
    trainData.status !== 200 ||
    !trainData.data ||
    homeData.status !== 200 ||
    !homeData.data?.activeWorkoutPlanId
  ) {
    redirect("/onboarding");
  }

  const { name = "", workoutDays = [] } = planData.data || {};

  // Sorting days by a typical logic or respecting API order. Assuming API order is correct.
  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex items-center justify-between px-5 py-4">
        <BackButton />
        <div className="flex items-center justify-center rounded-full border border-border bg-card px-4 py-1.5 shadow-sm">
          <span className="font-heading text-xs font-semibold text-foreground">
            {name}
          </span>
        </div>
        <div className="size-6" /> {/* Placeholder object for flex space-between balancing */}
      </div>

      <div className="flex flex-col gap-4 px-5 pt-4">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Cronograma
        </h2>
        
        <div className="flex flex-col gap-3">
          {workoutDays.map((day) => {
            if (day.isRest) {
              return <RestDayCard key={day.id} weekDay={day.weekDay} />;
            }
            return (
              <WorkoutDayCard
                key={day.id}
                workoutDay={day}
                href={`/workout-plans/${workoutPlanId}/days/${day.id}`}
              />
            );
          })}
        </div>
      </div>

      <BottomNav activePage="calendar" />
    </div>
  );
}
