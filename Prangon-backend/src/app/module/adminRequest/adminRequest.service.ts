import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { AdminRequestStatus, Role } from "../../../generated/prisma/enums";

const createAdminRequest = async (payload: {
  name: string;
  email: string;
  password: string;
  reason?: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "An account with this email already exists");
  }

  const existingRequest = await (prisma as any).adminRequest.findUnique({
    where: { email: payload.email },
  });
  if (existingRequest && existingRequest.status === AdminRequestStatus.PENDING) {
    throw new AppError(
      httpStatus.CONFLICT,
      "An admin request is already pending for this email"
    );
  }

  if (existingRequest) {
    return await (prisma as any).adminRequest.update({
      where: { email: payload.email },
      data: {
        name: payload.name,
        password: payload.password,
        reason: payload.reason,
        status: AdminRequestStatus.PENDING,
      },
    });
  }

  return await (prisma as any).adminRequest.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      reason: payload.reason,
      status: AdminRequestStatus.PENDING,
    },
  });
};

const getAllAdminRequests = async () => {
  return await (prisma as any).adminRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const acceptAdminRequest = async (id: string) => {
  const request = await (prisma as any).adminRequest.findUnique({ where: { id } });
  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin request not found");
  }

  try {
    const signupData = await auth.api.signUpEmail({
      body: {
        name: request.name,
        email: request.email,
        password: request.password,
      },
    });

    if (signupData?.user) {
      await prisma.user.update({
        where: { id: signupData.user.id },
        data: { role: Role.SUPER_ADMIN },
      });
    }
  } catch (error: any) {
    const user = await prisma.user.findUnique({ where: { email: request.email } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: Role.SUPER_ADMIN },
      });
    } else {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error?.message || "Failed to create admin account");
    }
  }

  return await (prisma as any).adminRequest.update({
    where: { id },
    data: { status: AdminRequestStatus.APPROVED },
  });
};

const deleteAdminRequest = async (id: string) => {
  const request = await (prisma as any).adminRequest.findUnique({ where: { id } });
  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin request not found");
  }

  return await (prisma as any).adminRequest.delete({
    where: { id },
  });
};

export const AdminRequestService = {
  createAdminRequest,
  getAllAdminRequests,
  acceptAdminRequest,
  deleteAdminRequest,
};