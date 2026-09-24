"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("localhost", "127.0.0.1");

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  const cookieHeader = [
    accessToken ? `accessToken=${accessToken}` : "",
    sessionToken ? `better-auth.session_token=${sessionToken}` : "",
  ]
    .filter(Boolean)
    .join("; ");

  return {
    "Content-Type": "application/json",
    ...(cookieHeader ? { Cookie: cookieHeader } : {}),
  };
}

export async function getOnboardingDraftAction() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API_URL}/users/me/onboarding-draft`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Failed to fetch onboarding draft:", error);
    return null;
  }
}

export async function updateOnboardingDraftAction(draftPayload: Record<string, any>) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API_URL}/users/me/onboarding-draft`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(draftPayload),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || "Failed to update draft" };
    }

    const json = await res.json();
    return { success: true, data: json.data };
  } catch (error: any) {
    console.error("Error updating onboarding draft:", error);
    return { success: false, message: error.message || "Network error" };
  }
}

export async function createCheckoutSessionAction(priceId?: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API_URL}/payments/create-checkout-session`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        priceId: priceId || undefined,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/onboarding/workspace?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/onboarding/plan?canceled=true`,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || "Failed to initiate payment" };
    }

    const json = await res.json();
    return { success: true, url: json.data?.url };
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return { success: false, message: error.message || "Network error" };
  }
}

export async function createOnboardingWorkspaceAction(payload: {
  name: string;
  slug: string;
  industry?: string;
  companySize?: string;
  tier?: string;
  onboardingStatus?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API_URL}/workspaces`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || "Failed to create workspace" };
    }

    const json = await res.json();
    return { success: true, data: json.data };
  } catch (error: any) {
    console.error("Error creating workspace:", error);
    return { success: false, message: error.message || "Network error" };
  }
}

export async function completeOnboardingAction(workspaceSlug: string) {
  try {
    const headers = await getAuthHeaders();
    let res = await fetch(`${BASE_API_URL}/workspaces/${workspaceSlug}/onboarding`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "COMPLETED", onboardingStatus: "COMPLETED" }),
      cache: "no-store",
    });

    if (!res.ok) {
      res = await fetch(`${BASE_API_URL}/workspaces/${workspaceSlug}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ onboardingStatus: "COMPLETED", status: "COMPLETED" }),
        cache: "no-store",
      });
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || "Failed to complete onboarding" };
    }

    // Also update draft to COMPLETED
    await updateOnboardingDraftAction({ status: "COMPLETED", workspaceSlug });

    const json = await res.json().catch(() => ({}));
    return { success: true, data: json?.data };
  } catch (error: any) {
    console.error("Error completing onboarding:", error);
    return { success: false, message: error.message || "Network error" };
  }
}

export async function inviteTeammatesAction(workspaceSlug: string, emails: string[], role = "MEMBER") {
  try {
    const headers = await getAuthHeaders();
    const results = [];

    for (const email of emails) {
      if (!email || !email.trim()) continue;
      const res = await fetch(`${BASE_API_URL}/invitations`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          workspaceSlug,
          email: email.trim(),
          role,
        }),
        cache: "no-store",
      });

      if (res.ok) {
        results.push({ email, success: true });
      } else {
        const err = await res.json().catch(() => ({}));
        results.push({ email, success: false, message: err.message });
      }
    }

    return { success: true, results };
  } catch (error: any) {
    console.error("Error inviting teammates:", error);
    return { success: false, message: error.message || "Network error" };
  }
}
