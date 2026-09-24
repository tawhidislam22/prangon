import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Tier = "Free" | "Premium";

export function TierBadge({ tier, linkToPricing = false, className }: { tier: Tier; linkToPricing?: boolean; className?: string }) {
  const variants = {
    Free: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
    Premium: "bg-cobalt text-white hover:bg-cobalt/90 border-transparent",
  };
  const badge = (
    <Badge variant="outline" className={cn("ml-2 align-middle font-mono text-[10px] uppercase tracking-wider", variants[tier], className)}>
      {tier}
    </Badge>
  );
  if (linkToPricing && tier === "Premium") {
    return <Link href="/pricing" className="no-underline">{badge}</Link>;
  }
  return badge;
}
