import { prisma } from "../../lib/prisma";

const logActivity = async (
    action: string,
    entityType: string,
    entityId: string,
    workspaceId: string,
    userId?: string,
    details?: string
) => {
    const result = await prisma.activityLog.create({
        data: {
            action,
            entityType,
            entityId,
            workspaceId,
            userId,
            details,
        }
    });
    return result;
};

const listActivity = async (workspaceId: string) => {
    const result = await prisma.activityLog.findMany({
        where: { workspaceId },
        take: 50,
        include: {
            user: {
                select: { id: true, name: true, email: true, image: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
    return result;
};

export const activityLogService = {
    logActivity,
    listActivity,
};
