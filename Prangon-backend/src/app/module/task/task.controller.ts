import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { TaskService } from "./task.service";

const createTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await TaskService.createTask(userId, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

const getTasksByProject = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { projectId } = req.query;

  if (!projectId) {
    throw new Error("Project ID query parameter is required");
  }

  const result = await TaskService.getTasksByProject(userId, projectId as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Tasks retrieved successfully",
    data: result,
  });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const taskId = req.params.taskId as string;
  const result = await TaskService.getTaskById(userId, taskId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Task retrieved successfully",
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const taskId = req.params.taskId as string;
  const result = await TaskService.updateTask(userId, taskId, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const taskId = req.params.taskId as string;
  const result = await TaskService.deleteTask(userId, taskId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Task deleted successfully",
    data: result,
  });
});

export const TaskController = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
};
