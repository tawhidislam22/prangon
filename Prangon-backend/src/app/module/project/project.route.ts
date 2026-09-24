import { Router } from "express";
import { ProjectController } from "./project.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { ProjectValidation } from "./project.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  validateRequest(ProjectValidation.createProjectSchema),
  ProjectController.createProject
);

router.get(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  ProjectController.getProjectsByWorkspace
);

router.get(
  "/:projectId",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  ProjectController.getProjectById
);

router.patch(
  "/:projectId",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  validateRequest(ProjectValidation.updateProjectSchema),
  ProjectController.updateProject
);

router.delete(
  "/:projectId",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  ProjectController.deleteProject
);

export const ProjectRoutes = router;
