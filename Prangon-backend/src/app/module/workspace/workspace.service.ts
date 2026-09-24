import { prisma } from "../../lib/prisma";
import { WorkspaceRole, OnboardingStatus, SubscriptionTier, SubscriptionStatus } from "../../../generated/prisma/enums";

const createWorkspace = async (userId: string, payload: {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  industry?: string;
  companySize?: string;
  onboardingStatus?: OnboardingStatus;
  tier?: SubscriptionTier;
}) => {
  // Use a transaction to ensure workspace, workspace member, and subscription are created together
  const result = await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        logoUrl: payload.logoUrl,
        industry: payload.industry,
        companySize: payload.companySize,
        ownerId: userId,
        onboardingStatus: payload.onboardingStatus || OnboardingStatus.COMPLETED,
      },
    });

    // Create the owner as a workspace member with OWNER role
    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: userId,
        role: WorkspaceRole.OWNER,
      },
    });

    // Create default subscription
    await tx.subscription.create({
      data: {
        workspaceId: workspace.id,
        tier: payload.tier || SubscriptionTier.FREE,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    // Update user's draft to reflect the created workspace
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { onboardingDraft: true },
    });
    const draft = (user?.onboardingDraft as Record<string, any>) || {};
    await tx.user.update({
      where: { id: userId },
      data: {
        onboardingDraft: {
          ...draft,
          status: payload.onboardingStatus || OnboardingStatus.COMPLETED,
          workspaceId: workspace.id,
          workspaceSlug: workspace.slug,
        },
      },
    });

    return workspace;
  });

  return result;
};

const getWorkspacesForUser = async (userId: string) => {
  const workspaces = await prisma.workspaceMember.findMany({
    where: {
      userId: userId,
    },
    include: {
      workspace: true,
    },
  });

  return workspaces.map(wm => wm.workspace);
};

const getWorkspaceById = async (userId: string, workspaceId: string) => {
  // First verify user is a member of this workspace
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
    include: {
      workspace: true,
    },
  });

  if (!membership) {
    throw new Error("Workspace not found or unauthorized");
  }

  return membership.workspace;
};

const updateWorkspace = async (
  userId: string,
  workspaceIdOrSlug: string,
  payload: {
    name?: string;
    description?: string;
    slug?: string;
    logoUrl?: string;
    industry?: string;
    companySize?: string;
    onboardingStatus?: OnboardingStatus;
  }
) => {
  // Find workspace by ID or slug
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ id: workspaceIdOrSlug }, { slug: workspaceIdOrSlug }],
    },
  });

  if (!workspace || workspace.ownerId !== userId) {
    throw new Error("Workspace not found or unauthorized to update");
  }

  // If slug is changing, verify uniqueness
  if (payload.slug && payload.slug !== workspace.slug) {
    const existing = await prisma.workspace.findUnique({
      where: { slug: payload.slug },
    });
    if (existing) {
      throw new Error("A workspace with this slug already exists");
    }
  }

  const updatedWorkspace = await prisma.workspace.update({
    where: { id: workspace.id },
    data: payload,
  });

  if (payload.onboardingStatus) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { onboardingDraft: true },
    });
    const draft = (user?.onboardingDraft as Record<string, any>) || {};
    await prisma.user.update({
      where: { id: userId },
      data: {
        onboardingDraft: {
          ...draft,
          status: payload.onboardingStatus,
          workspaceId: updatedWorkspace.id,
          workspaceSlug: updatedWorkspace.slug,
        },
      },
    });
  }

  return updatedWorkspace;
};

const deleteWorkspace = async (userId: string, workspaceIdOrSlug: string) => {
  // Find workspace by ID or slug
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ id: workspaceIdOrSlug }, { slug: workspaceIdOrSlug }],
    },
  });

  if (!workspace || workspace.ownerId !== userId) {
    throw new Error("Workspace not found or unauthorized to delete");
  }

  const deletedWorkspace = await prisma.workspace.delete({
    where: { id: workspace.id },
  });

  return deletedWorkspace;
};

