import { prisma } from "../../lib/prisma";
import { NotificationType } from "../../../generated/prisma/enums";

const resolveWorkspaceId = async (slugOrId: string) => {
    const ws = await prisma.workspace.findFirst({
        where: {
            OR: [
                { id: slugOrId },
                { slug: slugOrId }
            ]
        },
        select: { id: true }
    });
    return ws?.id || slugOrId;
};

const createNotification = async (
    title: string,
    userId: string,
    content?: string,
    type: NotificationType = NotificationType.SYSTEM,
    workspaceId?: string
) => {
    const resolvedWorkspaceId = workspaceId ? await resolveWorkspaceId(workspaceId) : undefined;
    const result = await prisma.notification.create({
        data: {
            title,
            content,
            type,
            userId,
            workspaceId: resolvedWorkspaceId,
        }
    });
    return result;
};

const getUserNotifications = async (userId: string, workspaceSlugOrId?: string) => {
    let workspaceId: string | undefined;
    if (workspaceSlugOrId) {
        workspaceId = await resolveWorkspaceId(workspaceSlugOrId);
    }

    const whereClause: any = { userId };
    if (workspaceId) {
        whereClause.OR = [
            { workspaceId },
            { workspaceId: null }
        ];
    }

    const result = await prisma.notification.findMany({
        where: whereClause,
        take: 50,
        orderBy: { createdAt: "desc" }
    });
    return result;
};

const markAsRead = async (id: string, userId: string) => {
    const result = await prisma.notification.updateMany({
        where: { id, userId },
        data: { isRead: true }
    });
    return result;
};

const markAllAsRead = async (userId: string, workspaceSlugOrId?: string) => {
    let workspaceId: string | undefined;
    if (workspaceSlugOrId) {
        workspaceId = await resolveWorkspaceId(workspaceSlugOrId);
    }

    const whereClause: any = { userId, isRead: false };
    if (workspaceId) {
        whereClause.OR = [
            { workspaceId },
            { workspaceId: null }
        ];
    }

    const result = await prisma.notification.updateMany({
        where: whereClause,
        data: { isRead: true }
    });
    return result;
};

export const notificationService = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
};

