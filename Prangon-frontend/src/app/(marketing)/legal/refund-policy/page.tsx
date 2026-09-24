import { LegalLayout } from "@/components/marketing/LegalLayout";
import { LegalSection } from "@/components/marketing/LegalSection";

export const metadata = {
  title: "Refund Policy | Prangon",
  description: "Read Prangon's refund policy for paid subscriptions.",
};

const sections = [
  { id: "overview", title: "Overview" },
  { id: "free-tier", title: "Free Tier" },
  { id: "premium-billing", title: "Premium Subscription Billing" },
  { id: "refund-eligibility", title: "Refund Eligibility" },
  { id: "trial-period", title: "Trial Period" },
  { id: "cancellation", title: "Cancellation ≠ Refund" },
  { id: "how-to-request", title: "How to Request a Refund" },
  { id: "processing-time", title: "Processing Time" },
  { id: "chargebacks", title: "Chargebacks" },
  { id: "downgrades", title: "Downgrades" },
  { id: "contact", title: "Contact" },
];

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      lastUpdated="September 18, 2025"
      contactEmail="billing@prangon.io"
      sections={sections}
    >
      <LegalSection id="overview" number={1} title="Overview">
        <p>
          We want you to be completely satisfied with your experience using Prangon. This policy explains the specific circumstances under which refunds are issued for our paid subscriptions, as well as the procedures you need to follow to request a refund.
        </p>
        <p>
          By subscribing to any of our paid services, you agree to the terms outlined in this Refund Policy. We aim to keep our billing practices as transparent and fair as possible.
        </p>
      </LegalSection>

      <LegalSection id="free-tier" number={2} title="Free Tier">
        <p>
          Prangon offers a comprehensive Free tier that allows you to use the platform at absolutely no cost. Because there is no billing associated with the Free tier, no refund questions or procedures apply.
        </p>
        <p>
          You are welcome to use the Free tier indefinitely to manage up to 3 projects with up to 5 members and 500 MB of storage, completely risk-free.
        </p>
      </LegalSection>

      <LegalSection id="premium-billing" number={3} title="Premium Subscription Billing">
        <p>
          When you upgrade to our Premium tier, you will be billed on either a monthly or an annual cycle, depending on your selection at checkout. Subscriptions are set to auto-renew by default to ensure uninterrupted access to Premium features.
        </p>
        <p>
          You will be charged via our payment processor, Stripe, on the same date for each billing period. Receipts for all successful transactions are automatically sent to your workspace billing email address.
        </p>
      </LegalSection>

      <LegalSection id="refund-eligibility" number={4} title="Refund Eligibility">
        <p>
          We offer a full refund within exactly 7 days of your <strong>initial</strong> subscription purchase, provided that the service has not been substantially used. After this initial 7-day window has passed, we do not provide refunds for the current monthly billing period.
        </p>
        <p>
          For annual plans, we offer a prorated refund if you request to cancel and refund within the first 30 days of the annual subscription. After 30 days, annual subscriptions are non-refundable for the remainder of the term. Please ensure you evaluate the platform thoroughly within these designated windows.
        </p>
      </LegalSection>

      <LegalSection id="trial-period" number={5} title="Trial Period">
        <p>
          If a free trial is offered for our Premium features, you may cancel at any time during the trial period and you will not be charged. Your access to Premium features will simply end when the trial concludes.
        </p>
        <p>
          If your trial converts to a paid subscription because it was not cancelled beforehand, the first billing charge occurs at the time of conversion. In this scenario, the 7-day refund window outlined in Section 4 begins from the date of that first paid charge.
        </p>
      </LegalSection>

      <LegalSection id="cancellation" number={6} title="Cancellation ≠ Refund">
        <p>
          Canceling your Prangon subscription prevents any future billing from occurring, but it does not automatically trigger a refund for the current billing period you have already paid for.
        </p>
        <p>
          When you cancel, you will retain full access to your Premium workspace features until the very end of your current billing period. You can manage your cancellation at any time directly from your workspace's billing settings dashboard.
        </p>
      </LegalSection>

      <LegalSection id="how-to-request" number={7} title="How to Request a Refund">
        <p>
          To request a refund under the eligibility rules described above, please email our support team directly at <strong>billing@prangon.io</strong>. You must include your workspace name, the email address associated with your account, and a brief reason for your refund request.
        </p>
        <p>
          Alternatively, you can reach out via the in-app support channel. Our team reviews all requests carefully, and our expected response time for billing inquiries is 2 business days.
        </p>
      </LegalSection>

      <LegalSection id="processing-time" number={8} title="Processing Time">
        <p>
          Once your refund request is approved by our billing team, the funds will be issued back to your original payment method via Stripe. We process these refunds promptly on our end.
        </p>
        <p>
          Please note that it typically takes between 5 and 10 business days for the refunded amount to officially appear on your bank or credit card statement. This timeline can vary depending on your financial institution's internal processing times.
        </p>
      </LegalSection>

      <LegalSection id="chargebacks" number={9} title="Chargebacks">
        {/* LEGAL REVIEW NEEDED */}
        <p>
          If you encounter an unexpected charge, we strongly encourage you to reach out to <strong>billing@prangon.io</strong> first before contacting your bank. We are always happy to investigate and resolve billing issues quickly and amicably.
        </p>
        <p>
          Filing a chargeback or payment dispute with your bank without contacting us first may result in the immediate suspension of your Prangon account and workspace access, pending a full investigation of the dispute.
        </p>
      </LegalSection>

      <LegalSection id="downgrades" number={10} title="Downgrades">
        <p>
          If you choose to downgrade your workspace from the Premium tier to the Free tier in the middle of a billing cycle, you will retain your Premium access and features until the end of the current paid billing period.
        </p>
        <p>
          We do not offer prorated refunds for the remaining time in a monthly cycle when you downgrade. Once the billing period ends, your workspace data is preserved, but you may lose access to certain features and be subject to Free tier caps (e.g., maximum 5 members, 3 projects, 500 MB storage).
        </p>
      </LegalSection>

      <LegalSection id="contact" number={11} title="Contact">
        <p>
          We are committed to providing excellent support. For any questions regarding your subscription, auto-renewal, invoices, or to initiate a refund request, please do not hesitate to contact our billing department.
        </p>
        <p>
          Email us anytime at <strong>billing@prangon.io</strong>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
