import { ReactNode } from "react";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default async function PlatformAdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    redirect("/login?redirect=/admin/dashboard");
  }

  if (userInfo.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center p-6 text-white text-center">
        <div className="max-w-md space-y-4 p-8 rounded-xl border border-red-500/20 bg-red-950/20">
          <h1 className="text-xl font-bold text-red-400">Restricted Platform Console</h1>
          <p className="text-xs text-slate-300">
            Access to the Prangon Internal Staff Tool requires SUPER_ADMIN platform privileges. Your account ({userInfo.email}) is not authorized.
          </p>
          <div className="pt-2">
            <a
              href="/dashboard"
              className="inline-block text-xs font-semibold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
            >
              Return to Workspace
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayoutClient
      userEmail={userInfo.email}
      userName={userInfo.name}
      userRole={userInfo.role}
    >
      {children}
    </AdminLayoutClient>
  );
}
