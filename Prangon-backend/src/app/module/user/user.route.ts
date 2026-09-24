import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/me", checkAuth(Role.SUPER_ADMIN, Role.USER), UserController.getMe);
router.patch("/me", checkAuth(Role.SUPER_ADMIN, Role.USER), UserController.updateMe);
router.get("/me/onboarding-draft", checkAuth(Role.SUPER_ADMIN, Role.USER), UserController.getOnboardingDraft);
router.patch("/me/onboarding-draft", checkAuth(Role.SUPER_ADMIN, Role.USER), UserController.updateOnboardingDraft);
router.get("/sessions", checkAuth(Role.SUPER_ADMIN, Role.USER), UserController.getSessions);
router.delete("/sessions/:sessionId", checkAuth(Role.SUPER_ADMIN, Role.USER), UserController.revokeSession);
router.post("/sessions/logout-all", checkAuth(Role.SUPER_ADMIN, Role.USER), UserController.logoutAllSessions);

export const UserRoutes = router;