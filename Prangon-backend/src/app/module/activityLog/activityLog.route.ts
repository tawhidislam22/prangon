import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { activityLogController } from "./activityLog.controller";

const router = Router();

router.get(
    "/:workspaceId/activities",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    activityLogController.listActivity
);

export const activityLogRoutes = router;
