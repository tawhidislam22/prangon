/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { redirect } from "next/navigation";

export async function createPortalSessionAction(workspaceSlug: string) {
  let portalUrl = "";
  try {
    const res = await httpClient.post<any>("/payments/portal", {
      workspaceSlug,
    });
    if (res.data?.url) {
      portalUrl = res.data.url;
    }
  } catch (error) {
    console.error("Failed to create portal session", error);
    return { success: false, message: "Failed to connect to billing provider." };
  }

  if (portalUrl) {
    redirect(portalUrl);
  }
}

export async function createCheckoutSessionAction(workspaceSlug: string, priceId: string) {
  let checkoutUrl = "";
  try {
    const res = await httpClient.post<any>("/payments/checkout", {
      workspaceSlug,
      priceId,
    });
    if (res.data?.url) {
      checkoutUrl = res.data.url;
    }
  } catch (error) {
    console.error("Failed to create checkout session", error);
    return { success: false, message: "Failed to initialize checkout." };
  }

  if (checkoutUrl) {
    redirect(checkoutUrl);
  }
}
