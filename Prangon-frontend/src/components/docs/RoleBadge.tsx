import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Role = "Owner" | "Admin" | "Member";

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const roleVariants: Record<Role, "indigo" | "warning" | "neutral"> = {
    Owner: "indigo",
    Admin: "warning",
    Member: "neutral",
  };
  return (
    <Badge variant={roleVariants[role]} className={cn("ml-2 align-middle font-mono text-[10px] uppercase tracking-wider rounded-md", className)}>
      {role}
    </Badge>
  );
}
