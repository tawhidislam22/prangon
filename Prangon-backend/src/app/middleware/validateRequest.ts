import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateRequest = (zodSchema: ZodType<any, any, any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.body.data && typeof req.body.data === 'string') {
                req.body = JSON.parse(req.body.data);
            }

            const parsedResult = await zodSchema.safeParseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
            });

            if (!parsedResult.success) {
                return next(parsedResult.error);
            }

            // sanitizing the data
            if (parsedResult.data.body !== undefined) {
                req.body = parsedResult.data.body;
            }
            if (parsedResult.data.query !== undefined) {
                Object.defineProperty(req, 'query', { value: parsedResult.data.query, writable: true, enumerable: true, configurable: true });
            }
            if (parsedResult.data.params !== undefined) {
                Object.defineProperty(req, 'params', { value: parsedResult.data.params, writable: true, enumerable: true, configurable: true });
            }
            if (parsedResult.data.cookies !== undefined) {
                Object.defineProperty(req, 'cookies', { value: parsedResult.data.cookies, writable: true, enumerable: true, configurable: true });
            }

            return next();
        } catch (error) {
            return next(error);
        }
    };
};