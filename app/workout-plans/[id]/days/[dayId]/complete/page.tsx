import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { CircleCheck, Dumbbell, Timer } from "lucide-react";

import { authClient } from "@/app/_lib/auth-client";
import {
  getHomeData,
  getUserTrainData,
  getWorkoutDay,
} from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { Button } from "@/components/ui/button";
import { ShareToSocialButton } from "./_components/share-to-social-button";
import { ResetWorkoutButton } from "./_components/reset-workout-button";

export default async function WorkoutCompletePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; dayId: string }>;
  searchParams?: Promise<{ sessionId?: string }>;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { id: workoutPlanId, dayId } = await params;

  const [workoutDayData, homeData, trainData] = await Promise.all([
    getWorkoutDay(workoutPlanId, dayId),
    getHomeData(dayjs().format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  if (workoutDayData.status !== 200) redirect("/");

  if (
    trainData.status !== 200 ||
    !trainData.data ||
    homeData.status !== 200 ||
    !homeData.data.activeWorkoutPlanId
  ) {
    redirect("/onboarding");
  }

  const userName = session.data?.user?.name?.split(" ")[0] ?? "";
  const { name = "", coverImageUrl, estimatedDurationInSeconds = 0, exercises = [], sessions = [] } =
    workoutDayData.data || {};

  const completedSession = sessions.find((s) => s.completedAt);
  if (!completedSession) {
    redirect(`/workout-plans/${workoutPlanId}/days/${dayId}`);
  }

  const durationInMinutes = Math.round(estimatedDurationInSeconds / 60);
  const sp = (await searchParams) ?? {};

  const shareText = `Treino concluído: ${name} (${durationInMinutes}min, ${exercises.length} exercícios).`;

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background pb-24">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(600px 420px at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%), radial-gradient(520px 420px at 50% 48%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 65%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-3 px-5 pt-10">
        <div className="relative flex size-[58px] items-center justify-center rounded-full bg-primary shadow-sm">
          <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl" />
          <CircleCheck className="relative z-10 size-7 text-primary-foreground" />
        </div>

        <h1 className="font-heading text-[28px] font-semibold italic tracking-wide text-foreground">
          Treino Completo!
        </h1>
        <p className="font-heading text-sm text-muted-foreground">
          Você mandou bem hoje{userName ? `, ${userName}` : ""}!
        </p>
      </div>

      <div className="relative px-5 pt-7">
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
          <div className="relative h-[170px] w-full bg-foreground">
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt={name}
                fill
                className="object-cover opacity-60"
                priority
              />
            ) : null}

            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.85) 100%)",
              }}
            />

            <div
              className="absolute -right-14 -top-14 size-40 rounded-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 65%)",
              }}
              aria-hidden="true"
            />

            <div className="absolute bottom-5 left-5 right-5">
              <p className="font-heading text-xl font-semibold text-white">
                {name}
              </p>
              <p className="mt-1 font-heading text-xs text-white/70">
                Sessão de treino{sp.sessionId ? ` • ${sp.sessionId.slice(0, 8)}` : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4">
            <div className="rounded-2xl border border-border bg-background/40 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Timer className="size-4" />
                <span className="font-heading text-[11px] font-semibold uppercase tracking-wide">
                  Duração
                </span>
              </div>
              <p className="mt-2 font-heading text-3xl font-semibold text-foreground">
                {durationInMinutes}min
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background/40 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Dumbbell className="size-4" />
                <span className="font-heading text-[11px] font-semibold uppercase tracking-wide">
                  Exercícios
                </span>
              </div>
              <p className="mt-2 font-heading text-3xl font-semibold text-foreground">
                {exercises.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col gap-3 px-5 pt-6">
        <ShareToSocialButton title="Fit.ai" text={shareText} />

        <ResetWorkoutButton
          workoutPlanId={workoutPlanId}
          workoutDayId={dayId}
          sessionId={completedSession.id}
        />

        <Button
          asChild
          variant="ghost"
          className="h-14 rounded-full border border-border bg-background/5 font-semibold text-muted-foreground hover:bg-background/10 hover:text-foreground"
        >
          <Link href="/">Voltar para o início</Link>
        </Button>
      </div>

      <BottomNav activePage="calendar" />
    </div>
  );
}

