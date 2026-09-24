import { httpClient } from "@/lib/axios/httpClient";
import Link from "next/link";
import { IWorkspace } from "@/types/workspace.types";

export default async function DashboardPage() {
  let workspaces: IWorkspace[] = [];
  try {
    const res = await httpClient.get<IWorkspace[]>("/workspaces"); // Wait, does the API return an array directly under data, or some other structure?
    workspaces = res.data || [];
  } catch {
    // Render the empty state when the API is temporarily unavailable.
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Your Workspaces</h1>
        <Link href="/workspaces/create" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition">
          + New Workspace
        </Link>
      </div>

      {workspaces.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500 mb-4">You don&apos;t have any workspaces yet.</p>
          <Link href="/workspaces/create" className="text-blue-600 hover:underline">
            Create your first workspace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Link key={workspace.id} href={`/w/${workspace.slug}/dashboard`} className="block">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <h3 className="text-xl font-bold text-slate-800">{workspace.name}</h3>
                <p className="text-sm text-slate-500 mt-2">/{workspace.slug}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
