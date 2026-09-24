import Stripe from "stripe";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { stripe } from "../../config/stripe.config";
import { envVars } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { SubscriptionTier, SubscriptionStatus, WorkspaceRole, OnboardingStatus } from "../../../generated/prisma/enums";

const createCheckoutSession = async (
    workspaceId?: string,
    priceId?: string,
    userId?: string,
    successUrl?: string,
    cancelUrl?: string
) => {
    if (!userId) {
        throw new AppError(status.UNAUTHORIZED, "User ID is required");
    }

    let customerId: string | undefined;
    const metadata: Record<string, string> = { userId };

    if (workspaceId) {
        // 1. Check if user is owner/admin of the workspace
        const workspaceMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId
                }
            }
        });

        if (!workspaceMember || (workspaceMember.role !== "OWNER" && workspaceMember.role !== "ADMIN")) {
            throw new AppError(status.FORBIDDEN, "You do not have permission to manage subscriptions for this workspace");
        }

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: { subscription: true }
        });

        if (!workspace) {
            throw new AppError(status.NOT_FOUND, "Workspace not found");
        }

        metadata.workspaceId = workspaceId;
        customerId = workspace.subscription?.stripeCustomerId || undefined;

        if (!customerId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            const customer = await stripe.customers.create({
                email: user?.email,
                name: user?.name,
                metadata: { workspaceId, userId }
            });
            customerId = customer.id;

            if (workspace.subscription) {
                await prisma.subscription.update({
                    where: { workspaceId },
                    data: { stripeCustomerId: customerId }
                });
            } else {
                await prisma.subscription.create({
                    data: {
                        workspaceId,
                        stripeCustomerId: customerId
                    }
                });
            }
        }
    } else {
        // Onboarding checkout path (workspace not created yet)
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new AppError(status.NOT_FOUND, "User not found");
        }

        const existingCustomers = await stripe.customers.list({ email: user.email, limit: 1 });
        if (existingCustomers.data.length > 0) {
            customerId = existingCustomers.data[0].id;
        } else {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId }
            });
            customerId = customer.id;
        }
    }

    const line_items = priceId ? [{ price: priceId, quantity: 1 }] : [
        {
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Prangon Premium Subscription",
                    description: "Unlimited members, unlimited projects, priority 24/7 support",
                },
                unit_amount: 1900,
                recurring: {
                    interval: "month" as const,
                },
            },
            quantity: 1,
        }
    ];

    const defaultSuccessUrl = workspaceId
        ? `${envVars.FRONTEND_URL}/dashboard/${workspaceId}/settings/billing?success=true`
        : `${envVars.FRONTEND_URL}/onboarding/workspace?session_id={CHECKOUT_SESSION_ID}`;

    const defaultCancelUrl = workspaceId
        ? `${envVars.FRONTEND_URL}/dashboard/${workspaceId}/settings/billing?canceled=true`
        : `${envVars.FRONTEND_URL}/onboarding/plan?canceled=true`;

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items,
        mode: "subscription",
        success_url: successUrl || defaultSuccessUrl,
        cancel_url: cancelUrl || defaultCancelUrl,
        metadata,
    });

    return { url: session.url };
};

