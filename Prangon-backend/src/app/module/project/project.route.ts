import { Router } from "express";
import { ProjectController } from "./project.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { ProjectValidation } from "./project.validation";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post(
  "/",
  checkAuth(),
  validateRequest(ProjectValidation.createProjectSchema),
  ProjectController.createProject
);

router.get(
  "/",
  checkAuth(),
  ProjectController.getProjectsByWorkspace
);

router.get(
  "/:projectId",
  checkAuth(),
  ProjectController.getProjectById
);

router.patch(
  "/:projectId",
  checkAuth(),
  validateRequest(ProjectValidation.updateProjectSchema),
  ProjectController.updateProject
);

router.delete(
  "/:projectId",
  checkAuth(),
  ProjectController.deleteProject
);

export const ProjectRoutes = router;
