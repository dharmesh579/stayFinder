import {
  createReviewService,
  getListingReviewsService,
  deleteReviewService,
} from "../services/review.service.js";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createReviewController = asyncHandler(async (req, res) => {
  const review = await createReviewService(
    req.params.listingId,
    req.user._id,
    req.body,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Review created successfully"));
});

export const getListingReviewsController = asyncHandler(async (req, res) => {
  const reviews = await getListingReviewsService(req.params.listingId);

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

export const deleteReviewController = asyncHandler(async (req, res) => {
  await deleteReviewService(req.params.reviewId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully"));
});
