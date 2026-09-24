import { DocsLayout } from "@/components/docs/DocsLayout";
import { TierBadge } from "@/components/docs/TierBadge";
import { RoleBadge } from "@/components/docs/RoleBadge";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "slack", title: "Slack Integration" },
  { id: "github", title: "GitHub Integration" },
  { id: "google-drive", title: "Google Drive Integration" },
];

export const metadata = {
  title: "Integrations | Prangon Docs",
  description: "Connect Prangon with your favorite tools like Slack, GitHub, and Google Drive.",
};

export default function IntegrationsPage() {
  return (
    <DocsLayout title="Integrations" sections={sections}>
      <h2 id="overview" className="scroll-mt-24">Overview</h2>
      <p>Enhance your workflow by connecting Prangon with external tools. Integrations allow you to sync data and automate actions.</p>

      <h2 id="slack" className="scroll-mt-24">
        Slack Integration <TierBadge tier="Premium" /> <RoleBadge role="Admin" />
      </h2>
      <p>Connect Slack to receive real-time notifications about task updates and project changes.</p>
      <ul>
        <li>Navigate to <strong>Workspace Settings</strong> &gt; <strong>Integrations</strong>.</li>
        <li>Find Slack and click <strong>Connect</strong>.</li>
        <li>Authorize the Prangon app in your Slack workspace.</li>
      </ul>

      <h2 id="github" className="scroll-mt-24">
        GitHub Integration <TierBadge tier="Premium" /> <RoleBadge role="Admin" />
      </h2>
      <p>Link GitHub repositories to track commits, pull requests, and issues directly within Prangon tasks.</p>
      <ul>
        <li>Go to the <strong>Integrations</strong> page.</li>
        <li>Click <strong>Connect</strong> next to GitHub.</li>
        <li>Select the repositories you want to link.</li>
      </ul>

      <h2 id="google-drive" className="scroll-mt-24">
        Google Drive Integration <TierBadge tier="Premium" />
      </h2>
      <p>Attach files from Google Drive directly to your projects and tasks.</p>
      <ul>
        <li>Open any task or project.</li>
        <li>Click on <strong>Add Attachment</strong>.</li>
        <li>Select <strong>Google Drive</strong> and authenticate your account.</li>
      </ul>
    </DocsLayout>
  );
}
