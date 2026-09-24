import { redirect } from "next/navigation";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{
    workspaceSlug: string;
    projectId: string;
    taskId: string;
  }>;
}) {
  const { workspaceSlug, projectId, taskId } = await params;
  redirect(`/w/${workspaceSlug}/projects/${projectId}?taskId=${taskId}`);
}
