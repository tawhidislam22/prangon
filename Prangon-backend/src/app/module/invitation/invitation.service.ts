import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { WorkspaceRole, InvitationStatus } from "../../../generated/prisma/enums";
import crypto from "crypto";
import { sendEmail } from "../../utils/email";
import { envVars } from "../../config/env";

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

const createInvitation = async (email: string, role: WorkspaceRole = WorkspaceRole.MEMBER, workspaceIdOrSlug: string, inviterId: string) => {
    const workspaceId = (await resolveWorkspaceId(workspaceIdOrSlug)) || workspaceIdOrSlug;
    // Check if user is already a member
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: { workspaceId, userId: user.id }
            }
        });
        if (existingMember) {
            throw new AppError(status.CONFLICT, "User is already a member of this workspace");
        }
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const result = await prisma.invitation.create({
        data: {
            email,
            role,
            workspaceId,
            inviterId,
            token,
            expiresAt,
            status: InvitationStatus.PENDING
        },
        include: {
            workspace: { select: { name: true, slug: true } },
            inviter: { select: { name: true, email: true } },
        }
    });

    const frontendUrl = envVars.FRONTEND_URL || "http://localhost:3000";
    const acceptUrl = `${frontendUrl}/register?invitation=${token}&workspace=${result.workspace?.slug || workspaceIdOrSlug}`;

    sendEmail({
        to: email,
        subject: `${result.inviter?.name || "A team member"} invited you to join ${result.workspace?.name || "a workspace"} on Prangon`,
        templateName: "invitation",
        templateData: {
            inviterName: result.inviter?.name || "A team member",
            inviterEmail: result.inviter?.email || "",
            workspaceName: result.workspace?.name || "Prangon Workspace",
            workspaceSlug: result.workspace?.slug || "",
            role: result.role,
            acceptUrl,
            expiresInDays: 7,
        }
    }).catch((err) => {
        console.error("Failed to send invitation email:", err);
    });

    return result;
};

const acceptInvitation = async (token: string, userId: string, userEmail: string) => {
    const invitation = await prisma.invitation.findUnique({
        where: { token }
    });

    if (!invitation) {
        throw new AppError(status.NOT_FOUND, "Invalid invitation token");
    }

    if (invitation.email !== userEmail) {
        throw new AppError(status.FORBIDDEN, "This invitation was sent to a different email address");
    }

    if (invitation.status !== InvitationStatus.PENDING) {
        throw new AppError(status.BAD_REQUEST, `Invitation is already ${invitation.status.toLowerCase()}`);
    }

    if (new Date() > new Date(invitation.expiresAt)) {
        await prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: InvitationStatus.EXPIRED }
        });
        throw new AppError(status.BAD_REQUEST, "Invitation has expired");
    }

    // Wrap in transaction
    const [updatedInvitation, workspaceMember] = await prisma.$transaction([
        prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: InvitationStatus.ACCEPTED }
        }),
        prisma.workspaceMember.create({
            data: {
                workspaceId: invitation.workspaceId,
                userId: userId,
                role: invitation.role
            }
        })
    ]);

    return { updatedInvitation, workspaceMember };
};

const listInvitations = async (workspaceIdOrSlug?: string) => {
    const resolvedId = workspaceIdOrSlug ? await resolveWorkspaceId(workspaceIdOrSlug) : undefined;
    const where = resolvedId ? { workspaceId: resolvedId } : {};
    const result = await prisma.invitation.findMany({
        where,
        include: {
            inviter: {
                select: { id: true, name: true, email: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
    return result;
};

const resendInvitation = async (id: string) => {
    const invitation = await prisma.invitation.findUnique({ where: { id } });
    if (!invitation) {
        throw new AppError(status.NOT_FOUND, "Invitation not found");
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const result = await prisma.invitation.update({
        where: { id },
        data: {
            expiresAt,
            status: InvitationStatus.PENDING
        },
        include: {
            workspace: { select: { name: true, slug: true } },
            inviter: { select: { name: true, email: true } },
        }
    });

    const frontendUrl = envVars.FRONTEND_URL || "http://localhost:3000";
    const acceptUrl = `${frontendUrl}/register?invitation=${result.token}&workspace=${result.workspace?.slug}`;

    sendEmail({
        to: result.email,
        subject: `Reminder: ${result.inviter?.name || "A team member"} invited you to join ${result.workspace?.name || "a workspace"} on Prangon`,
        templateName: "invitation",
        templateData: {
            inviterName: result.inviter?.name || "A team member",
            inviterEmail: result.inviter?.email || "",
            workspaceName: result.workspace?.name || "Prangon Workspace",
            workspaceSlug: result.workspace?.slug || "",
            role: result.role,
            acceptUrl,
            expiresInDays: 7,
        }
    }).catch((err) => {
        console.error("Failed to resend invitation email:", err);
    });

    return result;
};

const revokeInvitation = async (id: string) => {
    const invitation = await prisma.invitation.findUnique({ where: { id } });
    if (!invitation) {
        throw new AppError(status.NOT_FOUND, "Invitation not found");
    }

    const result = await prisma.invitation.delete({
        where: { id }
    });
    return result;
};

export const invitationService = {
    createInvitation,
    acceptInvitation,
    listInvitations,
    resendInvitation,
    revokeInvitation,
};
