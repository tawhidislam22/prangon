import { DocsLayout } from "@/components/docs/DocsLayout";
import { Callout } from "@/components/docs/Callout";

const sections = [
  { id: "profile-settings", title: "Profile Settings" },
  { id: "updating-password", title: "Updating Password" },
  { id: "security-overview", title: "Security Overview" },
];

export const metadata = {
  title: "Account and Security | Prangon Docs",
  description: "Manage your profile settings and secure your Prangon account.",
};

export default function AccountAndSecurityPage() {
  return (
    <DocsLayout title="Account and Security" sections={sections}>
      <h2 id="profile-settings" className="scroll-mt-24">Profile Settings</h2>
      <p>Keep your profile information up to date to ensure your team can easily identify you.</p>
      <ul>
        <li>Navigate to your avatar in the top right corner.</li>
        <li>Select <strong>Profile Settings</strong> from the dropdown menu.</li>
        <li>Update your name, email, and profile picture.</li>
        <li>Click <strong>Save Changes</strong>.</li>
      </ul>

      <h2 id="updating-password" className="scroll-mt-24">Updating Password</h2>
      <p>We recommend updating your password periodically for security reasons.</p>
      <ul>
        <li>Go to <strong>Account Settings</strong>.</li>
        <li>Select the <strong>Security</strong> tab.</li>
        <li>Click on <strong>Change Password</strong>.</li>
        <li>Enter your current password and your new password, then confirm.</li>
      </ul>

      <h2 id="security-overview" className="scroll-mt-24">Security Overview</h2>
      <p>Prangon takes your security seriously. We use industry-standard encryption to protect your data.</p>
      <Callout type="info" title="Two-Factor Authentication">
        <p>Enable Two-Factor Authentication (2FA) in your security settings for an extra layer of protection.</p>
      </Callout>
    </DocsLayout>
  );
}
