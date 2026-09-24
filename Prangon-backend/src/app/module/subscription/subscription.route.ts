import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { SubscriptionValidation } from "./subscription.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  validateRequest(SubscriptionValidation.createSubscriptionSchema),
  SubscriptionController.createSubscription
);

router.get(
  "/:workspaceId",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  SubscriptionController.getSubscriptionByWorkspace
);

router.patch(
  "/:workspaceId",
  checkAuth(Role.SUPER_ADMIN, Role.USER),
  validateRequest(SubscriptionValidation.updateSubscriptionSchema),
  SubscriptionController.updateSubscription
);

export const SubscriptionRoutes = router;
