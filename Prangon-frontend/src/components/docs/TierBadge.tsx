import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Tier = "Free" | "Premium";

export function TierBadge({ tier, linkToPricing = false, className }: { tier: Tier; linkToPricing?: boolean; className?: string }) {
  const badge = (
    <Badge variant={tier === "Premium" ? "indigo" : "neutral"} className={cn("ml-2 align-middle font-mono text-[10px] uppercase tracking-wider rounded-md", className)}>
      {tier}
    </Badge>
  );
  if (linkToPricing && tier === "Premium") {
    return <Link href="/pricing" className="no-underline">{badge}</Link>;
  }
  return badge;
}
