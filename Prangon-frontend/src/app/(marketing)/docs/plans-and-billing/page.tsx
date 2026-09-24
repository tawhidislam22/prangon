import { DocsLayout } from "@/components/docs/DocsLayout";
import { TierBadge } from "@/components/docs/TierBadge";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "free-tier", title: "Free Tier Limits" },
  { id: "feature-comparison", title: "Feature Comparison" },
];

export const metadata = {
  title: "Plans and Billing | Prangon Docs",
  description: "Overview of Free vs Premium tiers in Prangon.",
};

export default function PlansAndBillingDocs() {
  return (
    <DocsLayout title="Plans and Billing" sections={sections}>
      <h2 id="overview" className="scroll-mt-24">Overview</h2>
      <p>
        Prangon offers two primary subscription tiers to suit your team's needs: a comprehensive <strong>Free</strong> tier to get you started, and a powerful <strong>Premium</strong> tier for advanced capabilities and scalability.
      </p>

      <h2 id="free-tier" className="scroll-mt-24">
        Free Tier Limits <TierBadge tier="Free" />
      </h2>
      <p>
        Our Free tier is designed for small teams and personal projects. It includes the following limits:
      </p>
      <ul>
        <li><strong>Members:</strong> Up to 5 members per workspace.</li>
        <li><strong>Projects:</strong> Up to 3 active projects.</li>
        <li><strong>Storage:</strong> Up to 500MB of file storage.</li>
      </ul>
      <p>If you hit any of these limits, you will need to upgrade to the Premium tier to continue adding resources.</p>

      <h2 id="feature-comparison" className="scroll-mt-24">Feature Comparison</h2>
      <p>Here is a breakdown of the features available in each tier:</p>
      
      <table className="w-full text-left border-collapse mt-4">
        <thead>
          <tr>
            <th className="border-b p-2">Feature</th>
            <th className="border-b p-2">Free</th>
            <th className="border-b p-2">Premium</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-b p-2">Team Members</td>
            <td className="border-b p-2">Up to 5</td>
            <td className="border-b p-2">Unlimited</td>
          </tr>
          <tr>
            <td className="border-b p-2">Projects</td>
            <td className="border-b p-2">Up to 3</td>
            <td className="border-b p-2">Unlimited</td>
          </tr>
          <tr>
            <td className="border-b p-2">Storage</td>
            <td className="border-b p-2">500MB</td>
            <td className="border-b p-2">100GB</td>
          </tr>
          <tr>
            <td className="border-b p-2">Advanced Analytics</td>
            <td className="border-b p-2">No</td>
            <td className="border-b p-2">Yes</td>
          </tr>
          <tr>
            <td className="border-b p-2">Custom Roles</td>
            <td className="border-b p-2">No</td>
            <td className="border-b p-2">Yes</td>
          </tr>
        </tbody>
      </table>
    </DocsLayout>
  );
}
