import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { WorkspaceRole } from "../../generated/prisma/enums";
import AppError from "../errorHelpers/AppError";
import { prisma } from "../lib/prisma";

export const requireRole = (...allowedRoles: WorkspaceRole[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
      }

      const workspaceSlug =
        req.params.slug ||
        req.params.workspaceSlug ||
        req.query.workspaceSlug ||
        (req.body && req.body.workspaceSlug);

      const workspaceId =
        (req as any).workspaceId ||
        req.params.workspaceId ||
        req.params.id ||
        (req.body && req.body.workspaceId);

      if (!workspaceSlug && !workspaceId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Workspace context missing");
      }

      // Find workspace
      const workspace = await prisma.workspace.findFirst({
        where: workspaceId
          ? { id: String(workspaceId) }
          : { slug: String(workspaceSlug) },
        select: {
          id: true,
          slug: true,
          ownerId: true,
        },
      });

      if (!workspace) {
        throw new AppError(httpStatus.NOT_FOUND, "Workspace not found");
      }

      (req as any).workspaceId = workspace.id;
      (req as any).workspaceSlug = workspace.slug;

      // Platform super admin bypasses workspace checks
      if (req.user.role === "SUPER_ADMIN") {
        return next();
      }

      // Check membership
      const membership = await prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: workspace.id,
            userId,
          },
        },
      });

      if (!membership) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not a member of this workspace"
        );
      }

      (req as any).workspaceMember = membership;

      if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          `Forbidden: Action requires role ${allowedRoles.join(" or ")}, but your role is ${membership.role}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
