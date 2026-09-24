import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { notificationValidation } from "./notification.validation";
import { notificationController } from "./notification.controller";

const router = Router();

// Notice: create notification might be an internal function mostly, but exposing for testing/flexibility
router.post(
    "/",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    validateRequest(notificationValidation.createNotificationSchema),
    notificationController.createNotification
);

router.get(
    "/",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    notificationController.getUserNotifications
);

router.patch(
    "/mark-all-read",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    notificationController.markAllAsRead
);

router.patch(
    "/read-all",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    notificationController.markAllAsRead
);

router.patch(
    "/:id/read",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    notificationController.markAsRead
);

export const notificationRoutes = router;
