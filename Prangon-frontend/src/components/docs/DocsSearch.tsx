"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { docsSearchIndex } from "@/lib/docs-nav";

export function DocsSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, [setOpen]);

  // Group by category
  const groups = Array.from(new Set(docsSearchIndex.map(i => i.category)));

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-full items-center justify-between whitespace-nowrap rounded-xl border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-xs transition-all hover:bg-card hover:text-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>Search docs...</span>
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search documentation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {groups.map(group => (
            <CommandGroup key={group} heading={group}>
              {docsSearchIndex.filter(i => i.category === group).map(item => (
                <CommandItem
                  key={item.href}
                  value={item.keywords.join(" ")}
                  onSelect={() => runCommand(() => router.push(item.href))}
                >
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