const updateOnboardingStatus = async (userId: string, slug: string, status: any) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
  });
  if (!workspace || workspace.ownerId !== userId) {
    throw new Error("Workspace not found or unauthorized");
  }
  return await prisma.workspace.update({
    where: { id: workspace.id },
    data: { onboardingStatus: status },
  });
};

const getOnboardingStatus = async (userId: string, slug: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
  });
  if (!workspace) {
    throw new Error("Workspace not found");
  }
  return { onboardingStatus: workspace.onboardingStatus };
};

const getDashboardSummary = async (userId: string, slug: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    include: {
      members: {
        where: { userId },
      },
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  if (workspace.members.length === 0 && workspace.ownerId !== userId) {
    throw new Error("Unauthorized access to workspace dashboard");
  }

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  endOfWeek.setHours(23, 59, 59, 999);

  const [
    activeProjectsCount,
    openTasksCount,
    teamMembersCount,
    tasksDueThisWeekCount,
    todoTasksCount,
    inProgressTasksCount,
    doneTasksCount,
    recentActivities,
    userTasks,
  ] = await Promise.all([
    prisma.project.count({
      where: { workspaceId: workspace.id },
    }),
    prisma.task.count({
      where: {
        workspaceId: workspace.id,
        status: { not: "DONE" },
      },
    }),
    prisma.workspaceMember.count({
      where: { workspaceId: workspace.id },
    }),
    prisma.task.count({
      where: {
        workspaceId: workspace.id,
        dueDate: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
        status: { not: "DONE" },
      },
    }),
    prisma.task.count({
      where: { workspaceId: workspace.id, status: "TODO" },
    }),
    prisma.task.count({
      where: { workspaceId: workspace.id, status: "IN_PROGRESS" },
    }),
    prisma.task.count({
      where: { workspaceId: workspace.id, status: "DONE" },
    }),
    prisma.activityLog.findMany({
      where: { workspaceId: workspace.id },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    }),
    prisma.task.findMany({
      where: {
        workspaceId: workspace.id,
        assigneeId: userId,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    workspace: {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      ownerId: workspace.ownerId,
      logoUrl: workspace.logoUrl,
      createdAt: workspace.createdAt,
    },
    stats: {
      activeProjects: activeProjectsCount,
      openTasks: openTasksCount,
      teamMembers: teamMembersCount,
      tasksDueThisWeek: tasksDueThisWeekCount,
    },
    taskStatusCounts: {
      todo: todoTasksCount,
      inProgress: inProgressTasksCount,
      done: doneTasksCount,
      total: todoTasksCount + inProgressTasksCount + doneTasksCount,
    },
    recentActivities,
    userTasks,
  };
};

const transferOwnership = async (userId: string, slug: string, newOwnerId: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  if (workspace.ownerId !== userId) {
    throw new Error("Unauthorized: Only the current Owner can transfer workspace ownership");
  }

  const targetMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: newOwnerId,
      },
    },
    include: { user: true },
  });

  if (!targetMember) {
    throw new Error("Target user is not a member of this workspace");
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Update workspace ownerId
    const updatedWs = await tx.workspace.update({
      where: { id: workspace.id },
      data: { ownerId: newOwnerId },
    });

    // 2. Set previous owner to ADMIN
    await tx.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId: userId,
        },
      },
      data: { role: WorkspaceRole.ADMIN },
    });

    // 3. Set new owner to OWNER
    await tx.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId: newOwnerId,
        },
      },
      data: { role: WorkspaceRole.OWNER },
    });

    // 4. Create activity log
    await tx.activityLog.create({
      data: {
        action: "Transferred ownership",
        entityType: "Workspace",
        entityId: workspace.id,
        workspaceId: workspace.id,
        userId: userId,
        details: `Transferred ownership of workspace ${workspace.name} to ${targetMember.user?.name || targetMember.user?.email || newOwnerId}`,
      },
    });

    return updatedWs;
  });

  return result;
};

export const WorkspaceService = {
  updateOnboardingStatus,
  getOnboardingStatus,
  createWorkspace,
  getWorkspacesForUser,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getDashboardSummary,
  transferOwnership,
};
