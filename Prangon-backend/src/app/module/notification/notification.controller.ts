import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { notificationService } from "./notification.service";

const createNotification = catchAsync(async (req, res) => {
    const { title, userId, content, type, workspaceId } = req.body;
    const result = await notificationService.createNotification(title, userId, content, type, workspaceId);

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Notification created successfully",
        data: result,
    });
});

const getUserNotifications = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const workspaceSlug = (req.query.workspaceSlug || req.query.workspaceId) as string | undefined;
    const result = await notificationService.getUserNotifications(userId, workspaceSlug);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Notifications fetched successfully",
        data: result,
    });
});

const markAsRead = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const userId = req.user.userId;
    const result = await notificationService.markAsRead(id, userId);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Notification marked as read",
        data: result,
    });
});

const markAllAsRead = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const workspaceSlug = (req.body?.workspaceSlug || req.query?.workspaceSlug) as string | undefined;
    const result = await notificationService.markAllAsRead(userId, workspaceSlug);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "All notifications marked as read",
        data: result,
    });
});

export const notificationController = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
};
