import { httpClient } from "@/lib/axios/httpClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPortalSessionAction } from "./actions";
import { CreditCard } from "lucide-react";

export default async function BillingSettingsPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;

  let subscription: any = null;
  try {
    const res = await httpClient.get<any>(`/workspaces/${workspaceSlug}/subscription`);
    if (res.success) {
      subscription = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch subscription", error);
  }

  const isSubscribed = subscription && subscription.status === "active";
  const planName = subscription?.plan?.name || "Free Plan";

  const handlePortalSession = async (formData: FormData) => {
    "use server";
    await createPortalSessionAction(workspaceSlug);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Billing Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            Manage your workspace subscription and billing details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Current Plan</p>
              <p className="text-xl font-bold text-slate-900">{planName}</p>
            </div>
            <Badge variant={isSubscribed ? "default" : "secondary"} className="text-sm">
              {isSubscribed ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          {subscription?.currentPeriodEnd && (
            <div>
              <p className="text-sm font-medium text-slate-500">Billing Period Ends</p>
              <p className="text-slate-900">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-slate-50 border-t border-slate-100 p-6">
          <form action={handlePortalSession} className="w-full">
            <Button type="submit" className="w-full sm:w-auto flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Manage Billing in Stripe
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
