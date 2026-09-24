import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.get("/me", checkAuth(), UserController.getMe);
router.patch("/me", checkAuth(), UserController.updateMe);
router.get("/me/onboarding-draft", checkAuth(), UserController.getOnboardingDraft);
router.patch("/me/onboarding-draft", checkAuth(), UserController.updateOnboardingDraft);
router.get("/sessions", checkAuth(), UserController.getSessions);
router.delete("/sessions/:sessionId", checkAuth(), UserController.revokeSession);
router.post("/sessions/logout-all", checkAuth(), UserController.logoutAllSessions);

export const UserRoutes = router;