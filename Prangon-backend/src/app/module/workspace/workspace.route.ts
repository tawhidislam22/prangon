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
  checkAuth(),
  validateRequest(WorkspaceValidation.createWorkspaceSchema),
  WorkspaceController.createWorkspace
);

router.get(
  "/",
  checkAuth(),
  WorkspaceController.getWorkspacesForUser
);

// Onboarding Endpoints (exempt from requireCompletedOnboarding)
router.patch(
  "/:slug/onboarding",
  checkAuth(),
  WorkspaceController.updateOnboardingStatus
);

router.get(
  "/:slug/onboarding-status",
  checkAuth(),
  WorkspaceController.getOnboardingStatus
);

// Dashboard aggregate endpoint (avoid 4 separate round-trips)
router.get(
  "/:slug/dashboard-summary",
  checkAuth(),
  requireCompletedOnboarding,
  requireRole(WorkspaceRole.OWNER, WorkspaceRole.ADMIN, WorkspaceRole.MEMBER),
  WorkspaceController.getDashboardSummary
);

// Transfer Ownership (Owner only)
router.post(
  "/:slug/transfer-ownership",
  checkAuth(),
  requireCompletedOnboarding,
  requireRole(WorkspaceRole.OWNER),
  WorkspaceController.transferOwnership
);

// Dashboard/Workspace routes
router.get(
  "/:workspaceId",
  checkAuth(),
  requireCompletedOnboarding,
  WorkspaceController.getWorkspaceById
);

router.patch(
  "/:workspaceId",
  checkAuth(),
  requireRole(WorkspaceRole.OWNER),
  validateRequest(WorkspaceValidation.updateWorkspaceSchema),
  WorkspaceController.updateWorkspace
);

router.delete(
  "/:workspaceId",
  checkAuth(),
  requireCompletedOnboarding,
  requireRole(WorkspaceRole.OWNER),
  WorkspaceController.deleteWorkspace
);

export const WorkspaceRoutes = router;

