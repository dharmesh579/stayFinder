import {
  createListingService,
  getAllListingsService,
  getListingByIdService,
  getMyListingsService,
  updateListingService,
  deleteListingService,
} from "../services/listing.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const createListingController = asyncHandler(async (req, res) => {
  if (!req.files?.mainImage?.length) {
    throw new ApiError(400, "Main image is required");
  }

  const listing = await createListingService(req.body, req.user._id, req.files);

  return res
    .status(201)
    .json(new ApiResponse(201, listing, "Listing created successfully"));
});

export const getAllListingsController = asyncHandler(async (req, res) => {
  const listings = await getAllListingsService(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, listings, "Listings fetched successfully"));
});

export const getListingByIdController = asyncHandler(async (req, res) => {
  const listing = await getListingByIdService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, listing, "Listing fetched successfully"));
});

export const updateListingController = asyncHandler(async (req, res) => {
  const listing = await updateListingService(
    req.params.id,
    req.body,
    req.user._id,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, listing, "Listing updated successfully"));
});

export const deleteListingController = asyncHandler(async (req, res) => {
  await deleteListingService(req.params.id, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Listing deleted successfully"));
});

export const getMyListingsController = asyncHandler(async (req, res) => {
  const listings = await getMyListingsService(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, listings, "Your listings fetched successfully"));
});
