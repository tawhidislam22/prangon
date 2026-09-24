import { Response } from "express";

interface IResponseData<T> {
    httpStatusCode?: number;
    statusCode?: number;
    success: boolean;
    message: string;
    data?: T;
    meta ?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
}

export const sendResponse = <T>(res: Response, responseData: IResponseData<T>) => {
    const httpStatusCode = responseData.httpStatusCode || responseData.statusCode || 200;
    const { success, message, data, meta } = responseData;

    res.status(httpStatusCode).json({
        success,
        message,
        data,
        meta
    });
}