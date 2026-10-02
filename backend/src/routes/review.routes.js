import { Router } from "express";

import {
  createReviewController,
  getListingReviewsController,
  deleteReviewController,
} from "../controllers/review.controller.js";

import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.get("/listing/:listingId", getListingReviewsController);
router.post("/listing/:listingId", authenticate, createReviewController);
router.delete("/:reviewId", authenticate, deleteReviewController);

export default router;
