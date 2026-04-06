import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { type GetStats200ConsistencyByDay } from "@/app/_lib/api/fetch-generated";

dayjs.locale("pt-br");

interface ConsistencyHeatmapProps {
  consistencyByDay: GetStats200ConsistencyByDay;
  targetMonths: dayjs.Dayjs[];
}

export function ConsistencyHeatmap({
  consistencyByDay,
  targetMonths,
}: ConsistencyHeatmapProps) {
  return (
    <div className="flex flex-col gap-6">
      {targetMonths.map((month) => {
        const monthLabel = month.format("MMMM"); // e.g. "abril"
        const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
        
        const startOfMonth = month.startOf("month");
        const endOfMonth = month.endOf("month");

        let currentDay =
          startOfMonth.day() === 0
            ? startOfMonth.subtract(6, "day")
            : startOfMonth.subtract(startOfMonth.day() - 1, "day");

        const days = [];
        // Extract days until we pass the end of month and finish the week on a Sunday
        while (currentDay.isBefore(endOfMonth) || currentDay.day() !== 1) {
          days.push(currentDay);
          currentDay = currentDay.add(1, "day");
        }

        return (
          <div key={month.format("YYYY-MM")} className="flex flex-col gap-2 rounded-xl bg-card border border-border p-5">
            <h3 className="font-heading text-sm font-semibold text-foreground">
              {capitalizedMonth}
            </h3>
            <div className="grid grid-cols-7 gap-1">
              {/* Dia da semana labels */}
              {["S", "T", "Q", "Q", "S", "S", "D"].map((dayName, idx) => (
                <div
                  key={"label-" + idx}
                  className="flex items-center justify-center text-[10px] font-medium text-muted-foreground pb-1"
                >
                  {dayName}
                </div>
              ))}

              {days.map((date) => {
                const dateStr = date.format("YYYY-MM-DD");
                const isCurrentMonth = date.month() === month.month();
                
                if (!isCurrentMonth) {
                  return <div key={dateStr} className="size-[22px] sm:size-6" />;
                }

                const dayData = consistencyByDay[dateStr];
                const completed = dayData?.workoutDayCompleted;
                const started = dayData?.workoutDayStarted;

                // Requirement: NO visual differentiation between future/past for empty activity
                if (completed) {
                  return <div key={dateStr} className="size-[22px] sm:size-6 rounded-[4px] bg-primary" />;
                }

                if (started) {
                  return <div key={dateStr} className="size-[22px] sm:size-6 rounded-[4px] bg-primary/20" />;
                }

                return <div key={dateStr} className="size-[22px] sm:size-6 rounded-[4px] border border-border" />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
