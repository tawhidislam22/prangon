import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Role = "Owner" | "Admin" | "Member";

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const variants = {
    Owner: "bg-cobalt text-white hover:bg-cobalt/90",
    Admin: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200",
    Member: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
  };
  return (
    <Badge variant="outline" className={cn("ml-2 align-middle font-mono text-[10px] uppercase tracking-wider", variants[role], className)}>
      {role}
    </Badge>
  );
}
