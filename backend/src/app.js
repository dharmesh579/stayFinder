import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import listingRoutes from "./routes/listing.route.js";
import reviewRoutes from "./routes/review.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/listings", listingRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.use(errorHandler);

export default app;
