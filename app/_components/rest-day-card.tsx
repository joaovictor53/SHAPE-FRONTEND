import { Moon } from "lucide-react";

export function RestDayCard({ weekDay }: { weekDay: string }) {
  const WEEKDAY_LABELS: Record<string, string> = {
    MONDAY: "SEGUNDA",
    TUESDAY: "TERÇA",
    WEDNESDAY: "QUARTA",
    THURSDAY: "QUINTA",
    FRIDAY: "SEXTA",
    SATURDAY: "SÁBADO",
    SUNDAY: "DOMINGO",
  };

  return (
    <div className="flex w-full items-center justify-between rounded-2xl bg-muted p-5">
      <div className="flex flex-col gap-1">
        <span className="font-heading text-xs font-medium uppercase text-muted-foreground">
          {WEEKDAY_LABELS[weekDay] ?? weekDay}
        </span>
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Descanso Ativo
        </h3>
      </div>
      <div className="flex size-10 items-center justify-center rounded-full bg-background">
        <Moon className="size-5 text-muted-foreground" />
      </div>
    </div>
  );
}
