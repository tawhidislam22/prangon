import { LegalLayout } from "@/components/marketing/LegalLayout";
import { LegalSection } from "@/components/marketing/LegalSection";

export const metadata = {
  title: "Privacy Policy | Prangon",
  description: "Privacy policy and data handling practices for the Prangon collaborative workspace platform.",
};

const sections = [
  { id: "overview", title: "Overview & Who We Are" },
  { id: "data-collected", title: "What Data We Collect" },
  { id: "data-use", title: "How We Use Data" },
  { id: "legal-basis", title: "Legal Basis for Processing" },
  { id: "tenant-isolation", title: "Tenant Isolation & Data Segregation" },
  { id: "sharing", title: "Who We Share Data With" },
  { id: "retention", title: "Data Retention" },
  { id: "security", title: "Security Measures" },
  { id: "your-rights", title: "Your Rights" },
  { id: "cookies", title: "Cookies Policy" },
  { id: "children", title: "Children's Privacy" },
  { id: "transfers", title: "International Data Transfers" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="September 18, 2025"
      contactEmail="privacy@prangon.io"
      sections={sections}
    >
      <LegalSection id="overview" number={1} title="Overview & Who We Are">
        <p>
          This Privacy Policy explains how Prangon Technologies ("Prangon," "we," "us," or "our") collects, uses, and discloses information about you when you access or use our services. This policy applies to all Prangon services, including our collaborative workspace and multi-tenant project management platform, website, and related applications (collectively, the "Services").
        </p>
        <p>
          As the data controller for your account information and billing details, Prangon Technologies is responsible for determining the purposes and means of processing that data. For workspace and tenant data that you generate and store within our platform, you remain the data controller, and we act as your data processor.
        </p>
      </LegalSection>

      <LegalSection id="data-collected" number={2} title="What Data We Collect">
        <p>We collect several categories of information to provide and improve our Services:</p>
        <ul>
          <li><strong>Account Data:</strong> Information you provide when creating an account, such as your name, email address, and password (which is securely hashed via BetterAuth).</li>
          <li><strong>Workspace/Tenant Data:</strong> Customer-generated content created within workspaces, including projects, tasks, comments, files, and integration data (e.g., from Slack, GitHub, or Google Drive).</li>
          <li><strong>Billing Data:</strong> For Premium tier subscriptions, billing information is handled securely by Stripe. We store subscription status and history, but we do not store raw credit card numbers or full financial details on our servers.</li>
          <li><strong>Usage & Analytics Data:</strong> Information about how you interact with our platform, such as login times, feature usage, and system interactions, which we track via an internal ActivityLog to ensure platform health and stability.</li>
          <li><strong>Cookies:</strong> Essential session cookies required for authentication and platform functionality, as well as minimal analytics cookies to understand broad usage patterns.</li>
        </ul>
      </LegalSection>

      <LegalSection id="data-use" number={3} title="How We Use Data">
        <p>We use the information we collect for the following core purposes:</p>
        <ul>
          <li><strong>Providing the Service:</strong> To authenticate users, manage workspaces, facilitate collaboration, and deliver the core functionality of the Prangon platform.</li>
          <li><strong>Processing Payments:</strong> To manage billing for Premium tier subscriptions, process transactions, and maintain access to paid features.</li>
          <li><strong>Communication:</strong> To send essential transactional emails, notifications, password resets, and workspace invites via Resend. We may also send product updates if you have opted in.</li>
          <li><strong>Improving the Product:</strong> To analyze usage trends, identify bugs, and develop new features based on how users interact with the platform.</li>
          <li><strong>Security & Monitoring:</strong> To maintain the integrity of our platform, detect unauthorized access, and prevent fraudulent activity using our ActivityLog system.</li>
        </ul>
      </LegalSection>

      <LegalSection id="legal-basis" number={4} title="Legal Basis for Processing">
        {/* LEGAL REVIEW NEEDED */}
        <p>
          Under applicable data protection laws, including the General Data Protection Regulation (GDPR), we rely on several legal bases to process your personal data:
        </p>
        <ul>
          <li><strong>Contract Necessity:</strong> Processing your account, workspace, and billing data is necessary to perform our contract with you and provide the Prangon Services as requested.</li>
          <li><strong>Legitimate Interest:</strong> We process usage data and activity logs based on our legitimate interest in securing our platform, understanding user behavior, and improving our services, provided these interests are not overridden by your data protection rights.</li>
          <li><strong>Consent:</strong> We rely on your consent for specific activities, such as sending promotional marketing emails or using non-essential cookies. You can withdraw your consent at any time.</li>
        </ul>
      </LegalSection>

      <LegalSection id="tenant-isolation" number={5} title="Tenant Isolation & Data Segregation">
        <p>
          As a multi-tenant platform, safeguarding your data from unauthorized cross-tenant access is a core architectural priority. Prangon ensures strict data segregation logically isolated by <code>workspaceId</code>.
        </p>
        <p>
          Access to workspace data is strictly governed by our Role-Based Access Control (RBAC) system, ensuring only users with appropriate roles (Owner, Admin, or Member) can access specific resources. Our backend architecture is designed to validate the workspace context on every request, fundamentally preventing cross-tenant data leakage. For more detailed technical information on our security practices, please visit our Security page.
        </p>
      </LegalSection>

      <LegalSection id="sharing" number={6} title="Who We Share Data With">
        <p>
          We do not sell your personal data to third parties. We only share information with trusted third-party service providers (subprocessors) necessary to operate our business and deliver the Prangon Services.
        </p>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-3 border border-gray-200 dark:border-gray-700">Provider</th>
                <th className="p-3 border border-gray-200 dark:border-gray-700">Purpose</th>
                <th className="p-3 border border-gray-200 dark:border-gray-700">Data Shared</th>
                <th className="p-3 border border-gray-200 dark:border-gray-700">Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Stripe</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Payments & Billing</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Billing details, email, transaction data</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">US</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Vercel</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Frontend Hosting</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Application data, user sessions</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">US</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Railway</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Backend Hosting & Database</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">All workspace and account data</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">US</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Resend</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Email Delivery</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Email addresses, notification content</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">US</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700">OpenAI</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">AI Features (When enabled)</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Task titles, descriptions, specific prompt data</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">US</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection id="retention" number={7} title="Data Retention">
        <p>
          We retain your account and workspace data for as long as your account remains active. Activity logs used for security monitoring are retained on a rolling 12-month basis.
        </p>
        <p>
          If you choose to delete your account or an entire workspace, the associated data enters a 30-day soft-delete period. During this window, data can be recovered if the deletion was accidental. Upon the expiration of the 30-day period, the data is permanently and irreversibly removed from our active databases and subsequently purged from our backups in accordance with our standard retention cycles.
        </p>
      </LegalSection>

      <LegalSection id="security" number={8} title="Security Measures">
        <p>
          Protecting your data is critical to our operations. We implement robust, industry-standard security measures, including:
        </p>
        <ul>
          <li><strong>Encryption in Transit:</strong> All data transmitted between your client and our servers is encrypted using TLS 1.2 or higher.</li>
          <li><strong>Encryption at Rest:</strong> Customer data stored in our databases is encrypted at rest to protect against physical data exfiltration.</li>
          <li><strong>Authentication Security:</strong> We utilize BetterAuth for secure session management and hash all user passwords using strong bcrypt algorithms.</li>
          <li><strong>Access Controls:</strong> Granular RBAC ensures users can only access data permitted by their assigned roles (Owner, Admin, Member).</li>
        </ul>
        <p>We also conduct regular internal security reviews of our infrastructure hosted on Vercel and Railway to proactively identify and mitigate vulnerabilities.</p>
      </LegalSection>

      <LegalSection id="your-rights" number={9} title="Your Rights">
        {/* LEGAL REVIEW NEEDED */}
        <p>
          Depending on your location, including under the GDPR in the European Union and the CCPA in California, you possess specific rights regarding your personal data:
        </p>
        <ul>
          <li><strong>Right to Access:</strong> You can request a copy of the personal data we hold about you.</li>
          <li><strong>Right to Correction:</strong> You can update or correct inaccurate data within your account settings.</li>
          <li><strong>Right to Deletion:</strong> You can request the deletion of your account and associated personal data.</li>
          <li><strong>Right to Data Portability:</strong> You can request an export of your workspace data in a structured, commonly used format.</li>
          <li><strong>Right to Object:</strong> You can object to the processing of your data for specific purposes, such as direct marketing.</li>
        </ul>
        <p>To exercise any of these rights, please contact our privacy team at <strong>privacy@prangon.io</strong>. We will respond to your request within the timeframe required by applicable law.</p>
      </LegalSection>

      <LegalSection id="cookies" number={10} title="Cookies Policy">
        <p>
          Prangon uses cookies and similar tracking technologies primarily to ensure the core functionality of our platform. 
        </p>
        <p>
          <strong>Essential Cookies:</strong> We rely on session and authentication cookies to keep you logged in securely and maintain your workspace context. These cookies are strictly necessary for the service to function.
        </p>
        <p>
          <strong>Analytics Cookies:</strong> We may use minimal analytics cookies to understand aggregated usage patterns and improve platform performance. Where legally required, we will ask for your explicit consent before setting these non-essential cookies.
        </p>
      </LegalSection>

      <LegalSection id="children" number={11} title="Children's Privacy">
        <p>
          The Prangon Services are intended for general business and professional use and are not directed at children under the age of 16. We do not knowingly collect personal information from individuals under 16.
        </p>
        <p>
          If we become aware that we have inadvertently collected personal data from a child under 16 without appropriate parental consent, we will take immediate steps to delete that information from our systems.
        </p>
      </LegalSection>

      <LegalSection id="transfers" number={12} title="International Data Transfers">
        {/* LEGAL REVIEW NEEDED */}
        <p>
          Prangon Technologies is based in Bangladesh, but our primary hosting infrastructure (Vercel and Railway) and subprocessor services are located in the United States. As a result, your data may be transferred to, stored, and processed in the US.
        </p>
        <p>
          If you are accessing Prangon from the European Economic Area (EEA), the UK, or other regions with laws governing data collection and use, please note that we ensure appropriate safeguards are in place for these international transfers, primarily through the execution of Standard Contractual Clauses (SCCs) with our subprocessors.
        </p>
      </LegalSection>

      <LegalSection id="changes" number={13} title="Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. 
        </p>
        <p>
          If we make material changes to how we collect or use your data, we will provide at least 30 days advance notice by sending an email to the address associated with your account and posting a prominent notification within the Prangon application. Your continued use of the Services after the effective date constitutes your acceptance of the updated policy.
        </p>
      </LegalSection>

      <LegalSection id="contact" number={14} title="Contact">
        <p>
          If you have any questions, concerns, or requests related to this Privacy Policy or our data processing practices, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> privacy@prangon.io<br />
          <strong>Data Controller:</strong> Prangon Technologies
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
