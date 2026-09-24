import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { notificationValidation } from "./notification.validation";
import { notificationController } from "./notification.controller";

const router = Router();

// Notice: create notification might be an internal function mostly, but exposing for testing/flexibility
router.post(
    "/",
    checkAuth(),
    validateRequest(notificationValidation.createNotificationSchema),
    notificationController.createNotification
);

router.get(
    "/",
    checkAuth(),
    notificationController.getUserNotifications
);

router.patch(
    "/mark-all-read",
    checkAuth(),
    notificationController.markAllAsRead
);

router.patch(
    "/read-all",
    checkAuth(),
    notificationController.markAllAsRead
);

router.patch(
    "/:id/read",
    checkAuth(),
    notificationController.markAsRead
);

export const notificationRoutes = router;
