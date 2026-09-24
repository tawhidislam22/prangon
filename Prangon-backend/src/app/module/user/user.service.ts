import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      status: true,
      image: true,
      onboardingDraft: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          sessions: true,
          ownedWorkspaces: true,
          workspaceMembers: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return user;
};

const updateMe = async (userId: string, payload: { name?: string; image?: string }) => {
  const updateData: { name?: string; image?: string } = {};
  if (payload.name !== undefined) updateData.name = payload.name;
  if (payload.image !== undefined) updateData.image = payload.image;

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      status: true,
      image: true,
      updatedAt: true,
    },
  });

  return user;
};

const getSessions = async (userId: string) => {
  const sessions = await prisma.session.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      updatedAt: true,
      expiresAt: true,
    },
  });

  return sessions;
};

const revokeSession = async (userId: string, sessionId: string) => {
  const deleted = await prisma.session.deleteMany({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (deleted.count === 0) {
    throw new AppError(status.NOT_FOUND, "Session not found or already revoked");
  }

  return { message: "Session revoked successfully" };
};

const logoutAllSessions = async (userId: string) => {
  await prisma.session.deleteMany({
    where: { userId },
  });

  return { message: "All sessions logged out successfully" };
};

const updateOnboardingDraft = async (userId: string, draftPayload: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingDraft: true },
  });

  const existingDraft = (user?.onboardingDraft as Record<string, any>) || {};
  const updatedDraft = {
    ...existingDraft,
    ...draftPayload,
  };

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { onboardingDraft: updatedDraft },
    select: { id: true, onboardingDraft: true },
  });

  return updatedUser.onboardingDraft;
};

const getOnboardingDraft = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingDraft: true },
  });

  return user?.onboardingDraft || null;
};

export const UserService = {
  getMe,
  updateMe,
  getSessions,
  revokeSession,
  logoutAllSessions,
  updateOnboardingDraft,
  getOnboardingDraft,
};