const createCustomerPortalSession = async (workspaceId: string, userId: string) => {
    const workspaceMember = await prisma.workspaceMember.findUnique({
        where: {
            workspaceId_userId: {
                workspaceId,
                userId
            }
        }
    });

    if (!workspaceMember || (workspaceMember.role !== "OWNER" && workspaceMember.role !== "ADMIN")) {
        throw new AppError(status.FORBIDDEN, "You do not have permission to manage subscriptions for this workspace");
    }

    const subscription = await prisma.subscription.findUnique({
        where: { workspaceId }
    });

    if (!subscription || !subscription.stripeCustomerId) {
        throw new AppError(status.BAD_REQUEST, "No active subscription found for this workspace");
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${envVars.FRONTEND_URL}/dashboard/${workspaceId}/settings/billing`
    });

    return { url: session.url };
};

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
    console.log(`Received Stripe Webhook Event: ${event.type}`);

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                if (session.mode === "subscription") {
                    const workspaceId = session.metadata?.workspaceId;
                    const subscriptionId = session.subscription as string;
                    
                    if (workspaceId) {
                        const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);
                        
                        await prisma.subscription.upsert({
                            where: { workspaceId },
                            update: {
                                stripeSubscriptionId: subscription.id,
                                stripePriceId: subscription.items?.data?.[0]?.price?.id || null,
                                tier: SubscriptionTier.PREMIUM,
                                status: SubscriptionStatus.ACTIVE,
                                currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
                                cancelAtPeriodEnd: subscription.cancel_at_period_end
                            },
                            create: {
                                workspaceId,
                                stripeCustomerId: session.customer as string,
                                stripeSubscriptionId: subscription.id,
                                stripePriceId: subscription.items?.data?.[0]?.price?.id || null,
                                tier: SubscriptionTier.PREMIUM,
                                status: SubscriptionStatus.ACTIVE,
                                currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
                                cancelAtPeriodEnd: subscription.cancel_at_period_end
                            }
                        });
                    } else if (session.metadata?.userId) {
                        const userId = session.metadata.userId;
                        const subscription: any = await stripe.subscriptions.retrieve(subscriptionId);
                        const user = await prisma.user.findUnique({ where: { id: userId } });
                        const draft = (user?.onboardingDraft as Record<string, any>) || {};
                        const companyName = draft.companyName || "My Workspace";

                        // Generate clean unique slug
                        const baseSlug = companyName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "workspace";
                        let uniqueSlug = baseSlug;
                        let counter = 1;
                        while (await prisma.workspace.findUnique({ where: { slug: uniqueSlug } })) {
                            uniqueSlug = `${baseSlug}-${counter++}`;
                        }

                        const createdWs = await prisma.workspace.create({
                            data: {
                                name: companyName,
                                slug: uniqueSlug,
                                industry: draft.industry,
                                companySize: draft.companySize,
                                ownerId: userId,
                                onboardingStatus: OnboardingStatus.PENDING_WORKSPACE,
                                members: {
                                    create: {
                                        userId,
                                        role: WorkspaceRole.OWNER,
                                    }
                                },
                                subscription: {
                                    create: {
                                        tier: SubscriptionTier.PREMIUM,
                                        status: SubscriptionStatus.ACTIVE,
                                        stripeCustomerId: session.customer as string,
                                        stripeSubscriptionId: subscription.id,
                                        stripePriceId: subscription.items?.data?.[0]?.price?.id || null,
                                        currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
                                        cancelAtPeriodEnd: subscription.cancel_at_period_end
                                    }
                                }
                            }
                        });

                        await prisma.user.update({
                            where: { id: userId },
                            data: {
                                onboardingDraft: {
                                    ...draft,
                                    workspaceId: createdWs.id,
                                    workspaceSlug: createdWs.slug,
                                    status: OnboardingStatus.PENDING_WORKSPACE,
                                    selectedTier: "PREMIUM"
                                }
                            }
                        });
                    }
                }
                break;
            }
            case "customer.subscription.updated": {
                const subscription: any = event.data.object;
                
                await prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: subscription.id },
                    data: {
                        stripePriceId: subscription.items.data[0].price.id,
                        status: subscription.status === "active" ? SubscriptionStatus.ACTIVE : 
                               subscription.status === "past_due" ? SubscriptionStatus.PAST_DUE :
                               subscription.status === "unpaid" ? SubscriptionStatus.UNPAID : 
                               SubscriptionStatus.CANCELED,
                        currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
                        cancelAtPeriodEnd: subscription.cancel_at_period_end
                    }
                });
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                
                await prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: subscription.id },
                    data: {
                        status: SubscriptionStatus.CANCELED,
                        tier: SubscriptionTier.FREE,
                        cancelAtPeriodEnd: false
                    }
                });
                break;
            }
            case "invoice.payment_succeeded": {
                const invoice: any = event.data.object;
                if (invoice.subscription) {
                    const subscription: any = await stripe.subscriptions.retrieve(invoice.subscription as string);
                    await prisma.subscription.updateMany({
                        where: { stripeSubscriptionId: subscription.id },
                        data: {
                            status: SubscriptionStatus.ACTIVE,
                            currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null
                        }
                    });
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error("Error processing webhook event data:", error);
    }

    return { message: `Webhook Event ${event.id} processed successfully` };
};

export const PaymentService = {
    createCheckoutSession,
    createCustomerPortalSession,
    handlerStripeWebhookEvent
};