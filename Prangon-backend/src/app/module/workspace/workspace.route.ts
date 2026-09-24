import express from "express";
import { WorkspaceController } from "./workspace.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { WorkspaceValidation } from "./workspace.validation";
import { Role, WorkspaceRole } from "../../../generated/prisma/enums";
import { requireCompletedOnboarding } from "../../middleware/requireCompletedOnboarding";
import { requireRole } from "../../middleware/requireRole";

const router = express.Router();

router.post(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  validateRequest(WorkspaceValidation.createWorkspaceSchema),
  WorkspaceController.createWorkspace
);

router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  WorkspaceController.getWorkspacesForUser
);

// Onboarding Endpoints (exempt from requireCompletedOnboarding)
router.patch(
  "/:slug/onboarding",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  WorkspaceController.updateOnboardingStatus
);

router.get(
  "/:slug/onboarding-status",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  WorkspaceController.getOnboardingStatus
);

// Dashboard aggregate endpoint (avoid 4 separate round-trips)
router.get(
  "/:slug/dashboard-summary",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  requireCompletedOnboarding,
  requireRole(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER),
  WorkspaceController.getDashboardSummary
);

// Transfer Ownership (Owner only)
router.post(
  "/:slug/transfer-ownership",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  requireCompletedOnboarding,
  requireRole(WorkspaceRole.OWNER),
  WorkspaceController.transferOwnership
);

// Dashboard/Workspace routes
router.get(
  "/:workspaceId",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  requireCompletedOnboarding,
  WorkspaceController.getWorkspaceById
);

router.patch(
  "/:workspaceId",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  requireRole(WorkspaceRole.OWNER),
  validateRequest(WorkspaceValidation.updateWorkspaceSchema),
  WorkspaceController.updateWorkspace
);

router.delete(
  "/:workspaceId",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  requireCompletedOnboarding,
  requireRole(WorkspaceRole.OWNER),
  WorkspaceController.deleteWorkspace
);

export const WorkspaceRoutes = router;

