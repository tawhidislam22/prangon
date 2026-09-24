import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { SubscriptionValidation } from "./subscription.validation";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post(
  "/",
  checkAuth(),
  validateRequest(SubscriptionValidation.createSubscriptionSchema),
  SubscriptionController.createSubscription
);

router.get(
  "/:workspaceId",
  checkAuth(),
  SubscriptionController.getSubscriptionByWorkspace
);

router.patch(
  "/:workspaceId",
  checkAuth(),
  validateRequest(SubscriptionValidation.updateSubscriptionSchema),
  SubscriptionController.updateSubscription
);

export const SubscriptionRoutes = router;
