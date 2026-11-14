import type { RequestHandler } from "express";

export const catchAsync = (handler: RequestHandler): RequestHandler => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error: unknown) {
            next(error);
        }
    };
};