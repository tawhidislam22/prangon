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
    info: { container: "bg-blue-50/50 border-blue-200 text-blue-900", icon: Info, iconColor: "text-blue-600" },
    warning: { container: "bg-amber-50/50 border-amber-200 text-amber-900", icon: AlertCircle, iconColor: "text-amber-600" },
    tip: { container: "bg-green-50/50 border-green-200 text-green-900", icon: Lightbulb, iconColor: "text-green-600" },
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
