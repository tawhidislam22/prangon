import { Router } from "express";
import { TaskController } from "./task.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { TaskValidation } from "./task.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { taskCommentController } from "../taskComment/taskComment.controller";
import { taskCommentValidation } from "../taskComment/taskComment.validation";

const router = Router();

router.post(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  validateRequest(TaskValidation.createTaskSchema),
  TaskController.createTask
);

router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  TaskController.getTasksByProject
);

router.get(
  "/:taskId",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  TaskController.getTaskById
);

router.patch(
  "/:taskId",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  validateRequest(TaskValidation.updateTaskSchema),
  TaskController.updateTask
);

router.delete(
  "/:taskId",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  TaskController.deleteTask
);

// Comments sub-routes
router.post(
  "/:taskId/comments",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  validateRequest(taskCommentValidation.addCommentSchema),
  taskCommentController.addComment
);

router.get(
  "/:taskId/comments",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  taskCommentController.listComments
);

export const TaskRoutes = router;

