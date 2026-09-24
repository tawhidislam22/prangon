import { DocsLayout } from "@/components/docs/DocsLayout";
import { RoleBadge } from "@/components/docs/RoleBadge";
import { Callout } from "@/components/docs/Callout";

const sections = [
  { id: "prerequisites", title: "Prerequisites" },
  { id: "upgrade-process", title: "Step-by-Step Upgrade" },
];

export const metadata = {
  title: "Upgrading to Premium | Prangon Docs",
  description: "Step-by-step walkthrough for upgrading to a Premium plan via Stripe.",
};

export default function UpgradingDocs() {
  return (
    <DocsLayout title="Upgrading to Premium" sections={sections}>
      <h2 id="prerequisites" className="scroll-mt-24">
        Prerequisites <RoleBadge role="Owner" />
      </h2>
      <p>
        Only Workspace <strong>Owners</strong> have the permission to modify billing settings and upgrade the workspace to the Premium tier.
      </p>

      <h2 id="upgrade-process" className="scroll-mt-24">Step-by-Step Upgrade</h2>
      <p>
        Follow these steps to upgrade your workspace to Premium using our secure Stripe integration:
      </p>
      
      <ol>
        <li>Navigate to the <strong>Settings</strong> page from your workspace dashboard.</li>
        <li>Select the <strong>Billing</strong> tab from the sidebar.</li>
        <li>Under the "Current Plan" section, click the <strong>Upgrade to Premium</strong> button.</li>
        <li>You will be securely redirected to the <strong>Stripe Checkout</strong> page.</li>
        <li>Enter your payment details and billing address.</li>
        <li>Review the total amount and click <strong>Subscribe</strong>.</li>
      </ol>

      <Callout type="info" title="Payment Processing">
        <p>Your payment is processed securely by Stripe. Prangon does not store your credit card information directly on our servers.</p>
      </Callout>

      <p>
        Once the payment is successful, you will be redirected back to Prangon, and your workspace will immediately have access to all Premium features.
      </p>
    </DocsLayout>
  );
}
