import { DocsLayout } from "@/components/docs/DocsLayout";
import { RoleBadge } from "@/components/docs/RoleBadge";
import { TierBadge } from "@/components/docs/TierBadge";
import { Callout } from "@/components/docs/Callout";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "sidebar", title: "The Sidebar" },
  { id: "quick-actions", title: "Quick Actions" },
  { id: "finding-projects", title: "Finding Your Projects" },
];

export const metadata = {
  title: "Navigating the Dashboard | Prangon Docs",
  description: "Get familiar with the Prangon dashboard interface and navigation.",
};

export default function NavigatingDashboardPage() {
  return (
    <DocsLayout title="Navigating the Dashboard" sections={sections}>
      <h2 id="overview" className="scroll-mt-24">Overview</h2>
      <p>
        The Prangon dashboard is your central command center. Upon logging in, you will be greeted by an interface designed to help you quickly understand what needs your attention and easily access your ongoing work.
      </p>

      <h2 id="sidebar" className="scroll-mt-24">The Sidebar</h2>
      <p>
        The left-hand sidebar is your primary navigation tool. It remains visible across most pages within your workspace and provides access to:
      </p>
      <ul>
        <li><strong>Home:</strong> Your personal dashboard view.</li>
        <li><strong>My Tasks:</strong> A centralized list of all tasks assigned to you across all projects.</li>
        <li><strong>Projects:</strong> A directory of all projects in the workspace.</li>
        <li><strong>Members:</strong> A directory of everyone in your workspace.</li>
        <li><strong>Settings:</strong> Workspace and account configuration options.</li>
      </ul>

      <h2 id="quick-actions" className="scroll-mt-24">Quick Actions</h2>
      <p>
        At the top right of the dashboard, you will find the global "Quick Create" menu (usually indicated by a '+' icon). This menu allows you to instantly create new tasks, projects, or invite team members from anywhere in the app, without losing your current context.
      </p>

      <h2 id="finding-projects" className="scroll-mt-24">Finding Your Projects</h2>
      <p>
        To locate a specific project, you can use several methods:
      </p>
      <ol>
        <li><strong>Sidebar Pinned Projects:</strong> Your most frequently accessed or "starred" projects appear directly in the sidebar for one-click access.</li>
        <li><strong>Global Search:</strong> Use the search bar at the top of the screen (or press <code>Cmd/Ctrl + K</code>) to quickly search for projects by name.</li>
        <li><strong>Projects Page:</strong> Click "Projects" in the sidebar to view a comprehensive, sortable list of all active projects in the workspace.</li>
      </ol>

      <Callout type="info" title="Keyboard Shortcuts">
        <p>Pressing <code>?</code> anywhere in the app will bring up a list of available keyboard shortcuts to help you navigate faster.</p>
      </Callout>
    </DocsLayout>
  );
}
