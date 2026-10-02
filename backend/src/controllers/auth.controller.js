import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  registerService,
  loginService,
  verifyEmailService,
  resendVerificationService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service.js";
import { cookieOptions } from "../config/cookie.config.js";
import { success } from "zod";

export const registerController = asyncHandler(async (req, res) => {
  const { jwtToken, user } = await registerService(req.body);

  const responseUser = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };

  res.cookie("token", jwtToken, cookieOptions);

  return res
    .status(201)
    .json(new ApiResponse(201, responseUser, "User registered successfully"));
});

export const loginController = asyncHandler(async (req, res) => {
  const { user, token } = await loginService(req.body);

  res.cookie("token", token, cookieOptions);

  return res.status(200).json(new ApiResponse(200, user, "Login successfull"));
});

export const logoutController = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json(new ApiResponse(200, null, "Logout successfull"));
});

export const profileController = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Profile fetched successfully"));
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  const { token } = req.params;
  await verifyEmailService(token);
  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

export const resendVerificationController = asyncHandler(async (req, res) => {
  await resendVerificationService(req.user.id);

  res.status(200).json({
    success: true,
    message: "verification email sent successfully",
  });
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await forgotPasswordService(email);

  res.status(200).json({
    success: true,
    message:
      "If an account exists with this email,a password reset link has been sent.",
  });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  await resetPasswordService({
    token,
    password,
  });
  res.status(200).json({
    success: true,
    message: "Password reset successfully.",
  });
});
