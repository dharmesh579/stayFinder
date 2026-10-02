import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import verifyEmailTemplate from "../templates/verifyEmailTemplate.js";
import forgotPasswordTemplate from "../templates/forgotPasswordTemplate.js";

import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

export const registerService = async ({ fullName, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) throw new ApiError(409, "User already exists");

  const hashedPassword = await bcrypt.hash(password, 12);

  const { token, hashedToken } = generateVerificationToken();

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const html = verifyEmailTemplate(verificationLink);
  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your StayFinder Account",
      html,
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }

  const jwtToken = generateToken(user._id);

  return {
    user,
    jwtToken,
  };
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);

  user.password = undefined;

  return {
    user,
    token,
  };
};

export const verifyEmailService = async (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: {
      $gt: new Date(),
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification link");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;

  await user.save();

  return user;
};

export const resendVerificationService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { token, hashedToken } = generateVerificationToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await user.save();

  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const html = verifyEmailTemplate(verificationLink);

  await sendEmail({
    to: user.email,
    subject: "Verify your stayFinder Account",
    html,
  });

  return;
};

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return;

  const { token, hashedToken } = generateVerificationToken();

  user.passwordResetToken = hashedToken;

  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const html = forgotPasswordTemplate(resetLink);

  await sendEmail({
    to: user.email,
    subject: "Reset your stayFinder Password",
    html,
  });

  return;
};

export const resetPasswordService = async ({ token, password }) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: new Date(),
    },
  });
  if (!user) {
    throw new ApiError(400, "Invalid or expired reset link.");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  await user.save();
};
