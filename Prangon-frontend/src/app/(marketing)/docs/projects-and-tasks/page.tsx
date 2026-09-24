import { DocsLayout } from "@/components/docs/DocsLayout";
import { RoleBadge } from "@/components/docs/RoleBadge";
import { Callout } from "@/components/docs/Callout";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "creating-projects", title: "Creating Projects" },
  { id: "managing-projects", title: "Managing Projects" },
];

export const metadata = {
  title: "Projects and Tasks | Prangon Docs",
  description: "Learn how to create and manage projects within your workspace.",
};

export default function ProjectsDocs() {
  return (
    <DocsLayout title="Projects and Tasks" sections={sections}>
      <h2 id="overview" className="scroll-mt-24">Overview</h2>
      <p>
        Projects are the core organizational units in Prangon. They allow you to group related tasks, manage timelines, and coordinate team efforts efficiently.
      </p>

      <h2 id="creating-projects" className="scroll-mt-24">
        Creating Projects <RoleBadge role="Admin" /> <RoleBadge role="Owner" />
      </h2>
      <p>
        Workspace Admins and Owners can create new projects.
      </p>
      <ol>
        <li>Navigate to the <strong>Projects</strong> tab in your workspace sidebar.</li>
        <li>Click the <strong>New Project</strong> button.</li>
        <li>Enter a project name and an optional description.</li>
        <li>Select a color or icon to easily identify the project.</li>
        <li>Click <strong>Create</strong>.</li>
      </ol>

      <h2 id="managing-projects" className="scroll-mt-24">
        Managing Projects <RoleBadge role="Admin" /> <RoleBadge role="Owner" />
      </h2>
      <p>
        Once a project is created, you can manage its settings, invite members to collaborate, and start adding tasks.
      </p>
      <ul>
        <li><strong>Edit Details:</strong> Update the project name and description at any time.</li>
        <li><strong>Archive:</strong> Archive completed or inactive projects to hide them from the main view without deleting the data.</li>
        <li><strong>Delete:</strong> Permanently remove a project and all associated tasks.</li>
      </ul>

      <Callout type="warning" title="Permanent Deletion">
        <p>Deleting a project cannot be undone. All tasks, comments, and files associated with the project will be permanently lost.</p>
      </Callout>
    </DocsLayout>
  );
}
