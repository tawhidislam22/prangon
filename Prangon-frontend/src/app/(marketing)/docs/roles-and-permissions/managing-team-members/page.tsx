import { DocsLayout } from "@/components/docs/DocsLayout";
import { RoleBadge } from "@/components/docs/RoleBadge";
import { TierBadge } from "@/components/docs/TierBadge";
import { Callout } from "@/components/docs/Callout";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "inviting-members", title: "Inviting Members" },
  { id: "changing-roles", title: "Changing Roles" },
  { id: "removing-members", title: "Removing Members" },
];

export const metadata = {
  title: "Managing Team Members | Prangon Docs",
  description: "Learn how to invite, update, and remove members in your Prangon workspace.",
};

export default function ManagingTeamMembersPage() {
  return (
    <DocsLayout title="Managing Team Members" sections={sections}>
      <h2 id="overview" className="scroll-mt-24">Overview</h2>
      <p>
        As your team grows, you will need to add new members to your workspace, adjust their permissions, or occasionally remove users who no longer need access. This page covers all aspects of member management.
      </p>

      <h2 id="inviting-members" className="scroll-mt-24">
        Inviting Members <RoleBadge role="Admin" /> <RoleBadge role="Owner" />
      </h2>
      <p>
        Workspace Admins and Owners can invite new users to the workspace.
      </p>
      <ol>
        <li>Navigate to the <strong>Settings</strong> page via the sidebar.</li>
        <li>Select the <strong>Members</strong> tab.</li>
        <li>Click the <strong>Invite Member</strong> button.</li>
        <li>Enter the email addresses of the users you wish to invite (separated by commas).</li>
        <li>Select the initial role (Member or Admin) to grant them.</li>
        <li>Click <strong>Send Invites</strong>. The users will receive an email invitation to join your workspace.</li>
      </ol>

      <h2 id="changing-roles" className="scroll-mt-24">
        Changing Roles <RoleBadge role="Owner" />
      </h2>
      <p>
        Only Workspace Owners have the authority to change the roles of existing members.
      </p>
      <ol>
        <li>Go to <strong>Settings &gt; Members</strong>.</li>
        <li>Locate the user whose role you want to change.</li>
        <li>Click on their current role badge next to their name.</li>
        <li>Select the new role from the dropdown menu. The change takes effect immediately.</li>
      </ol>

      <Callout type="warning" title="Demoting Owners">
        <p>If you are an Owner and change your own role to Admin or Member, you will lose Owner privileges instantly. Ensure there is at least one other active Owner before doing this.</p>
      </Callout>

      <h2 id="removing-members" className="scroll-mt-24">
        Removing Members <RoleBadge role="Admin" /> <RoleBadge role="Owner" />
      </h2>
      <p>
        Admins and Owners can revoke a user's access to the workspace. Note that Admins cannot remove Owners.
      </p>
      <ol>
        <li>Go to <strong>Settings &gt; Members</strong>.</li>
        <li>Find the user you wish to remove.</li>
        <li>Click the <strong>...</strong> (more options) menu next to their name.</li>
        <li>Select <strong>Remove from Workspace</strong> and confirm the action.</li>
      </ol>

      <p>
        When a member is removed, their tasks and comments remain intact, but their assignments will show as an inactive user until re-assigned.
      </p>
    </DocsLayout>
  );
}
