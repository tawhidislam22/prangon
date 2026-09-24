import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { WorkspaceService } from "./workspace.service";

const createWorkspace = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await WorkspaceService.createWorkspace(userId, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Workspace created successfully",
    data: result,
  });
});

const getWorkspacesForUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await WorkspaceService.getWorkspacesForUser(userId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Workspaces retrieved successfully",
    data: result,
  });
});

const getWorkspaceById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const workspaceId = req.params.workspaceId as string;
  const result = await WorkspaceService.getWorkspaceById(userId, workspaceId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Workspace retrieved successfully",
    data: result,
  });
});

const updateWorkspace = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const workspaceId = req.params.workspaceId as string;
  const result = await WorkspaceService.updateWorkspace(userId, workspaceId, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Workspace updated successfully",
    data: result,
  });
});

const deleteWorkspace = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const workspaceId = req.params.workspaceId as string;
  const result = await WorkspaceService.deleteWorkspace(userId, workspaceId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Workspace deleted successfully",
    data: result,
  });
});

const updateOnboardingStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const slug = req.params.slug as string;
  const status = req.body.status || req.body.onboardingStatus;
  const result = await WorkspaceService.updateOnboardingStatus(userId, slug, status);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Onboarding status updated successfully",
    data: result,
  });
});

const getOnboardingStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const slug = req.params.slug as string;
  const result = await WorkspaceService.getOnboardingStatus(userId, slug);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Onboarding status retrieved successfully",
    data: result,
  });
});

const getDashboardSummary = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const slug = req.params.slug as string;
  const result = await WorkspaceService.getDashboardSummary(userId, slug);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Dashboard summary retrieved successfully",
    data: result,
  });
});

const transferOwnership = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const slug = req.params.slug as string;
  const { newOwnerId } = req.body;
  const result = await WorkspaceService.transferOwnership(userId, slug, newOwnerId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Workspace ownership transferred successfully",
    data: result,
  });
});

export const WorkspaceController = {
  updateOnboardingStatus,
  getOnboardingStatus,
  createWorkspace,
  getWorkspacesForUser,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getDashboardSummary,
  transferOwnership,
};
