import { DocsLayout } from "@/components/docs/DocsLayout";
import { RoleBadge } from "@/components/docs/RoleBadge";
import { TierBadge } from "@/components/docs/TierBadge";
import { Callout } from "@/components/docs/Callout";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "creating", title: "Creating the Workspace" },
  { id: "naming", title: "Naming and Slug" },
];

export const metadata = {
  title: "Creating a Workspace | Prangon Docs",
  description: "Learn how to create and set up a new workspace in Prangon.",
};

export default function CreatingWorkspacePage() {
  return (
    <DocsLayout title="Creating a Workspace" sections={sections}>
      <h2 id="overview" className="scroll-mt-24">Overview</h2>
      <p>
        Your journey with Prangon starts with a workspace. A workspace is the central hub for your organization's projects, tasks, and team members.
      </p>

      <h2 id="creating" className="scroll-mt-24">
        Creating the Workspace <RoleBadge role="Owner" />
      </h2>
      <p>
        Only users who are creating a new organization from scratch act as Workspace Owners initially. To create a new workspace:
      </p>
      <ol>
        <li>Log in to your Prangon account.</li>
        <li>From the dashboard, click on the workspace switcher in the top left corner.</li>
        <li>Select <strong>Create New Workspace</strong> from the dropdown menu.</li>
        <li>Fill out the required information in the creation modal.</li>
      </ol>

      <h3 id="naming" className="scroll-mt-24">Naming and Slug</h3>
      <p>
        When creating a workspace, you will be prompted to provide a name and a slug.
      </p>
      <ul>
        <li><strong>Workspace Name:</strong> This should be the name of your company or organization. It is visible to all members.</li>
        <li><strong>Workspace Slug:</strong> The slug is a unique identifier used in URLs to access your workspace directly (e.g., <code>prangon.com/w/acme-corp</code>). It must be unique across all Prangon workspaces and typically contains lowercase letters, numbers, and hyphens.</li>
      </ul>

      <Callout type="warning" title="Important Note">
        <p>Your workspace slug cannot be easily changed later without affecting existing links, so choose carefully!</p>
      </Callout>
    </DocsLayout>
  );
}
