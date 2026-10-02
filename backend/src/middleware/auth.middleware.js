import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Please login to continue");

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.userId);

  if (!user) throw new ApiError(401, "User no longer exists");

  req.user = user;

  next();
});

export default authenticate;
