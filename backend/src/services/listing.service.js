import Listing from "../models/listing.model.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";

export const createListingService = async (listingData, ownerId, files) => {
  const mainImageFile = files.mainImage[0];
  const galleryImageFiles = files.images || [];

  const uploadedGalleryImages = [];

  for (const image of galleryImageFiles) {
    const uploadedImage = await uploadToCloudinary(image.buffer);

    uploadedGalleryImages.push({
      public_id: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    });
  }

  const uploadedMainImage = await uploadToCloudinary(mainImageFile.buffer);
  const listing = await Listing.create({
    ...listingData,

    owner: ownerId,
    mainImage: {
      public_id: uploadedMainImage.public_id,
      url: uploadedMainImage.secure_url,
    },
    images: uploadedGalleryImages,
  });

  return listing;
};

export const getAllListingsService = async () => {
  const listings = await Listing.find()
    .populate("owner", "fullName email avatar")
    .sort({ createdAt: -1 });

  return listings;
};

export const getListingByIdService = async (listingId) => {
  const listing = await Listing.findById(listingId).populate(
    "owner",
    "fullName email avatar",
  );

  if (!listing) throw new ApiError(404, "Listing not found");

  return listing;
};

export const updateListingService = async (listingId, updatedData, userId) => {
  const listing = await Listing.findById(listingId);

  if (!listing) throw new ApiError(404, "Error not found");

  if (listing.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this listing");
  }

  Object.assign(listing, updatedData);

  await listing.save();

  return listing;
};

export const deleteListingService = async (listingId, userId) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new ApiError(404, "Listing not found");

  if (listing.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this listing");
  }
  await cloudinary.uploader.destroy(listing.mainImage.public_id);

  for (const image of listing.images) {
    await cloudinary.uploader.destroy(image.public_id);
  }

  await listing.deleteOne();

  return;
};

export const getMyListingsService = async (userId) => {
  const listings = await Listing.find({
    owner: userId,
  }).populate("owner", "fullName email avatar");

  return listings;
};
