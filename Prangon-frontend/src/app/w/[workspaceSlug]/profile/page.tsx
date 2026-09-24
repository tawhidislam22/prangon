import { httpClient } from "@/lib/axios/httpClient";
import { PageHeader } from "@/components/app/PageHeader";
import { ProfileForm } from "./ProfileForm";
import { getUserInfo } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function WorkspaceProfilePage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const userInfo = await getUserInfo();

  if (!userInfo) {
    redirect("/login");
  }

  let userProfile = {
    id: userInfo.id,
    name: userInfo.name,
    email: userInfo.email,
    emailVerified: false,
    role: userInfo.role,
    image: null,
  };

  try {
    const res = await httpClient.get<any>("/users/me");
    if (res.data) {
      userProfile = {
        ...userProfile,
        ...res.data,
      };
    }
  } catch {
    // fallback to userInfo from token
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Personal Profile"
        description="Manage your display name, notification preferences, and account credentials."
        breadcrumbs={[
          { label: "Dashboard", href: `/w/${workspaceSlug}/dashboard` },
          { label: "Profile" },
        ]}
      />

      <ProfileForm user={userProfile} workspaceSlug={workspaceSlug} />
    </div>
  );
}
