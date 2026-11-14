import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { WorkspaceRole, InvitationStatus, NotificationType } from "../../../generated/prisma/enums";
import crypto from "crypto";
import { sendEmail } from "../../utils/email";
import { envVars } from "../../config/env";

const resolveWorkspace = async (workspaceIdOrSlug?: string) => {
    if (!workspaceIdOrSlug) return null;
    const ws = await prisma.workspace.findFirst({
        where: {
            OR: [
                { id: workspaceIdOrSlug },
                { slug: workspaceIdOrSlug }
            ]
        },
        select: { id: true, name: true, slug: true, logoUrl: true }
    });
    return ws;
};

const createInvitation = async (
    email: string,
    role: WorkspaceRole = WorkspaceRole.MEMBER,
    workspaceIdOrSlug: string,
    inviterId: string
) => {
    const normalizedEmail = email.trim().toLowerCase();
    const ws = await resolveWorkspace(workspaceIdOrSlug);
    if (!ws) {
        throw new AppError(status.NOT_FOUND, "Workspace not found");
    }
    const workspaceId = ws.id;

    // Check if user is already a member of this workspace
    const existingUser = await prisma.user.findFirst({
        where: {
            email: { equals: normalizedEmail, mode: "insensitive" }
        }
    });

    if (existingUser) {
        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: { workspaceId, userId: existingUser.id }
            }
        });
        if (existingMember) {
            throw new AppError(status.CONFLICT, "User is already a member of this workspace");
        }
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Check if there is an existing pending invitation for this email and workspace
    const existingInvitation = await prisma.invitation.findFirst({
        where: {
            workspaceId,
            email: { equals: normalizedEmail, mode: "insensitive" },
            status: InvitationStatus.PENDING,
        }
    });

    let result;
    if (existingInvitation) {
        result = await prisma.invitation.update({
            where: { id: existingInvitation.id },
            data: {
                role,
                inviterId,
                token,
                expiresAt,
                status: InvitationStatus.PENDING,
            },
            include: {
                workspace: { select: { id: true, name: true, slug: true } },
                inviter: { select: { id: true, name: true, email: true } },
            }
        });
    } else {
        result = await prisma.invitation.create({
            data: {
                email: normalizedEmail,
                role,
                workspaceId,
                inviterId,
                token,
                expiresAt,
                status: InvitationStatus.PENDING,
            },
            include: {
                workspace: { select: { id: true, name: true, slug: true } },
                inviter: { select: { id: true, name: true, email: true } },
            }
        });
    }

    // If recipient is already a registered user on Prangon, create in-app notification
    if (existingUser) {
        await prisma.notification.create({
            data: {
                title: "Workspace Invitation",
                content: `${result.inviter?.name || "A team member"} invited you to join ${result.workspace?.name || ws.name} as ${role}.`,
                type: NotificationType.SYSTEM,
                userId: existingUser.id,
                workspaceId: ws.id,
            }
        }).catch(() => {});
    }

    const frontendUrl = envVars.FRONTEND_URL || "http://localhost:3000";
    const acceptUrl = `${frontendUrl}/accept-invitation?token=${token}&workspace=${result.workspace?.slug || ws.slug}`;

    sendEmail({
        to: normalizedEmail,
        subject: `${result.inviter?.name || "A team member"} invited you to join ${result.workspace?.name || ws.name} on Prangon`,
        templateName: "invitation",
        templateData: {
            inviterName: result.inviter?.name || "A team member",
            inviterEmail: result.inviter?.email || "",
            workspaceName: result.workspace?.name || ws.name || "Prangon Workspace",
            workspaceSlug: result.workspace?.slug || ws.slug || "",
            role: result.role,
            acceptUrl,
            expiresInDays: 7,
        }
    }).catch((err) => {
        console.error("Failed to send invitation email:", err);
    });

    return result;
};

const getInvitationDetails = async (token: string) => {
    if (!token) {
        throw new AppError(status.BAD_REQUEST, "Invitation token is required");
    }

    const invitation = await prisma.invitation.findUnique({
        where: { token },
        include: {
            workspace: { select: { id: true, name: true, slug: true, logoUrl: true } },
            inviter: { select: { id: true, name: true, email: true } },
        }
    });

    if (!invitation) {
        throw new AppError(status.NOT_FOUND, "Invalid invitation token or invitation no longer exists");
    }

    const isExpired = new Date() > new Date(invitation.expiresAt);

    return {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: isExpired ? InvitationStatus.EXPIRED : invitation.status,
        expiresAt: invitation.expiresAt,
        workspace: invitation.workspace,
        inviter: invitation.inviter,
    };
};

