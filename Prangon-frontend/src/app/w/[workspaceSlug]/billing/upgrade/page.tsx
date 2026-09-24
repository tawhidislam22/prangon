import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createCheckoutSessionAction } from "../actions";

import { getUserInfo } from "@/services/auth.services";
import { httpClient } from "@/lib/axios/httpClient";
import { redirect } from "next/navigation";

export default async function UpgradePlanPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const userInfo = await getUserInfo();

  try {
    const memRes = await httpClient.get<any[]>("/workspace-members", {
      params: { workspaceSlug },
    });
    const members = memRes.data || [];
    const myMembership = members.find(
      (m: any) => m.userId === userInfo?.id || m.user?.email === userInfo?.email
    );
    if (myMembership && myMembership.role !== "OWNER" && userInfo?.role !== "SUPER_ADMIN") {
      redirect(`/w/${workspaceSlug}/dashboard`);
    }
  } catch {
    // allow fallback if network error
  }

  const handleCheckout = async (priceId: string) => {
    "use server";
    await createCheckoutSessionAction(workspaceSlug, priceId);
  };

  const tiers = [
    {
      name: "Starter",
      description: "Best for early-stage teams getting their workflow running.",
      price: "$0",
      period: "forever free",
      badge: "Current",
      isPopular: false,
      buttonText: "Active Plan",
      disabled: true,
      priceId: "",
      features: [
        "Up to 5 team members",
        "3 active projects",
        "500 MB file storage",
        "Kanban task board",
        "Standard email support",
      ],
    },
    {
      name: "Pro",
      description: "For scaling companies that need seamless execution and integrations.",
      price: "$19",
      period: "per workspace / month",
      badge: "Most Popular",
      isPopular: true,
      buttonText: "Upgrade to Pro",
      disabled: false,
      priceId: "price_pro_monthly",
      features: [
        "Unlimited team members",
        "Unlimited active projects",
        "50 GB file storage",
        "Advanced role permissions (Admin, Member)",
        "Slack & GitHub integrations",
        "Priority 24/7 email & chat support",
        "Activity audit logs export",
      ],
    },
    {
      name: "Enterprise",
      description: "Custom compliance, dedicated SLAs, and automated enterprise controls.",
      price: "$49",
      period: "per workspace / month",
      badge: "Scale",
      isPopular: false,
      buttonText: "Upgrade to Enterprise",
      disabled: false,
      priceId: "price_enterprise_monthly",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "SSO / SAML 2.0 authentication",
        "Custom domain configuration",
        "Dedicated Customer Success Manager",
        "99.9% uptime SLA",
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader
        title="Upgrade Your Workspace"
        description="Choose the plan that matches your team's velocity and scale."
        breadcrumbs={[
          { label: "Dashboard", href: `/w/${workspaceSlug}/dashboard` },
          { label: "Billing", href: `/w/${workspaceSlug}/billing` },
          { label: "Upgrade" },
        ]}
        actions={
          <Link href={`/w/${workspaceSlug}/billing`}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs border-line">
              <ArrowLeft className="size-3.5" />
              <span>Back to Billing</span>
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`border flex flex-col justify-between relative transition-all ${
              tier.isPopular
                ? "border-cobalt shadow-md bg-white ring-1 ring-cobalt"
                : "border-line shadow-xs bg-white hover:border-cobalt/40"
            }`}
          >
            {tier.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cobalt text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                {tier.badge}
              </div>
            )}

            <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold font-display text-ink">
                  {tier.name}
                </CardTitle>
                {!tier.isPopular && (
                  <Badge variant="outline" className="border-line text-xs font-normal">
                    {tier.badge}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs text-graphite mt-1 min-h-[36px]">
                {tier.description}
              </CardDescription>
              <div className="pt-4">
                <span className="text-3xl font-extrabold font-display text-ink">
                  {tier.price}
                </span>
                <span className="text-xs text-graphite ml-1.5">
                  {tier.period}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-6 pt-0 flex-1">
              <div className="pt-4 border-t border-line/60 space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-graphite">
                  What's included:
                </p>
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-ink">
                    <Check className="size-3.5 text-cobalt shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-2">
              {tier.disabled ? (
                <Button disabled className="w-full text-xs font-semibold" variant="outline">
                  {tier.buttonText}
                </Button>
              ) : (
                <form action={handleCheckout.bind(null, tier.priceId)} className="w-full">
                  <Button
                    type="submit"
                    className={`w-full text-xs font-semibold gap-1.5 ${
                      tier.isPopular
                        ? "bg-cobalt hover:bg-cobalt/90 text-white shadow-xs"
                        : "bg-ink hover:bg-ink/90 text-white"
                    }`}
                  >
                    <Zap className="size-3.5 fill-current" />
                    <span>{tier.buttonText}</span>
                  </Button>
                </form>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
