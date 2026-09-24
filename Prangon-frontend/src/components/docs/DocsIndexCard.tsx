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
        "group relative flex flex-col gap-4 p-6 bg-white hover:bg-gray-50 transition-colors",
        "border-t border-l border-line sm:[&:nth-child(-n+2)]:border-t-0 sm:even:border-l-0 lg:[&:nth-child(-n+4)]:border-t-0 lg:border-l lg:first:border-l-0 lg:[&:nth-child(4n+1)]:border-l-0 border-t-0 border-l-0 sm:border-l",
        className
      )}
      style={{
          borderTopWidth: 1,
          borderLeftWidth: 1
      }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cobalt/10">
        <Icon className="h-6 w-6 text-cobalt" />
      </div>
      <div>
        <h3 className="font-display text-xl text-ink mb-1 group-hover:text-cobalt transition-colors">{title}</h3>
        <p className="text-sm text-graphite">{itemCount} article{itemCount !== 1 ? 's' : ''}</p>
      </div>
      <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-line group-hover:text-cobalt transition-colors" />
    </Link>
  );
}
