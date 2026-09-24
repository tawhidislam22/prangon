import { getAllWorkspacesAction } from "../actions";
import { WorkspaceDirectoryClient } from "./WorkspaceDirectoryClient";

export default async function PlatformWorkspacesPage() {
  const res = await getAllWorkspacesAction();
  const workspaces = res.data || [];

  return <WorkspaceDirectoryClient initialWorkspaces={workspaces} />;
}
