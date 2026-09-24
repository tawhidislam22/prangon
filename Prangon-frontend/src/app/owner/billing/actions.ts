"use server";
import { getCurrentWorkspaceSlug } from "@/lib/workspaceUtils";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpClient } from "@/lib/axios/httpClient";
import { redirect } from "next/navigation";

export async function createPortalSessionAction() {
  let portalUrl = "";
  try {
    const res = await httpClient.post<any>("/payments/portal", {
      workspaceSlug: await getCurrentWorkspaceSlug(),
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

export async function createCheckoutSessionAction( priceId: string) {
  let checkoutUrl = "";
  try {
    const res = await httpClient.post<any>("/payments/checkout", {
      workspaceSlug: await getCurrentWorkspaceSlug(),
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
