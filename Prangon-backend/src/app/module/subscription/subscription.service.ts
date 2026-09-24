import { prisma } from "../../lib/prisma";
import { SubscriptionTier, SubscriptionStatus } from "../../../generated/prisma/enums";

const createSubscription = async (userId: string, payload: {
  workspaceId: string;
  tier?: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}) => {
  // Verify user is owner of the workspace
  const workspace = await prisma.workspace.findUnique({
    where: { id: payload.workspaceId },
  });

  if (!workspace || workspace.ownerId !== userId) {
    throw new Error("Unauthorized: User is not the owner of this workspace");
  }

  const subscription = await prisma.subscription.create({
    data: {
      workspaceId: payload.workspaceId,
      tier: payload.tier || SubscriptionTier.FREE,
      stripeCustomerId: payload.stripeCustomerId,
      stripeSubscriptionId: payload.stripeSubscriptionId,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  return subscription;
};

const getSubscriptionByWorkspace = async (userId: string, workspaceId: string) => {
  // Verify user is a member of the workspace
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (!membership) {
    throw new Error("Unauthorized: User is not a member of this workspace");
  }

  const subscription = await prisma.subscription.findUnique({
    where: {
      workspaceId,
    },
  });

  return subscription;
};

const updateSubscription = async (userId: string, workspaceId: string, payload: {
  tier?: SubscriptionTier;
  stripeSubscriptionId?: string;
  isActive?: boolean;
  expiresAt?: string;
}) => {
  // Verify user is owner of the workspace
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.ownerId !== userId) {
    throw new Error("Unauthorized: User is not the owner of this workspace");
  }

  const updateData: any = {};
  if (payload.tier) updateData.tier = payload.tier;
  if (payload.stripeSubscriptionId) updateData.stripeSubscriptionId = payload.stripeSubscriptionId;
  if (payload.isActive !== undefined) {
    updateData.status = payload.isActive ? SubscriptionStatus.ACTIVE : SubscriptionStatus.CANCELED;
  }
  if (payload.expiresAt) {
    updateData.currentPeriodEnd = new Date(payload.expiresAt);
  }

  const updatedSubscription = await prisma.subscription.update({
    where: { workspaceId },
    data: updateData,
  });

  return updatedSubscription;
};

export const SubscriptionService = {
  createSubscription,
  getSubscriptionByWorkspace,
  updateSubscription,
};
