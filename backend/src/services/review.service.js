import Review from "../models/review.model.js";
import Listing from "../models/listing.model.js";
import ApiError from "../utils/ApiError.js";

export const createReviewService = async (listingId, userId, reviewData) => {
  // 1. Check if listing exists
  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  if (listing.owner.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot review your own listing");
  }

  // 2. Check if user already reviewed this listing
  const existingReview = await Review.findOne({
    listing: listingId,
    user: userId,
  });

  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this listing");
  }

  // 3. Create review
  const review = await Review.create({
    rating: reviewData.rating,
    comment: reviewData.comment,
    user: userId,
    listing: listingId,
  });

  // 4. Update listing rating information
  const reviews = await Review.find({ listing: listingId });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

  const averageRating = totalRating / reviews.length;

  listing.rating = Number(averageRating.toFixed(1));
  listing.reviewCount = reviews.length;

  await listing.save();

  return review;
};

export const getListingReviewsService = async (listingId) => {
  const listing = await Listing.findById(listingId);

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  const reviews = await Review.find({ listing: listingId })
    .populate("user", "fullName avatar")
    .sort({ createdAt: -1 });

  return reviews;
};

export const deleteReviewService = async (reviewId, userId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Only the review owner can delete it
  if (review.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this review");
  }

  const listingId = review.listing;

  await review.deleteOne();

  // Recalculate listing rating
  const reviews = await Review.find({
    listing: listingId,
  });

  if (reviews.length === 0) {
    await Listing.findByIdAndUpdate(listingId, {
      rating: 0,
      reviewCount: 0,
    });
  } else {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

    const averageRating = totalRating / reviews.length;

    await Listing.findByIdAndUpdate(listingId, {
      rating: Number(averageRating.toFixed(1)),
      reviewCount: reviews.length,
    });
  }
};
