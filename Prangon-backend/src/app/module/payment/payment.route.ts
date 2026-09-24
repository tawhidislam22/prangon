import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

const router = Router();

router.post(
    "/checkout",
    checkAuth(),
    validateRequest(PaymentValidation.createCheckoutSessionZodSchema),
    PaymentController.createCheckoutSession
);

router.post(
    "/create-checkout-session",
    checkAuth(),
    validateRequest(PaymentValidation.createCheckoutSessionZodSchema),
    PaymentController.createCheckoutSession
);

router.post(
    "/portal",
    checkAuth(),
    validateRequest(PaymentValidation.createCustomerPortalSessionZodSchema),
    PaymentController.createCustomerPortalSession
);

export const PaymentRoutes = router;