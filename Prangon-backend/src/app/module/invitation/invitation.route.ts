import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { invitationValidation } from "./invitation.validation";
import { invitationController } from "./invitation.controller";

const router = Router();

// Accept invitation
router.post(
    "/accept",
    checkAuth(),
    validateRequest(invitationValidation.acceptInvitationSchema),
    invitationController.acceptInvitation
);

// Resend invitation
router.post(
    "/:id/resend",
    checkAuth(),
    invitationController.resendInvitation
);

// Root routes (e.g. GET /invitations?workspaceSlug=... and POST /invitations)
router.get(
    "/",
    checkAuth(),
    invitationController.listInvitations
);

router.post(
    "/",
    checkAuth(),
    validateRequest(invitationValidation.createInvitationSchema),
    invitationController.createInvitation
);

router.get(
    "/:workspaceId",
    checkAuth(),
    invitationController.listInvitations
);

router.delete(
    "/:id",
    checkAuth(),
    invitationController.revokeInvitation
);

// Legacy nested routes
router.post(
    "/:workspaceId/invitations",
    checkAuth(),
    validateRequest(invitationValidation.createInvitationSchema),
    invitationController.createInvitation
);

router.get(
    "/:workspaceId/invitations",
    checkAuth(),
    invitationController.listInvitations
);

router.delete(
    "/:workspaceId/invitations/:id",
    checkAuth(),
    invitationController.revokeInvitation
);

export const invitationRoutes = router;