const acceptInvitation = async (token: string, userId: string, userEmail: string) => {
    if (!token) {
        throw new AppError(status.BAD_REQUEST, "Token is required");
    }

    const invitation = await prisma.invitation.findUnique({
        where: { token },
        include: {
            workspace: { select: { id: true, name: true, slug: true, logoUrl: true } }
        }
    });

    if (!invitation) {
        throw new AppError(status.NOT_FOUND, "Invalid invitation token");
    }

    const normalizedInvEmail = invitation.email.trim().toLowerCase();
    const normalizedUserEmail = userEmail.trim().toLowerCase();

    if (normalizedInvEmail !== normalizedUserEmail) {
        throw new AppError(
            status.FORBIDDEN,
            `This invitation was sent to ${invitation.email}, but you are currently signed in as ${userEmail}. Please sign in with the invited email address.`
        );
    }

    // If invitation is already accepted, check if user is already in the workspace
    if (invitation.status === InvitationStatus.ACCEPTED) {
        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: invitation.workspaceId,
                    userId,
                }
            },
            include: {
                workspace: { select: { id: true, name: true, slug: true } }
            }
        });

        if (existingMember) {
            return {
                updatedInvitation: invitation,
                workspaceMember: existingMember,
                workspace: invitation.workspace,
                alreadyJoined: true,
            };
        }
    }

    if (invitation.status !== InvitationStatus.PENDING) {
        throw new AppError(status.BAD_REQUEST, `Invitation is already ${invitation.status.toLowerCase()}`);
    }

    if (new Date() > new Date(invitation.expiresAt)) {
        await prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: InvitationStatus.EXPIRED }
        });
        throw new AppError(status.BAD_REQUEST, "Invitation has expired. Please ask the workspace owner to send a new invitation.");
    }

    // Wrap in transaction: update invitation to ACCEPTED and upsert workspace member
    const [updatedInvitation, workspaceMember] = await prisma.$transaction([
        prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: InvitationStatus.ACCEPTED },
            include: {
                workspace: { select: { id: true, name: true, slug: true } }
            }
        }),
        prisma.workspaceMember.upsert({
            where: {
                workspaceId_userId: {
                    workspaceId: invitation.workspaceId,
                    userId: userId,
                }
            },
            create: {
                workspaceId: invitation.workspaceId,
                userId: userId,
                role: invitation.role,
            },
            update: {
                role: invitation.role,
            },
            include: {
                workspace: { select: { id: true, name: true, slug: true } }
            }
        })
    ]);

    // Send in-app notification to inviter that new member has joined
    if (invitation.inviterId) {
        const joiningUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true }
        });

        await prisma.notification.create({
            data: {
                title: "Team Member Joined",
                content: `${joiningUser?.name || userEmail} has accepted your invitation and joined ${invitation.workspace?.name || "your workspace"}.`,
                type: NotificationType.SYSTEM,
                userId: invitation.inviterId,
                workspaceId: invitation.workspaceId,
            }
        }).catch(() => {});
    }

    return {
        updatedInvitation,
        workspaceMember,
        workspace: invitation.workspace,
        alreadyJoined: false,
    };
};

const listInvitations = async (workspaceIdOrSlug?: string) => {
    let resolvedId: string | undefined;
    if (workspaceIdOrSlug) {
        const ws = await resolveWorkspace(workspaceIdOrSlug);
        resolvedId = ws?.id || workspaceIdOrSlug;
    }

    const where: any = resolvedId ? { workspaceId: resolvedId } : {};
    // By default list pending invitations
    where.status = InvitationStatus.PENDING;

    const result = await prisma.invitation.findMany({
        where,
        include: {
            inviter: {
                select: { id: true, name: true, email: true }
            },
            workspace: {
                select: { id: true, name: true, slug: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
    return result;
};

const resendInvitation = async (id: string) => {
    const invitation = await prisma.invitation.findUnique({
        where: { id },
        include: {
            workspace: { select: { id: true, name: true, slug: true } },
            inviter: { select: { id: true, name: true, email: true } },
        }
    });

    if (!invitation) {
        throw new AppError(status.NOT_FOUND, "Invitation not found");
    }

    // Check if the user is already an active member of this workspace
    const existingMember = await prisma.workspaceMember.findFirst({
        where: {
            workspaceId: invitation.workspaceId,
            user: { email: { equals: invitation.email, mode: "insensitive" } }
        }
    });

    if (existingMember) {
        throw new AppError(status.BAD_REQUEST, "This user has already joined the workspace.");
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
            workspace: { select: { id: true, name: true, slug: true } },
            inviter: { select: { id: true, name: true, email: true } },
        }
    });

    const frontendUrl = envVars.FRONTEND_URL || "http://localhost:3000";
    const acceptUrl = `${frontendUrl}/accept-invitation?token=${result.token}&workspace=${result.workspace?.slug || ""}`;

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
    getInvitationDetails,
    acceptInvitation,
    listInvitations,
    resendInvitation,
    revokeInvitation,
};
