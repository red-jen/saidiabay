import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { registerSchema, loginSchema } from '../../lib/validators/auth';

const router = Router();
const authController = new AuthController();

// ============================================
// EXISTING ROUTES
// ============================================
router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.post('/login/verify-otp', authController.loginStep2Admin.bind(authController));
router.get('/profile', authenticate, authController.getProfile.bind(authController));
router.post('/logout', authController.logout.bind(authController));

// ============================================
// NEW FORGOT PASSWORD ROUTES
// ============================================

/**
 * POST /api/auth/forgot-password/request
 * Request password reset - sends OTP to email
 * Body: { email: string }
 */
router.post('/forgot-password/request', authController.requestPasswordReset.bind(authController));

/**
 * POST /api/auth/forgot-password/reset
 * Reset password with OTP code
 * Body: { email: string, otpCode: string, newPassword: string }
 */
router.post('/forgot-password/reset', authController.resetPassword.bind(authController));

// ============================================
// NEW PROFILE UPDATE ROUTES (Authenticated)
// ============================================

/**
 * POST /api/auth/profile/change-password
 * Change password (requires current password + OTP)
 * Body: { currentPassword: string, newPassword: string }
 */
router.post('/profile/change-password', authenticate, authController.changePassword.bind(authController));

/**
 * POST /api/auth/profile/request-email-change
 * Request email change - sends OTP to new email
 * Body: { newEmail: string }
 */
router.post('/profile/request-email-change', authenticate, authController.requestEmailChange.bind(authController));

/**
 * POST /api/auth/profile/confirm-email-change
 * Confirm email change with OTP
 * Body: { newEmail: string, otpCode: string }
 */
router.post('/profile/confirm-email-change', authenticate, authController.confirmEmailChange.bind(authController));

/**
 * POST /api/auth/profile/request-phone-change
 * Request phone change - sends OTP to current email
 * Body: { newPhone: string }
 */
router.post('/profile/request-phone-change', authenticate, authController.requestPhoneChange.bind(authController));

/**
 * POST /api/auth/profile/confirm-phone-change
 * Confirm phone change with OTP
 * Body: { newPhone: string, otpCode: string }
 */
router.post('/profile/confirm-phone-change', authenticate, authController.confirmPhoneChange.bind(authController));

export default router;