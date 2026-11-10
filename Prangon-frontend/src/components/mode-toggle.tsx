"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  className?: string;
  contentClassName?: string;
}

export function ModeToggle({ className, contentClassName }: ModeToggleProps = {}) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "size-9 rounded-lg border-border bg-card/60 hover:bg-muted text-foreground relative cursor-pointer shadow-2xs transition-colors",
            className
          )}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "w-36 p-1 rounded-xl shadow-xl border-border bg-card text-card-foreground",
          contentClassName
        )}
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer text-xs flex items-center gap-2 rounded-lg py-2"
        >
          <Sun className="size-3.5 text-amber-500" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer text-xs flex items-center gap-2 rounded-lg py-2"
        >
          <Moon className="size-3.5 text-indigo-400" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer text-xs flex items-center gap-2 rounded-lg py-2"
        >
          <Laptop className="size-3.5 text-muted-foreground" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
