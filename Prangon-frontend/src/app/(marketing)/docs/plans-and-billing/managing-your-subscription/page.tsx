import { DocsLayout } from "@/components/docs/DocsLayout";
import { RoleBadge } from "@/components/docs/RoleBadge";
import { Callout } from "@/components/docs/Callout";

const sections = [
  { id: "viewing-invoices", title: "Viewing Invoices" },
  { id: "downgrading", title: "Downgrading to Free" },
  { id: "cancellation", title: "Canceling Subscription" },
];

export const metadata = {
  title: "Managing Your Subscription | Prangon Docs",
  description: "Learn how to manage, downgrade, or cancel your Prangon subscription.",
};

export default function ManagingSubscriptionDocs() {
  return (
    <DocsLayout title="Managing Your Subscription" sections={sections}>
      <p>
        Workspace Owners can manage all aspects of their billing and subscription settings from the Billing dashboard.
      </p>

      <h2 id="viewing-invoices" className="scroll-mt-24">
        Viewing Invoices <RoleBadge role="Owner" />
      </h2>
      <p>
        To access your past invoices and billing history:
      </p>
      <ol>
        <li>Go to Workspace <strong>Settings</strong> &gt; <strong>Billing</strong>.</li>
        <li>Click on <strong>Manage Subscription</strong> to open the Stripe Customer Portal.</li>
        <li>Scroll down to the <strong>Invoice History</strong> section to download PDF receipts.</li>
      </ol>

      <h2 id="downgrading" className="scroll-mt-24">
        Downgrading to Free <RoleBadge role="Owner" />
      </h2>
      <p>
        If you wish to move from Premium back to the Free tier, you can downgrade your plan. 
      </p>
      <Callout type="warning" title="Downgrade Restrictions">
        <p>Before downgrading, ensure your workspace meets the Free tier limits (e.g., maximum 5 members, 3 projects, 500MB storage). If you exceed these limits, the downgrade option will be disabled until you reduce your usage.</p>
      </Callout>

      <h2 id="cancellation" className="scroll-mt-24">
        Canceling Subscription <RoleBadge role="Owner" />
      </h2>
      <p>
        You can cancel your Premium subscription at any time. When you cancel, your subscription will not renew at the end of the current billing cycle.
      </p>
      
      <Callout type="info" title="End of Period Access">
        <p>Cancellation means your access to Premium features continues until the end of your current paid billing period. You will not lose access immediately.</p>
      </Callout>

      <ol>
        <li>Navigate to the Stripe Customer Portal via the <strong>Manage Subscription</strong> button in Billing Settings.</li>
        <li>Select <strong>Cancel Plan</strong>.</li>
        <li>Confirm your cancellation.</li>
      </ol>
    </DocsLayout>
  );
}
