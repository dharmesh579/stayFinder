import { Router } from "express";

import {
  registerController,
  loginController,
  profileController,
  logoutController,
  verifyEmailController,
  resetPasswordController,
  forgotPasswordController,
  resendVerificationController,
} from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import authenticate from "../middleware/auth.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/logout", logoutController);
router.get("/profile", authenticate, profileController);
router.get("/verify-email/:token", verifyEmailController);
router.post("/resend-verification", authenticate, resendVerificationController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);

export default router;
