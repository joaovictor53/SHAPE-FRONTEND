import { redirect } from "next/navigation";
import { headers } from "next/headers";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import { getHomeData } from "@/app/_lib/api/fetch-generated";
import { WorkoutDayCard } from "@/app/_components/workout-day-card";
import { ConsistencyTracker } from "@/app/_components/consistency-tracker";
import { BottomNav } from "@/app/_components/bottom-nav";

export default async function HomePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs().format("YYYY-MM-DD");
  const homeData = await getHomeData(today);

  if (homeData.status !== 200) redirect("/auth");

  const { todayWorkoutDay, consistencyByDay, workoutStreak, activeWorkoutPlanId } =
    homeData.data;

  const userName = session.data.user.name?.split(" ")[0] ?? "Atleta";

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <section className="relative overflow-hidden bg-black px-5 pb-8 pt-12">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black opacity-90" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">Olá,</p>
            <h1 className="font-heading text-2xl font-bold text-white">
              {userName}
            </h1>
            <p className="mt-0.5 text-sm text-white/70">
              Bora treinar hoje?
            </p>
          </div>
          <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Começar!
          </button>
        </div>
      </section>

      <main className="flex flex-1 flex-col gap-6 px-5 pt-6">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Consistência
            </h2>
            <button className="text-sm font-medium text-primary">
              Ver histórico
            </button>
          </div>
          <ConsistencyTracker
            consistencyByDay={consistencyByDay}
            workoutStreak={workoutStreak}
            today={today}
          />
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Treino de Hoje
            </h2>
            <button className="text-sm font-medium text-primary">
              Ver treinos
            </button>
          </div>
          {todayWorkoutDay ? (
            <WorkoutDayCard
              workoutDay={todayWorkoutDay}
              href={`/workout-plans/${activeWorkoutPlanId}/days/${todayWorkoutDay.id}`}
            />
          ) : (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-border bg-muted/50 p-8">
              <p className="text-sm text-muted-foreground">
                Dia de descanso, Ufa !
              </p>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
