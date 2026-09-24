import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { taskCommentValidation } from "./taskComment.validation";
import { taskCommentController } from "./taskComment.controller";

const router = Router();

router.post(
    "/:taskId/comments",
    checkAuth(),
    validateRequest(taskCommentValidation.addCommentSchema),
    taskCommentController.addComment
);

router.get(
    "/:taskId/comments",
    checkAuth(),
    taskCommentController.listComments
);

export const taskCommentRoutes = router;
