import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { workspaceMemberValidation } from "./workspaceMember.validation";
import { workspaceMemberController } from "./workspaceMember.controller";

const router = Router();

// List members (e.g. GET /workspace-members?workspaceSlug=... or GET /workspace-members)
router.get(
    "/",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    workspaceMemberController.listMembers
);

// Add member (e.g. POST /workspace-members)
router.post(
    "/",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    workspaceMemberController.addMember
);

// Update member role (e.g. PATCH /workspace-members/:memberId/role)
router.patch(
    "/:memberId/role",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    workspaceMemberController.updateRole
);

// Remove member (e.g. DELETE /workspace-members/:memberId)
router.delete(
    "/:memberId",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    workspaceMemberController.removeMember
);

// Nested routes (e.g. /workspace-members/:workspaceId or /workspace-members/:workspaceId/members)
router.get(
    "/:workspaceId",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    workspaceMemberController.listMembers
);

router.post(
    "/:workspaceId/members",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    validateRequest(workspaceMemberValidation.addMemberSchema),
    workspaceMemberController.addMember
);

router.get(
    "/:workspaceId/members",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    workspaceMemberController.listMembers
);

router.patch(
    "/:workspaceId/members/:memberId/role",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    validateRequest(workspaceMemberValidation.updateRoleSchema),
    workspaceMemberController.updateRole
);

router.delete(
    "/:workspaceId/members/:memberId",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    workspaceMemberController.removeMember
);

export const workspaceMemberRoutes = router;
