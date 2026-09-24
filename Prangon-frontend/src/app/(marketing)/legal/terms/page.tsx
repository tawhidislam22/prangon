import { LegalLayout } from "@/components/marketing/LegalLayout";
import { LegalSection } from "@/components/marketing/LegalSection";

export const metadata = {
  title: "Terms of Service | Prangon",
  description: "Terms of Service for Prangon Technologies' SaaS platform.",
};

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "description", title: "Description of Service" },
  { id: "account", title: "Account Registration & Eligibility" },
  { id: "workspace", title: "Workspace Ownership & Roles" },
  { id: "content", title: "Your Content & Data" },
  { id: "billing", title: "Subscription Plans & Billing" },
  { id: "free-tier", title: "Free Tier Limits" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "integrations", title: "Third-Party Integrations" },
  { id: "ai-features", title: "AI Features" },
  { id: "ip", title: "Intellectual Property" },
  { id: "termination", title: "Suspension & Termination" },
  { id: "disclaimers", title: "Disclaimers" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "indemnification", title: "Indemnification" },
  { id: "law", title: "Governing Law & Disputes" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact" }
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="September 18, 2025"
      contactEmail="legal@prangon.io"
      sections={sections}
    >
      <LegalSection id="acceptance" number={1} title="Acceptance of Terms">
        <p>By accessing, registering for, or using the Prangon SaaS platform and services provided by Prangon Technologies, you agree to comply with and be bound by these Terms of Service. This agreement constitutes a legally binding contract between you and Prangon Technologies.</p>
        <p>If you are registering for a Prangon workspace on behalf of a company, organization, or other legal entity, you act as the designated Workspace Owner. By doing so, you represent and warrant that you have the express authority to legally bind that entity to these Terms. In such cases, "you" and "your" will refer to that organizational entity.</p>
        <p>If you do not possess such authority, or if you do not agree with any part of these Terms, you must not accept this agreement and may not access or use the Prangon platform.</p>
      </LegalSection>

      <LegalSection id="description" number={2} title="Description of Service">
        <p>Prangon is a comprehensive multi-tenant collaborative workspace and project management platform. Our services include, but are not limited to, the provisioning of isolated workspaces, task assignment and tracking, real-time collaboration features, file storage, and integrated communication tools.</p>
        <p>The platform is provided on a software-as-a-service (SaaS) basis. Prangon Technologies manages the underlying infrastructure—hosted on platforms like Vercel and Railway—while ensuring strict multi-tenant isolation via dedicated workspace IDs. We continuously update and improve the platform, which means features may be added, modified, or removed over time.</p>
      </LegalSection>

      <LegalSection id="account" number={3} title="Account Registration & Eligibility">
        <p>To use the Prangon platform, you must create a user account by providing accurate, current, and complete information, including a valid email address and password via our BetterAuth system. You are responsible for safeguarding your login credentials and for all activities that occur under your account.</p>
        <p>By registering, you confirm that you are at least 16 years of age or the age of digital consent in your jurisdiction, whichever is older. Users under this age requirement are strictly prohibited from using the platform.</p>
        <p>We enforce a strict policy of one account per individual person. Account sharing is prohibited. Additionally, only authorized individuals may create a new workspace within Prangon, and they must provide true organizational details where applicable.</p>
      </LegalSection>

      <LegalSection id="workspace" number={4} title="Workspace Ownership & Roles">
        <p>Prangon utilizes a role-based access control (RBAC) system within each isolated workspace. The primary roles include Owner, Admin, and Member. The individual who initially creates a workspace is designated as the Workspace Owner.</p>
        <p>The Workspace Owner retains ultimate authority and control over the workspace, including billing configuration, user management, and workspace deletion. Admins possess elevated privileges to manage projects and members, while Members have access tailored to everyday collaboration tasks.</p>
        <p>The Workspace Owner is strictly responsible for ensuring that all activities occurring within their workspace comply with these Terms of Service, applicable laws, and privacy regulations. If a dispute regarding workspace ownership arises, Prangon Technologies will determine ownership based on the email address associated with the original workspace creation.</p>
      </LegalSection>

      <LegalSection id="content" number={5} title="Your Content & Data">
        <p>You retain full ownership of all data, text, files, comments, tasks, projects, and other content that you or your workspace members submit, upload, or create within your Prangon workspace ("Your Content"). Prangon Technologies claims no intellectual property rights over your proprietary data.</p>
        <p>By using the platform, you grant Prangon Technologies a worldwide, non-exclusive, royalty-free license to host, store, process, display, and transmit Your Content solely for the purpose of providing, maintaining, and improving the service for your specific workspace.</p>
        <p>We employ standard security measures to protect Your Content. However, you are responsible for maintaining backups of your data. Upon the deletion of your account or workspace, your data will enter a 30-day soft-delete phase, after which it will be permanently eradicated from our primary active systems.</p>
      </LegalSection>

      <LegalSection id="billing" number={6} title="Subscription Plans & Billing">
        <p>Prangon offers a Free tier as well as Premium subscription plans available on a monthly or annual billing cycle. All payments are processed securely through our authorized payment processor, Stripe. By subscribing to a Premium plan, you authorize Prangon Technologies and Stripe to charge your designated payment method on a recurring basis.</p>
        <p>Subscriptions automatically renew at the end of each billing cycle unless canceled prior to the renewal date. We offer a 7-day refund window from the date of your initial Premium subscription purchase. Refund requests made after this period will not be honored, and cancellations will take effect at the end of the current paid term.</p>
        <p>Prangon Technologies reserves the right to adjust subscription pricing. We will provide active subscribers with a minimum of 30 days' advance notice via email to the Workspace Owner regarding any pricing changes. Continued use of the platform after the price change takes effect constitutes your agreement to the new rates.</p>
      </LegalSection>

      <LegalSection id="free-tier" number={7} title="Free Tier Limits">
        <p>To ensure fair usage and optimal performance across our platform, the Prangon Free tier is strictly subject to predefined limits. Workspaces on the Free tier are restricted to a maximum of 5 members, 3 active projects, and 500 MB of total file storage.</p>
        <p>These limits are strictly enforced by our system. If your workspace exceeds or attempts to exceed these limitations, you will be prompted to upgrade to a Premium plan. The Premium tier removes these restrictions, offering unlimited members, unlimited projects, 50 GB of storage, and priority support.</p>
        <p>Prangon Technologies reserves the right to modify the Free tier limitations at any time without prior notice, provided that such modifications do not negatively impact the already consumed resources of existing Free tier users without fair warning.</p>
      </LegalSection>

      <LegalSection id="acceptable-use" number={8} title="Acceptable Use">
        <p>When using the Prangon platform, you agree to adhere to our Acceptable Use standards. You must not use our services to create, upload, store, or distribute any illegal, defamatory, harmful, or explicitly abusive content.</p>
        <p>You agree not to bypass, exploit, or attempt to compromise our multi-tenant isolation protocols, access control mechanisms, or overall system security. Engaging in reverse engineering, scraping, automated unauthorized data extraction, or network stress testing without our express written consent is strictly prohibited.</p>
        <p>Furthermore, you must not abuse other tenants, spam users, or use the platform to distribute malware or phishing attempts. Violation of these acceptable use terms will result in immediate suspension or termination of your workspace and user account without a refund.</p>
      </LegalSection>

      <LegalSection id="integrations" number={9} title="Third-Party Integrations">
        <p>Prangon offers integrations with third-party services such as Slack, GitHub, Google Drive, and Stripe to enhance your workspace productivity. By enabling and using these integrations, you grant Prangon permission to transmit and receive data from these external services on your behalf.</p>
        <p>Your use of any third-party integration is governed strictly by the terms of service and privacy policies of the respective third-party provider. We strongly encourage you to review those agreements before enabling integrations within your workspace.</p>
        <p>Prangon Technologies is not responsible for any downtime, data loss, or service interruption caused by a third-party provider. We disclaim all liability arising from your use of external services, and we reserve the right to modify or deprecate specific integrations at our discretion.</p>
      </LegalSection>

      <LegalSection id="ai-features" number={10} title="AI Features">
        <p>Prangon is actively developing artificial intelligence features powered by third-party providers such as OpenAI. When officially launched, these AI tools will be offered on an opt-in basis, allowing Workspace Owners to decide whether to enable AI assistance within their workspace.</p>
        <p>You acknowledge that AI-generated suggestions, summaries, and content are provided for assistive purposes only. Prangon Technologies does not guarantee the accuracy, completeness, or reliability of any output generated by these AI features. You remain fully responsible for reviewing and validating AI-generated content before relying on it.</p>
        <p>Data processed by our AI features will be handled in strict accordance with our Privacy Policy. We ensure that our agreements with AI providers prohibit the use of your proprietary workspace data to train their generalized public models.</p>
      </LegalSection>

      <LegalSection id="ip" number={11} title="Intellectual Property">
        <p>The Prangon platform, including its software architecture, source code, user interface designs, logos, branding, and aggregated analytics, are the exclusive intellectual property of Prangon Technologies and are protected by applicable copyright, trademark, and intellectual property laws.</p>
        <p>While you retain full ownership of Your Content, Prangon grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the platform strictly in accordance with these Terms. You may not copy, modify, distribute, or create derivative works based on the Prangon platform.</p>
        <p>Any use of the Prangon name, logos, or trademarks for commercial purposes or in a manner that implies endorsement requires prior written consent from Prangon Technologies.</p>
      </LegalSection>

      <LegalSection id="termination" number={12} title="Suspension & Termination">
        <p>You may terminate your account and workspace at any time through the billing and workspace management settings. Upon cancellation, your subscription will remain active until the end of the current billing cycle, after which you will be downgraded or your access revoked.</p>
        <p>Prangon Technologies reserves the right to suspend or terminate your access to the service immediately and without notice under certain conditions. These include non-payment of subscription fees, suspected abuse of the platform, severe violations of the Acceptable Use policy, or actions that pose a security risk to the infrastructure or other tenants.</p>
        <p>In the event of termination, you will be provided a 30-day data export window to retrieve your workspace information, provided the termination was not due to a severe security or legal violation. Following this 30-day soft-delete period, all associated data will be permanently deleted.</p>
      </LegalSection>

      <LegalSection id="disclaimers" number={13} title="Disclaimers">
        <p>The Prangon platform and all related services are provided on an "as is" and "as available" basis. Prangon Technologies expressly disclaims all warranties of any kind, whether express, implied, or statutory, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
        <p>We do not warrant that the service will be uninterrupted, error-free, entirely secure, or free from viruses or other harmful components. Unless a specific, mutually signed Service Level Agreement (SLA) is in place, Prangon Technologies makes no guarantees regarding platform uptime or performance metrics.</p>
      </LegalSection>

      <LegalSection id="liability" number={14} title="Limitation of Liability">
        {/* LEGAL REVIEW NEEDED */}
        <p>To the maximum extent permitted by applicable law, in no event shall Prangon Technologies, its directors, employees, partners, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages. This includes, without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your access to, use of, or inability to access or use the platform.</p>
        <p>In all cases, the aggregate liability of Prangon Technologies for any claims arising out of or relating to these Terms or the use of the service shall not exceed the total amount of fees you have paid to Prangon Technologies in the twelve (12) months immediately preceding the event giving rise to the claim.</p>
        <p>These limitations apply regardless of the legal theory upon which a claim is based—whether in contract, tort, strict liability, or otherwise—even if Prangon Technologies has been advised of the possibility of such damages.</p>
      </LegalSection>

      <LegalSection id="indemnification" number={15} title="Indemnification">
        <p>You agree to defend, indemnify, and hold harmless Prangon Technologies, its officers, directors, employees, and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from your use of and access to the platform.</p>
        <p>This indemnification specifically covers claims resulting from your violation of any term of these Terms of Service, your infringement of any third-party rights (including intellectual property or privacy rights), or any claim that Your Content caused damage to a third party or violated applicable laws, such as the uploading of illegal or unauthorized materials.</p>
      </LegalSection>

      <LegalSection id="law" number={16} title="Governing Law & Disputes">
        <p>These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.</p>
        <p>Any disputes, controversies, or claims arising out of or relating to these Terms, or the breach thereof, shall be resolved through binding arbitration. The arbitration shall be conducted in Dhaka, Bangladesh, by a neutral arbitrator in accordance with the standard arbitration procedures applicable in that jurisdiction.</p>
        <p>Before initiating arbitration, both parties agree to attempt to resolve the dispute informally by contacting each other via the designated contact channels for a period of no less than 30 days.</p>
      </LegalSection>

      <LegalSection id="changes" number={17} title="Changes to Terms">
        <p>Prangon Technologies reserves the right, at our sole discretion, to modify or replace these Terms of Service at any time. We continually evolve our platform, and our legal agreements must reflect those operational realities.</p>
        <p>For any material changes to these Terms, we will provide you with at least 30 days' advance notice prior to the new terms taking effect. This notice will be delivered via an email sent to the Workspace Owner and through a prominent in-app banner within the platform.</p>
        <p>Your continued use of the Prangon platform after the effective date of any changes constitutes your acceptance of the newly revised Terms of Service. If you do not agree to the new terms, you must stop using the platform and cancel your account.</p>
      </LegalSection>

      <LegalSection id="contact" number={18} title="Contact">
        <p>If you have any questions, concerns, or inquiries regarding these Terms of Service, or if you need to serve legal notices, please contact our legal department directly.</p>
        <p>You can reach us via email at <strong>legal@prangon.io</strong>. For matters specifically related to payments or data privacy, you may also direct your inquiries to <strong>billing@prangon.io</strong> and <strong>privacy@prangon.io</strong>, respectively.</p>
        <p>Our designated legal correspondence team operates during standard business hours in Bangladesh and will endeavor to respond to all legitimate inquiries in a timely and professional manner.</p>
      </LegalSection>
    </LegalLayout>
  );
}
