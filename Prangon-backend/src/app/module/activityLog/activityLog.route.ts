import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { activityLogController } from "./activityLog.controller";

const router = Router();

router.get(
    "/:workspaceId/activities",
    checkAuth(),
    activityLogController.listActivity
);

export const activityLogRoutes = router;
