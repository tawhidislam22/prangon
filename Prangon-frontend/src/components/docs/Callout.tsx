import { AlertCircle, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  type?: "info" | "warning" | "tip";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({ type = "info", title, children, className }: CalloutProps) {
  const styles = {
    info: { container: "bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200", icon: Info, iconColor: "text-blue-600 dark:text-blue-400" },
    warning: { container: "bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200", icon: AlertCircle, iconColor: "text-amber-600 dark:text-amber-400" },
    tip: { container: "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200", icon: Lightbulb, iconColor: "text-emerald-600 dark:text-emerald-400" },
  };
  const { container, icon: Icon, iconColor } = styles[type];

  return (
    <div className={cn("my-6 flex gap-3 rounded-lg border p-4", container, className)}>
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconColor)} />
      <div className="flex-1">
        {title && <h5 className="mb-1 font-semibold leading-none tracking-tight">{title}</h5>}
        <div className="text-sm prose-p:leading-relaxed prose-a:font-medium [&>p:last-child]:mb-0 [&>p:first-child]:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
