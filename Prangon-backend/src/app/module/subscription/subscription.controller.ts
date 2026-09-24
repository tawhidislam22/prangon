import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { SubscriptionService } from "./subscription.service";

const createSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await SubscriptionService.createSubscription(userId, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Subscription created successfully",
    data: result,
  });
});

const getSubscriptionByWorkspace = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const workspaceId = req.params.workspaceId as string;

  const result = await SubscriptionService.getSubscriptionByWorkspace(userId, workspaceId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Subscription retrieved successfully",
    data: result,
  });
});

const updateSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const workspaceId = req.params.workspaceId as string;
  const result = await SubscriptionService.updateSubscription(userId, workspaceId, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Subscription updated successfully",
    data: result,
  });
});

export const SubscriptionController = {
  createSubscription,
  getSubscriptionByWorkspace,
  updateSubscription,
};
