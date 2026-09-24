import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AdminRequestService } from "./adminRequest.service";

const createAdminRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminRequestService.createAdminRequest(req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Admin request submitted successfully. Awaiting administrator review.",
    data: { id: result.id, name: result.name, email: result.email, status: result.status },
  });
});

const getAllAdminRequests = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminRequestService.getAllAdminRequests();

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Admin requests retrieved successfully",
    data: result.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      reason: r.reason,
      status: r.status,
      createdAt: r.createdAt,
    })),
  });
});

const acceptAdminRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminRequestService.acceptAdminRequest(id as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Admin request accepted. Admin account activated.",
    data: result,
  });
});

const deleteAdminRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await AdminRequestService.deleteAdminRequest(id as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Admin request rejected and removed.",
    data: null,
  });
});

export const AdminRequestController = {
  createAdminRequest,
  getAllAdminRequests,
  acceptAdminRequest,
  deleteAdminRequest,
};