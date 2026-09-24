import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status";

export const requireCompletedOnboarding = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const target = (req as any).workspaceId || req.params.workspaceId || req.params.id || req.params.slug;

    if (!target) {
      throw new AppError(httpStatus.BAD_REQUEST, "Workspace context missing");
    }

    const workspace = await (prisma as any).workspace.findFirst({
      where: {
        OR: [{ id: target }, { slug: target }],
      },
      select: { id: true, onboardingStatus: true },
    });

    if (!workspace) {
      throw new AppError(httpStatus.NOT_FOUND, "Workspace not found");
    }

    // Auto-mark completed if workspace already exists but status was still pending creation
    if (workspace.onboardingStatus === "PENDING_WORKSPACE") {
      await (prisma as any).workspace.update({
        where: { id: workspace.id },
        data: { onboardingStatus: "COMPLETED" },
      }).catch(() => {});
      return next();
    }

    if (workspace.onboardingStatus !== "COMPLETED") {
      if (workspace.onboardingStatus === "PENDING_PAYMENT") {
        throw new AppError(
          httpStatus.PAYMENT_REQUIRED,
          "Payment required to access this workspace"
        );
      }
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Please complete workspace onboarding to access this workspace"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};