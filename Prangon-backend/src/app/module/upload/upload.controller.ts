import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UploadService } from "./upload.service";

const uploadFile = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
        return sendResponse(res, {
            httpStatusCode: status.BAD_REQUEST,
            success: false,
            message: "No file provided for upload"
        });
    }

    const result = await UploadService.uploadFile(req.file.buffer, req.file.originalname);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "File uploaded successfully",
        data: result
    });
});

const deleteFile = catchAsync(async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
        return sendResponse(res, {
            httpStatusCode: status.BAD_REQUEST,
            success: false,
            message: "File URL is required"
        });
    }

    await UploadService.deleteFile(url);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "File deleted successfully",
        data: null
    });
});

export const UploadController = {
    uploadFile,
    deleteFile
};
