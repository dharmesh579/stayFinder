import {
  toggleWishlistService,
  getWishlistService,
} from "../services/wishlist.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const toggleWishlistController = asyncHandler(async (req, res) => {
  const result = await toggleWishlistService(req.user._id, req.params.listingId);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        result.saved ? "Added to wishlist" : "Removed from wishlist",
      ),
    );
});

export const getWishlistController = asyncHandler(async (req, res) => {
  const listings = await getWishlistService(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, listings, "Wishlist fetched successfully"));
});
