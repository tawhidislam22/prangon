import {
  Rocket,
  Shield,
  FolderKanban,
  CreditCard,
  Plug,
  Cpu,
  UserCog,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface DocsNavItem {
  title: string;
  href: string;
}

export interface DocsNavSection {
  title: string;
  icon: LucideIcon;
  items: DocsNavItem[];
}

export const docsNav: DocsNavSection[] = [
  {
    title: "Getting Started",
    icon: Rocket,
    items: [
      { title: "Overview", href: "/docs/getting-started" },
      {
        title: "Creating a Workspace",
        href: "/docs/getting-started/creating-a-workspace",
      },
      {
        title: "Navigating the Dashboard",
        href: "/docs/getting-started/navigating-the-dashboard",
      },
    ],
  },
  {
    title: "Roles & Permissions",
    icon: Shield,
    items: [
      { title: "Overview", href: "/docs/roles-and-permissions" },
      {
        title: "Managing Team Members",
        href: "/docs/roles-and-permissions/managing-team-members",
      },
    ],
  },
  {
    title: "Projects & Tasks",
    icon: FolderKanban,
    items: [
      { title: "Overview", href: "/docs/projects-and-tasks" },
      {
        title: "Working with Tasks",
        href: "/docs/projects-and-tasks/working-with-tasks",
      },
    ],
  },
  {
    title: "Plans & Billing",
    icon: CreditCard,
    items: [
      { title: "Overview", href: "/docs/plans-and-billing" },
      {
        title: "Upgrading to Premium",
        href: "/docs/plans-and-billing/upgrading-to-premium",
      },
      {
        title: "Managing Your Subscription",
        href: "/docs/plans-and-billing/managing-your-subscription",
      },
    ],
  },
  {
    title: "Integrations",
    icon: Plug,
    items: [{ title: "Overview", href: "/docs/integrations" }],
  },
  {
    title: "AI Features",
    icon: Cpu,
    items: [{ title: "Overview", href: "/docs/ai-features" }],
  },
  {
    title: "Account & Security",
    icon: UserCog,
    items: [
      { title: "Overview", href: "/docs/account-and-security" },
      {
        title: "Workspace Settings",
        href: "/docs/account-and-security/workspace-settings",
      },
    ],
  },
  {
    title: "FAQ",
    icon: HelpCircle,
    items: [{ title: "Overview", href: "/docs/faq" }],
  },
];

/** Flat ordered list of all doc pages for prev/next navigation */
export const docsPageOrder: DocsNavItem[] = docsNav.flatMap((s) => s.items);

/** Get prev/next pages for a given href */
export function getDocsPageNav(href: string): {
  prev: DocsNavItem | null;
  next: DocsNavItem | null;
} {
  const index = docsPageOrder.findIndex((p) => p.href === href);
  return {
    prev: index > 0 ? docsPageOrder[index - 1] : null,
    next: index < docsPageOrder.length - 1 ? docsPageOrder[index + 1] : null,
  };
}

/** All pages as a searchable index */
export interface DocsSearchEntry {
  title: string;
  href: string;
  category: string;
  keywords: string[];
}

export const docsSearchIndex: DocsSearchEntry[] = docsNav.flatMap((section) =>
  section.items.map((item) => ({
    title: item.title === "Overview" ? section.title : item.title,
    href: item.href,
    category: section.title,
    keywords: [
      section.title.toLowerCase(),
      item.title.toLowerCase(),
      ...section.title.toLowerCase().split(/\s+/),
      ...item.title.toLowerCase().split(/\s+/),
    ],
  }))
);
