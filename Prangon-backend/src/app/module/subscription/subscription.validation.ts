import { z } from "zod";
import { SubscriptionTier } from "../../../generated/prisma/enums";

const createSubscriptionSchema = z.object({
  body: z.object({
    workspaceId: z.string().min(1, "Workspace ID is required"),
    tier: z.nativeEnum(SubscriptionTier).optional(),
    stripeCustomerId: z.string().optional(),
    stripeSubscriptionId: z.string().optional(),
  }),
});

const updateSubscriptionSchema = z.object({
  body: z.object({
    tier: z.nativeEnum(SubscriptionTier).optional(),
    stripeSubscriptionId: z.string().optional(),
    isActive: z.boolean().optional(),
    expiresAt: z.string().datetime().optional(),
  }),
});

export const SubscriptionValidation = {
  createSubscriptionSchema,
  updateSubscriptionSchema,
};
