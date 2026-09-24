import { DocsLayout } from "@/components/docs/DocsLayout";
import { RoleBadge } from "@/components/docs/RoleBadge";
import { Callout } from "@/components/docs/Callout";

const sections = [
  { id: "general-settings", title: "General Settings" },
  { id: "deleting-workspace", title: "Deleting Workspace" },
];

export const metadata = {
  title: "Workspace Settings | Prangon Docs",
  description: "Manage workspace name, logo, and general settings.",
};

export default function WorkspaceSettingsPage() {
  return (
    <DocsLayout title="Workspace Settings" sections={sections}>
      <p>Configure your workspace settings to better align with your organization's brand and needs.</p>

      <h2 id="general-settings" className="scroll-mt-24">
        General Settings <RoleBadge role="Owner" />
      </h2>
      <p>Only workspace Owners can modify general settings.</p>
      <ul>
        <li><strong>Workspace Name:</strong> Update the name of your workspace.</li>
        <li><strong>Workspace Logo:</strong> Upload a custom logo to personalize your workspace. Recommended size is 256x256px.</li>
      </ul>
      
      <h2 id="deleting-workspace" className="scroll-mt-24">
        Deleting Workspace <RoleBadge role="Owner" />
      </h2>
      <p>If you no longer need your workspace, you can delete it permanently.</p>
      <Callout type="warning" title="Warning: Permanent Action">
        <p>Deleting a workspace will permanently erase all data, projects, and tasks associated with it. This action cannot be undone.</p>
      </Callout>
      <ul>
        <li>Go to <strong>Workspace Settings</strong>.</li>
        <li>Scroll to the bottom of the General tab.</li>
        <li>Click <strong>Delete Workspace</strong> and follow the confirmation prompts.</li>
      </ul>
    </DocsLayout>
  );
}
