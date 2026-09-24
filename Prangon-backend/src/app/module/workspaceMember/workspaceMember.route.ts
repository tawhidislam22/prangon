import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { workspaceMemberValidation } from "./workspaceMember.validation";
import { workspaceMemberController } from "./workspaceMember.controller";

const router = Router();

// List members (e.g. GET /workspace-members?workspaceSlug=... or GET /workspace-members)
router.get(
    "/",
    checkAuth(),
    workspaceMemberController.listMembers
);

// Add member (e.g. POST /workspace-members)
router.post(
    "/",
    checkAuth(),
    workspaceMemberController.addMember
);

// Update member role (e.g. PATCH /workspace-members/:memberId/role)
router.patch(
    "/:memberId/role",
    checkAuth(),
    workspaceMemberController.updateRole
);

// Remove member (e.g. DELETE /workspace-members/:memberId)
router.delete(
    "/:memberId",
    checkAuth(),
    workspaceMemberController.removeMember
);

// Nested routes (e.g. /workspace-members/:workspaceId or /workspace-members/:workspaceId/members)
router.get(
    "/:workspaceId",
    checkAuth(),
    workspaceMemberController.listMembers
);

router.post(
    "/:workspaceId/members",
    checkAuth(),
    validateRequest(workspaceMemberValidation.addMemberSchema),
    workspaceMemberController.addMember
);

router.get(
    "/:workspaceId/members",
    checkAuth(),
    workspaceMemberController.listMembers
);

router.patch(
    "/:workspaceId/members/:memberId/role",
    checkAuth(),
    validateRequest(workspaceMemberValidation.updateRoleSchema),
    workspaceMemberController.updateRole
);

router.delete(
    "/:workspaceId/members/:memberId",
    checkAuth(),
    workspaceMemberController.removeMember
);

export const workspaceMemberRoutes = router;
