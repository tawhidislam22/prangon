import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { taskCommentValidation } from "./taskComment.validation";
import { taskCommentController } from "./taskComment.controller";

const router = Router();

router.post(
    "/:taskId/comments",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    validateRequest(taskCommentValidation.addCommentSchema),
    taskCommentController.addComment
);

router.get(
    "/:taskId/comments",
    checkAuth(Role.USER, Role.SUPER_ADMIN),
    taskCommentController.listComments
);

export const taskCommentRoutes = router;
