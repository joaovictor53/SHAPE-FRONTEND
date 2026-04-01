"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, BarChart3, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "#", icon: CalendarDays, label: "Agenda" },
  { href: "#ai", icon: Sparkles, label: "AI", isCenter: true },
  { href: "#", icon: BarChart3, label: "Stats" },
  { href: "#", icon: User, label: "Perfil" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-border bg-background px-2 pb-safe">
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === pathname;
        const Icon = item.icon;

        if (item.isCenter) {
          return (
            <button
              key={item.label}
              className="flex size-14 -translate-y-3 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
            >
              <Icon className="size-6" />
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-3 text-muted-foreground transition-colors",
              isActive && "text-foreground"
            )}
          >
            <Icon className="size-6" />
          </Link>
        );
      })}
    </nav>
  );
}
