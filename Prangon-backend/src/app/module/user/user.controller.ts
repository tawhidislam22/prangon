import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserService } from "./user.service";

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await UserService.getMe(userId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await UserService.updateMe(userId, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

const getSessions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await UserService.getSessions(userId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "User sessions retrieved successfully",
    data: result,
  });
});

const revokeSession = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const sessionId = req.params.sessionId as string;
  const result = await UserService.revokeSession(userId, sessionId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Session revoked successfully",
    data: result,
  });
});

const logoutAllSessions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await UserService.logoutAllSessions(userId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "All sessions logged out successfully",
    data: result,
  });
});

const updateOnboardingDraft = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await UserService.updateOnboardingDraft(userId, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Onboarding draft updated successfully",
    data: result,
  });
});

const getOnboardingDraft = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await UserService.getOnboardingDraft(userId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Onboarding draft retrieved successfully",
    data: result,
  });
});

export const UserController = {
  getMe,
  updateMe,
  getSessions,
  revokeSession,
  logoutAllSessions,
  updateOnboardingDraft,
  getOnboardingDraft,
};