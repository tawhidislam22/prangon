import { DocsLayout } from "@/components/docs/DocsLayout";
import { Callout } from "@/components/docs/Callout";

const sections = [
  { id: "creating-tasks", title: "Creating Tasks" },
  { id: "assigning-members", title: "Assigning Members" },
  { id: "task-statuses", title: "Task Statuses" },
  { id: "comments", title: "Comments and Collaboration" },
];

export const metadata = {
  title: "Working with Tasks | Prangon Docs",
  description: "Learn how to create, assign, and manage tasks within a project.",
};

export default function WorkingWithTasksDocs() {
  return (
    <DocsLayout title="Working with Tasks" sections={sections}>
      <p>
        Tasks are actionable items within a project. They help you break down work and track progress to completion.
      </p>

      <h2 id="creating-tasks" className="scroll-mt-24">Creating Tasks</h2>
      <p>
        Any member with access to a project can create tasks.
      </p>
      <ol>
        <li>Open the project where you want to add a task.</li>
        <li>Click <strong>Add Task</strong> or use the keyboard shortcut <code>C</code>.</li>
        <li>Enter a title for the task.</li>
        <li>Optionally, add a rich-text description to provide context and requirements.</li>
      </ol>

      <h2 id="assigning-members" className="scroll-mt-24">Assigning Members</h2>
      <p>
        Ensure accountability by assigning tasks to specific team members.
      </p>
      <ul>
        <li>Click the <strong>Assignee</strong> field on a task.</li>
        <li>Select one or more members from the dropdown list.</li>
        <li>Assigned members will receive a notification about the new task.</li>
      </ul>

      <h2 id="task-statuses" className="scroll-mt-24">Task Statuses</h2>
      <p>
        Track the lifecycle of a task using statuses. By default, tasks move through three main stages:
      </p>
      <ul>
        <li><strong>TODO:</strong> The task is planned but work has not yet begun.</li>
        <li><strong>In Progress:</strong> Work is currently active on the task.</li>
        <li><strong>Done:</strong> The task has been completed.</li>
      </ul>
      <p>
        You can change a task's status by dragging and dropping it in a Kanban board view or selecting a new status from the dropdown menu in the task details.
      </p>

      <h2 id="comments" className="scroll-mt-24">Comments and Collaboration</h2>
      <p>
        Collaborate directly on tasks using the comment thread.
      </p>
      <ul>
        <li>Leave comments to ask questions, provide updates, or share files.</li>
        <li>Use <strong>@mentions</strong> to notify specific team members.</li>
      </ul>

      <Callout type="tip" title="Rich Text Comments">
        <p>Comments support Markdown, so you can easily format text, add lists, and share code snippets.</p>
      </Callout>
    </DocsLayout>
  );
}
