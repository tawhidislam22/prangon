"use client"

import { PrangonLogo } from "@/components/PrangonLogo"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getIconComponent } from "@/lib/iconMapper"
import { cn } from "@/lib/utils"
import { NavSection } from "@/types/dashboard.types"
import { UserInfo } from "@/types/user.types"
import Link from "next/link"
import { usePathname } from "next/navigation"


interface DashboardSidebarContentProps {
    userInfo : UserInfo,
    navItems : NavSection[],
    dashboardHome : string,

}



import WorkspaceSwitcher from "./WorkspaceSwitcher"

const DashboardSidebarContent = ({dashboardHome, navItems, userInfo} : DashboardSidebarContentProps) => {
    const pathname = usePathname()
  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-card overflow-y-auto">
      {/* Logo / Brand */}
      <div className="flex flex-col border-b">
        <div className="flex h-16 items-center px-6">
          <Link href={dashboardHome}>
            <PrangonLogo size={28} />
          </Link>
        </div>
        <div className="pb-4">
          <WorkspaceSwitcher />
        </div>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;
                  // Icon Mapper Function
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20 shadow-xs"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>

              {sectionId < navItems.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info At Bottom */}
      <div className="border-t px-3 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{userInfo.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {userInfo.role.toLocaleLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebarContent