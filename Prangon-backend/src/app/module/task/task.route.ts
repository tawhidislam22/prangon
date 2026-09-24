import { Router } from "express";
import { TaskController } from "./task.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { TaskValidation } from "./task.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { taskCommentController } from "../taskComment/taskComment.controller";
import { taskCommentValidation } from "../taskComment/taskComment.validation";

const router = Router();

router.post(
  "/",
  checkAuth(),
  validateRequest(TaskValidation.createTaskSchema),
  TaskController.createTask
);

router.get(
  "/",
  checkAuth(),
  TaskController.getTasksByProject
);

router.get(
  "/:taskId",
  checkAuth(),
  TaskController.getTaskById
);

router.patch(
  "/:taskId",
  checkAuth(),
  validateRequest(TaskValidation.updateTaskSchema),
  TaskController.updateTask
);

router.delete(
  "/:taskId",
  checkAuth(),
  TaskController.deleteTask
);

// Comments sub-routes
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

export const TaskRoutes = router;

