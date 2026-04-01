import Link from "next/link";
import { Clock, Dumbbell, Calendar } from "lucide-react";
import type { GetHomeData200TodayWorkoutDay } from "@/app/_lib/api/fetch-generated";

const WEEKDAY_LABELS: Record<string, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

function formatDuration(seconds: number) {
  const minutes = Math.round(seconds / 60);
  return `${minutes}min`;
}

type WorkoutDayCardProps = {
  workoutDay: NonNullable<GetHomeData200TodayWorkoutDay>;
  href?: string;
};

export function WorkoutDayCard({ workoutDay, href }: WorkoutDayCardProps) {
  const content = (
    <div className="relative overflow-hidden rounded-2xl bg-black">
      {workoutDay.coverImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${workoutDay.coverImageUrl})` }}
        />
      )}
      {!workoutDay.coverImageUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
      )}
      <div className="relative flex flex-col gap-16 p-4">
        <div className="flex items-center gap-1.5 self-start rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <Calendar className="size-3.5" />
          <span>{WEEKDAY_LABELS[workoutDay.weekDay] ?? workoutDay.weekDay}</span>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-heading text-2xl font-semibold text-white">
            {workoutDay.name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-white/80">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {formatDuration(workoutDay.estimatedDurationInSeconds)}
            </span>
            <span className="flex items-center gap-1">
              <Dumbbell className="size-3.5" />
              {workoutDay.exercisesCount} exercícios
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
