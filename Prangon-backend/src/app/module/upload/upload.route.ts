import { Router } from "express";
import multer from "multer";
import { UploadController } from "./upload.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { UploadValidation } from "./upload.validation";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

// Configure multer for memory storage so we get req.file.buffer
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/",
    checkAuth(), // Requires user to be authenticated
    upload.single("file"),
    UploadController.uploadFile
);

router.delete(
    "/",
    checkAuth(),
    validateRequest(UploadValidation.deleteFileZodSchema),
    UploadController.deleteFile
);

export const UploadRoutes = router;
