import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post('/register',AuthController.registerUser)
router.post('/login',AuthController.loginUser)

router.route('/me')
    .get(
        checkAuth(),
        AuthController.getMe
    )
    .post(
        checkAuth(),
        AuthController.getMe
    )

router.post('/refresh-token',AuthController.getNewToken)
router.post('/change-password',
    checkAuth(),
    AuthController.changePassword)
router.post('/logout',
    checkAuth(),
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
