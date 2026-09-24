/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import * as PlatformAdminService from "./platformAdmin.service";

const getPlatformStats = catchAsync(async (req: Request, res: Response) => {
  const result = await PlatformAdminService.getPlatformStats();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Platform stats retrieved successfully",
    data: result,
  });
});

const getAllWorkspaces = catchAsync(async (req: Request, res: Response) => {
  const result = await PlatformAdminService.getAllWorkspaces();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Platform workspaces retrieved successfully",
    data: result,
  });
});

const updateWorkspaceStatus = catchAsync(async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId as string;
  const { onboardingStatus } = req.body;
  const adminId = (req as any).user?.userId || (req as any).platformAdmin?.userId;

  const result = await PlatformAdminService.updateWorkspaceStatus(
    workspaceId,
    onboardingStatus,
    adminId
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Workspace status updated successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await PlatformAdminService.getAllUsers();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Platform users retrieved successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const { status: userStatus } = req.body;
  const adminId = (req as any).user?.userId || (req as any).platformAdmin?.userId;

  const result = await PlatformAdminService.updateUserStatus(
    userId,
    userStatus,
    adminId
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

const getAllSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await PlatformAdminService.getAllSubscriptions();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Subscriptions retrieved successfully",
    data: result,
  });
});

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await PlatformAdminService.getAuditLogs();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Platform audit logs retrieved successfully",
    data: result,
  });
});

const getEmailDiagnostics = catchAsync(async (req: Request, res: Response) => {
  const result = await PlatformAdminService.getEmailDiagnostics();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Email deliverability diagnostics retrieved successfully",
    data: result,
  });
});

const previewEmailTemplate = catchAsync(async (req: Request, res: Response) => {
  const templateId = (req.params.templateId as string) || "test";
  const result = await PlatformAdminService.previewEmailTemplate(templateId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Email preview rendered successfully",
    data: result,
  });
});

const sendTestEmail = catchAsync(async (req: Request, res: Response) => {
  const { toEmail, templateId, customSubject } = req.body;
  if (!toEmail) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Recipient email (toEmail) is required",
    });
    return;
  }

  const result = await PlatformAdminService.sendTestEmail(
    toEmail,
    templateId,
    customSubject
  );

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Test email dispatched successfully",
    data: result,
  });
});

export const PlatformAdminController = {
  getPlatformStats,
  getAllWorkspaces,
  updateWorkspaceStatus,
  getAllUsers,
  updateUserStatus,
  getAllSubscriptions,
  getAuditLogs,
  getEmailDiagnostics,
  previewEmailTemplate,
  sendTestEmail,
};
