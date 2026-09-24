import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ProjectService } from "./project.service";

const createProject = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await ProjectService.createProject(userId, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Project created successfully",
    data: result,
  });
});

const getProjectsByWorkspace = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { workspaceId } = req.query;

  if (!workspaceId) {
    throw new Error("Workspace ID query parameter is required");
  }

  const result = await ProjectService.getProjectsByWorkspace(userId, workspaceId as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully",
    data: result,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const projectId = req.params.projectId as string;
  const result = await ProjectService.getProjectById(userId, projectId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Project retrieved successfully",
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const projectId = req.params.projectId as string;
  const result = await ProjectService.updateProject(userId, projectId, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Project updated successfully",
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const projectId = req.params.projectId as string;
  const result = await ProjectService.deleteProject(userId, projectId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Project deleted successfully",
    data: result,
  });
});

export const ProjectController = {
  createProject,
  getProjectsByWorkspace,
  getProjectById,
  updateProject,
  deleteProject,
};
