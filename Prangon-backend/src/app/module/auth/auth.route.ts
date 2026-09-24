import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post('/register',AuthController.registerUser)
router.post('/login',AuthController.loginUser)

router.route('/me')
    .get(
        checkAuth(Role.SUPER_ADMIN, Role.USER),
        AuthController.getMe
    )
    .post(
        checkAuth(Role.SUPER_ADMIN, Role.USER),
        AuthController.getMe
    )

router.post('/refresh-token',AuthController.getNewToken)
router.post('/change-password',
    checkAuth(Role.SUPER_ADMIN, Role.USER),
    AuthController.changePassword)
router.post('/logout',
    checkAuth(Role.SUPER_ADMIN, Role.USER),
    AuthController.logoutUser
)

router.post('/verify-email', AuthController.verifyEmail);
router.post('/resend-verification-otp', AuthController.resendVerificationOtp);
router.post('/forget-password', AuthController.forgetPassword);
router.post('/reset-password', AuthController.resetPassword);

router.get('/login/google',AuthController.googleLogin)
router.get('/google/success',AuthController.googleLoginSuccess)
router.get('/google/error',AuthController.handleOAuthError)
export const AuthRoutes = router;
