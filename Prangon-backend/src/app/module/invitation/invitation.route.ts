import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { invitationValidation } from "./invitation.validation";
import { invitationController } from "./invitation.controller";

const router = Router();

// Accept invitation
router.post(
    "/accept",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    validateRequest(invitationValidation.acceptInvitationSchema),
    invitationController.acceptInvitation
);

// Resend invitation
router.post(
    "/:id/resend",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    invitationController.resendInvitation
);

// Root routes (e.g. GET /invitations?workspaceSlug=... and POST /invitations)
router.get(
    "/",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    invitationController.listInvitations
);

router.post(
    "/",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    validateRequest(invitationValidation.createInvitationSchema),
    invitationController.createInvitation
);

router.get(
    "/:workspaceId",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    invitationController.listInvitations
);

router.delete(
    "/:id",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    invitationController.revokeInvitation
);

// Legacy nested routes
router.post(
    "/:workspaceId/invitations",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    validateRequest(invitationValidation.createInvitationSchema),
    invitationController.createInvitation
);

router.get(
    "/:workspaceId/invitations",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    invitationController.listInvitations
);

router.delete(
    "/:workspaceId/invitations/:id",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    invitationController.revokeInvitation
);

export const invitationRoutes = router;
