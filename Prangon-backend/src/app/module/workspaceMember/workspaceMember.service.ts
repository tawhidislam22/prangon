import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { WorkspaceRole } from "../../../generated/prisma/enums";
import { notificationService } from "../notification/notification.service";

const resolveWorkspaceId = async (workspaceIdOrSlug?: string): Promise<string | undefined> => {
    if (!workspaceIdOrSlug) return undefined;
    const ws = await prisma.workspace.findFirst({
        where: {
            OR: [
                { id: workspaceIdOrSlug },
                { slug: workspaceIdOrSlug }
            ]
        },
        select: { id: true }
    });
    return ws?.id || workspaceIdOrSlug;
};

const addMember = async (workspaceIdOrSlug: string, userId: string, role: WorkspaceRole = WorkspaceRole.MEMBER) => {
    const workspaceId = (await resolveWorkspaceId(workspaceIdOrSlug)) || workspaceIdOrSlug;
    const existingMember = await prisma.workspaceMember.findUnique({
        where: {
            workspaceId_userId: { workspaceId, userId }
        }
    });

    if (existingMember) {
        throw new AppError(status.CONFLICT, "User is already a member of this workspace");
    }

    const result = await prisma.workspaceMember.create({
        data: {
            workspaceId,
            userId,
            role
        }
    });
    return result;
};

const listMembers = async (workspaceIdOrSlug?: string) => {
    const resolvedId = workspaceIdOrSlug ? await resolveWorkspaceId(workspaceIdOrSlug) : undefined;
    const whereClause = resolvedId ? { workspaceId: resolvedId } : {};
    const result = await prisma.workspaceMember.findMany({
        where: whereClause,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    return result;
};

const updateRole = async (
    workspaceIdOrSlug: string | undefined,
    memberId: string,
    newRole: WorkspaceRole,
    callerUserId?: string
) => {
    const resolvedId = workspaceIdOrSlug ? await resolveWorkspaceId(workspaceIdOrSlug) : undefined;
    const where: any = { id: memberId };
    if (resolvedId) {
        where.workspaceId = resolvedId;
    }

    const member = await prisma.workspaceMember.findFirst({
        where,
        include: { workspace: true }
    });

    if (!member) {
        throw new AppError(status.NOT_FOUND, "Workspace member not found");
    }

    // Role Enforcement: Only workspace OWNER can change roles
    if (callerUserId) {
        const callerMembership = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: member.workspaceId,
                    userId: callerUserId,
                },
            },
        });

        if (!callerMembership || callerMembership.role !== WorkspaceRole.OWNER) {
            throw new AppError(status.FORBIDDEN, "Forbidden: Only workspace Owner can change member roles");
        }
    }

    const result = await prisma.workspaceMember.update({
        where: { id: memberId },
        data: { role: newRole }
    });

    if (member.role !== newRole) {
        await notificationService.createNotification(
            "Workspace Role Updated",
            member.userId,
            `Your role in workspace ${member.workspace.name} has been updated to ${newRole}`,
            undefined,
            member.workspaceId
        );
    }

    return result;
};

const removeMember = async (
    workspaceIdOrSlug: string | undefined,
    memberId: string,
    callerUserId?: string
) => {
    const resolvedId = workspaceIdOrSlug ? await resolveWorkspaceId(workspaceIdOrSlug) : undefined;
    const where: any = { id: memberId };
    if (resolvedId) {
        where.workspaceId = resolvedId;
    }

    const member = await prisma.workspaceMember.findFirst({
        where
    });

    if (!member) {
        throw new AppError(status.NOT_FOUND, "Workspace member not found");
    }

    // Prevent removing workspace owner
    if (member.role === WorkspaceRole.OWNER) {
        throw new AppError(status.BAD_REQUEST, "Workspace owner cannot be removed. Transfer ownership first.");
    }

    // Role Enforcement: OWNER or ADMIN can remove member
    if (callerUserId) {
        const callerMembership = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: member.workspaceId,
                    userId: callerUserId,
                },
            },
        });

        if (!callerMembership || (callerMembership.role !== WorkspaceRole.OWNER && callerMembership.role !== WorkspaceRole.ADMIN)) {
            throw new AppError(status.FORBIDDEN, "Forbidden: Only Owner or Admin can remove members");
        }

        // Admin cannot remove another Admin
        if (callerMembership.role === WorkspaceRole.ADMIN && member.role === WorkspaceRole.ADMIN) {
            throw new AppError(status.FORBIDDEN, "Forbidden: Admins cannot remove other Admins");
        }
    }

    const result = await prisma.workspaceMember.delete({
        where: { id: memberId }
    });
    return result;
};

export const workspaceMemberService = {
    addMember,
    listMembers,
    updateRole,
    removeMember,
};
