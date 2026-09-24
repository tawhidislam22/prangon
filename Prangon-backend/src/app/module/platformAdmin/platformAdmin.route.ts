import { Router } from "express";
import { requirePlatformAdmin } from "../../middleware/requirePlatformAdmin";
import { PlatformAdminController } from "./platformAdmin.controller";

const router = Router();

// Protect all platform admin routes
router.use(requirePlatformAdmin());

router.get("/stats", PlatformAdminController.getPlatformStats);
router.get("/workspaces", PlatformAdminController.getAllWorkspaces);
router.patch("/workspaces/:workspaceId/status", PlatformAdminController.updateWorkspaceStatus);
router.get("/users", PlatformAdminController.getAllUsers);
router.patch("/users/:userId/status", PlatformAdminController.updateUserStatus);
router.get("/subscriptions", PlatformAdminController.getAllSubscriptions);
router.get("/audit-logs", PlatformAdminController.getAuditLogs);
router.get("/emails/diagnostics", PlatformAdminController.getEmailDiagnostics);
router.get("/emails/preview/:templateId", PlatformAdminController.previewEmailTemplate);
router.post("/emails/send-test", PlatformAdminController.sendTestEmail);

export const PlatformAdminRoutes = router;
