import { DocsLayout } from "@/components/docs/DocsLayout";
import { RoleBadge } from "@/components/docs/RoleBadge";
import { TierBadge } from "@/components/docs/TierBadge";
import { Callout } from "@/components/docs/Callout";

const sections = [
  { id: "welcome", title: "Welcome to Prangon" },
  { id: "core-concepts", title: "Core Concepts" },
  { id: "workspaces", title: "Workspaces" },
  { id: "projects", title: "Projects" },
  { id: "tasks", title: "Tasks" },
];

export const metadata = {
  title: "Getting Started | Prangon Docs",
  description: "Learn the basic concepts of Prangon including Workspaces, Projects, and Tasks.",
};

export default function GettingStartedPage() {
  return (
    <DocsLayout title="Getting Started" sections={sections}>
      <h2 id="welcome" className="scroll-mt-24">Welcome to Prangon</h2>
      <p>
        Prangon is a modern project management platform designed to help your team organize work, collaborate efficiently, and track progress with ease. Whether you are a small startup or a large enterprise, Prangon scales with your needs.
      </p>

      <h2 id="core-concepts" className="scroll-mt-24">Core Concepts</h2>
      <p>
        To get the most out of Prangon, it is helpful to understand the basic organizational structure of the platform. Prangon is built around three main pillars: Workspaces, Projects, and Tasks.
      </p>

      <h3 id="workspaces" className="scroll-mt-24">Workspaces</h3>
      <p>
        A <strong>Workspace</strong> is the highest level of organization in Prangon. It typically represents your company or organization. All your team members, projects, and billing settings live within a workspace.
      </p>

      <h3 id="projects" className="scroll-mt-24">Projects</h3>
      <p>
        Inside a workspace, work is divided into <strong>Projects</strong>. A project is a collection of related tasks focused on a specific goal, feature, or department (e.g., "Marketing Site Redesign", "Q3 Roadmap").
      </p>

      <h3 id="tasks" className="scroll-mt-24">Tasks</h3>
      <p>
        The fundamental unit of work in Prangon is a <strong>Task</strong>. Tasks live inside projects and represent actionable items. You can assign tasks to team members, set due dates, add descriptions, and track their status from "To Do" to "Done".
      </p>

      <Callout type="info" title="Tip">
        <p>You can belong to multiple workspaces using the same email address, but each workspace operates independently.</p>
      </Callout>
    </DocsLayout>
  );
}
