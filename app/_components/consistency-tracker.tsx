import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";
import dayjs from "dayjs";
import type { GetHomeData200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

const WEEK_DAYS = [
  { key: "MONDAY", label: "S" },
  { key: "TUESDAY", label: "T" },
  { key: "WEDNESDAY", label: "Q" },
  { key: "THURSDAY", label: "Q" },
  { key: "FRIDAY", label: "S" },
  { key: "SATURDAY", label: "S" },
  { key: "SUNDAY", label: "D" },
];

function getWeekDates(today: dayjs.Dayjs) {
  const dayOfWeek = today.day();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = today.add(mondayOffset, "day");
  return WEEK_DAYS.map((day, i) => ({
    ...day,
    date: monday.add(i, "day").format("YYYY-MM-DD"),
  }));
}

type ConsistencyTrackerProps = {
  consistencyByDay: GetHomeData200ConsistencyByDay;
  workoutStreak: number;
  today: string;
};

export function ConsistencyTracker({
  consistencyByDay,
  workoutStreak,
  today,
}: ConsistencyTrackerProps) {
  const todayDayjs = dayjs(today);
  const weekDates = getWeekDates(todayDayjs);

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-1 items-center justify-between rounded-xl border border-border bg-card p-3">
        {weekDates.map((day) => {
          const entry = consistencyByDay[day.date];
          const isToday = day.date === today;
          const isCompleted = entry?.workoutDayCompleted;
          const isStarted = entry?.workoutDayStarted;

          return (
            <div key={day.date} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                  isCompleted && "bg-primary text-primary-foreground",
                  !isCompleted && isStarted && "bg-destructive/50 text-white",
                  !isCompleted && !isStarted && isToday && "border-2 border-primary bg-transparent text-foreground",
                  !isCompleted && !isStarted && !isToday && "bg-muted text-muted-foreground"
                )}
              />
              <span className="text-[10px] text-muted-foreground">
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-primary/10 px-4 py-3">
        <Flame className="size-5 text-primary" />
        <span className="font-heading text-lg font-bold text-foreground">
          {workoutStreak}
        </span>
      </div>
    </div>
  );
}
