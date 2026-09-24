import { DocsLayout } from "@/components/docs/DocsLayout";

const sections = [
  { id: "general", title: "General Questions" },
  { id: "roles", title: "Roles & Permissions" },
  { id: "billing", title: "Billing & Plans" },
  { id: "privacy", title: "Privacy & Data" },
];

export const metadata = {
  title: "FAQ | Prangon Docs",
  description: "Frequently asked questions about Prangon.",
};

export default function FAQPage() {
  return (
    <DocsLayout title="Frequently Asked Questions" sections={sections}>
      <h2 id="general" className="scroll-mt-24">General Questions</h2>
      <h3 id="what-is-prangon" className="scroll-mt-24">What is Prangon?</h3>
      <p>Prangon is a comprehensive project management and collaboration platform designed for modern teams.</p>

      <h2 id="roles" className="scroll-mt-24">Roles & Permissions</h2>
      <h3 id="admin-vs-owner" className="scroll-mt-24">What is the difference between an Admin and an Owner?</h3>
      <p>The <strong>Owner</strong> has complete control over the workspace, including billing, deleting the workspace, and transferring ownership. <strong>Admins</strong> can manage members, projects, and general workspace settings, but cannot delete the workspace or access billing details.</p>

      <h2 id="billing" className="scroll-mt-24">Billing & Plans</h2>
      <h3 id="downgrade" className="scroll-mt-24">Can I downgrade my plan?</h3>
      <p>Yes, you can downgrade from Premium to Free at any time. Changes will take effect at the end of your current billing cycle. You will lose access to premium features like AI tools and advanced integrations.</p>

      <h2 id="privacy" className="scroll-mt-24">Privacy & Data</h2>
      <h3 id="remove-member-data" className="scroll-mt-24">What happens to data if I remove a member?</h3>
      <p>When you remove a member from your workspace, their account is deactivated, but all the tasks, comments, and files they created will remain intact and assigned to them as a former member.</p>
      
      <h3 id="data-visibility" className="scroll-mt-24">Is our data visible to other companies?</h3>
      <p>No. Your data is strictly isolated to your workspace. We do not share your project data with other companies, and our AI features are securely processed without training public models on your private information.</p>
    </DocsLayout>
  );
}
