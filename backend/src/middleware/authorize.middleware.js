import ApiError from "../utils/ApiError.js";

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You are not authroized to perfrom this operation",
      );
    }
    next();
  };
};

export default authorize;
