import { z } from "zod";

const createCheckoutSessionZodSchema = z.object({
    body: z.object({
        workspaceId: z.string().optional(),
        priceId: z.string().optional(),
        successUrl: z.string().optional(),
        cancelUrl: z.string().optional(),
    })
});

const createCustomerPortalSessionZodSchema = z.object({
    body: z.object({
        workspaceId: z.string().uuid("Must be a valid UUID")
    })
});

export const PaymentValidation = {
    createCheckoutSessionZodSchema,
    createCustomerPortalSessionZodSchema
};
