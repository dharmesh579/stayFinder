import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.route.js";
import listingRoutes from "./routes/listing.route.js";
import reviewRoutes from "./routes/review.routes.js";
import bookingRoutes from "./routes/booking.route.js";
import wishlistRoutes from "./routes/wishlist.route.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());
app.use(compression());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later",
  },
});

app.get("/api/v1/health", (req, res) => res.json({ success: true }));

app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/listings", listingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

export default app;
