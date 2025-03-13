"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onMouseDown={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90 h-[1.2rem] w-[1.2rem]" />
      <Moon className="absolute transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0 h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
