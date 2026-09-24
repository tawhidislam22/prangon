import { DocsLayout } from "@/components/docs/DocsLayout";
import { RoleBadge } from "@/components/docs/RoleBadge";
import { TierBadge } from "@/components/docs/TierBadge";
import { Callout } from "@/components/docs/Callout";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "roles-comparison", title: "Roles Comparison" },
];

export const metadata = {
  title: "Roles and Permissions | Prangon Docs",
  description: "Understand the different roles and access levels in Prangon workspaces.",
};

export default function RolesPermissionsPage() {
  return (
    <DocsLayout title="Roles and Permissions" sections={sections}>
      <h2 id="overview" className="scroll-mt-24">Overview</h2>
      <p>
        Prangon uses a role-based access control system to ensure that team members have the appropriate level of access to manage work without compromising workspace security or administrative settings. Every user in a workspace is assigned one of three roles: Owner, Admin, or Member.
      </p>

      <h2 id="roles-comparison" className="scroll-mt-24">Roles Comparison</h2>
      <p>
        Below is a detailed breakdown of the capabilities associated with each workspace role.
      </p>

      <div className="overflow-x-auto my-8">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Permission</th>
              <th scope="col" className="px-6 py-3 text-center font-semibold text-gray-900 dark:text-gray-100">Member</th>
              <th scope="col" className="px-6 py-3 text-center font-semibold text-gray-900 dark:text-gray-100">Admin</th>
              <th scope="col" className="px-6 py-3 text-center font-semibold text-gray-900 dark:text-gray-100">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">View and complete tasks</td>
              <td className="px-6 py-4 text-center">✅</td>
              <td className="px-6 py-4 text-center">✅</td>
              <td className="px-6 py-4 text-center">✅</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Create projects and tasks</td>
              <td className="px-6 py-4 text-center">✅</td>
              <td className="px-6 py-4 text-center">✅</td>
              <td className="px-6 py-4 text-center">✅</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Invite new Members</td>
              <td className="px-6 py-4 text-center">❌</td>
              <td className="px-6 py-4 text-center">✅</td>
              <td className="px-6 py-4 text-center">✅</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Remove Members</td>
              <td className="px-6 py-4 text-center">❌</td>
              <td className="px-6 py-4 text-center">✅</td>
              <td className="px-6 py-4 text-center">✅</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Manage billing & subscription</td>
              <td className="px-6 py-4 text-center">❌</td>
              <td className="px-6 py-4 text-center">❌</td>
              <td className="px-6 py-4 text-center">✅</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Delete the workspace</td>
              <td className="px-6 py-4 text-center">❌</td>
              <td className="px-6 py-4 text-center">❌</td>
              <td className="px-6 py-4 text-center">✅</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Change roles of other users</td>
              <td className="px-6 py-4 text-center">❌</td>
              <td className="px-6 py-4 text-center">❌</td>
              <td className="px-6 py-4 text-center">✅</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info" title="Multiple Owners">
        <p>A workspace can have multiple Owners, but there must always be at least one Owner.</p>
      </Callout>
    </DocsLayout>
  );
}
