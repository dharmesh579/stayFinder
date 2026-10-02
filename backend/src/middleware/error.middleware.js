const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired. Please login again";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value. This record already exists";
  } else if (err.name === "MulterError") {
    statusCode = 400;
  }

  if (statusCode === 500) console.error(err);

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
