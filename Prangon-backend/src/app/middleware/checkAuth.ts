/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { prisma } from "../lib/prisma";
import { CookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";

export const checkAuth = (...authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Access Token Verification - Pure CPU (No DB hit per request)
        const accessToken = CookieUtils.getCookie(req, 'accessToken');

        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
        }

        const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

        if (!verifiedToken.success || !verifiedToken.data) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! Invalid access token.');
        }

        const userRole = verifiedToken.data.role as Role;
        const isAllowed = authRoles.length === 0 || authRoles.includes(userRole);

        if (!isAllowed) {
            throw new AppError(status.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
        }

        req.user = {
            userId: verifiedToken.data.userId as string,
            role: userRole,
            email: verifiedToken.data.email as string,
        };

        next();
    } catch (error: any) {
        next(error);
    }
};