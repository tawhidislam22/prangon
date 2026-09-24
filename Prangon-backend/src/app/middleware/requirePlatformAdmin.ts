/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { PlatformRole } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { prisma } from "../lib/prisma";
import { CookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";

export const requirePlatformAdmin =
  (...allowedRoles: PlatformRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = CookieUtils.getCookie(req, "accessToken");

      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized! No access token provided."
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET
      );

      if (!verifiedToken.success || !verifiedToken.data) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized! Invalid token.");
      }

      const userId = verifiedToken.data.userId as string;
      const email = verifiedToken.data.email as string;

      // Check platformAdmin table or user email
      let admin = await prisma.platformAdmin.findFirst({
        where: {
          OR: [{ userId }, { user: { email } }],
        },
        include: {
          user: true,
        },
      });

      // Auto-provision if SUPER_ADMIN in user model
      if (!admin && verifiedToken.data.role === "SUPER_ADMIN") {
        const dbUser = await prisma.user.findFirst({
          where: { OR: [{ id: userId }, { email }] },
        });

        if (dbUser) {
          admin = await prisma.platformAdmin.upsert({
            where: { userId: dbUser.id },
            create: {
              userId: dbUser.id,
              role: "SUPER_ADMIN",
            },
            update: {},
            include: { user: true },
          });
        }
      }

      if (!admin) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden! You do not have platform admin privileges."
        );
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(admin.role)) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden! Insufficient platform role."
        );
      }

      (req as any).platformAdmin = admin;
      (req as any).user = {
        userId: admin.userId,
        role: admin.role,
        email: admin.user?.email || email,
      };

      next();
    } catch (error: any) {
      next(error);
    }
  };
