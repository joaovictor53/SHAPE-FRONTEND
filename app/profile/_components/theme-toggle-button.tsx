"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" className="w-full justify-between">
        <span className="font-heading text-base font-semibold">Alterar Tema</span>
        <div className="size-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-full justify-between"
    >
      <span className="font-heading text-base font-semibold">
        Modo {isDark ? "Claro" : "Escuro"}
      </span>
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
