import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocsIndexCardProps {
  title: string;
  href: string;
  icon: LucideIcon;
  itemCount: number;
  className?: string;
}

export function DocsIndexCard({ title, href, icon: Icon, itemCount, className }: DocsIndexCardProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "group relative rounded-2xl border border-border bg-card/60 backdrop-blur-md p-6 flex flex-col justify-between hover:border-primary/40 hover:bg-card/90 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300",
        className
      )}
    >
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary mb-5 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground mb-1 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-xs text-muted-foreground">{itemCount} technical article{itemCount !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-end">
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
