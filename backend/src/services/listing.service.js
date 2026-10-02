import Listing from "../models/listing.model.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";

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

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating: { rating: -1, reviewCount: -1 },
};

export const getAllListingsService = async (query = {}) => {
  const { location, category, minPrice, maxPrice, sort } = query;
  const filter = {};

  if (location?.trim()) {
    const regex = new RegExp(escapeRegex(location.trim()), "i");
    filter.$or = [{ location: regex }, { country: regex }, { title: regex }];
  }

  if (category) filter.category = category;

  const min = Number(minPrice);
  const max = Number(maxPrice);
  if ((minPrice && !Number.isNaN(min)) || (maxPrice && !Number.isNaN(max))) {
    filter.price = {};
    if (minPrice && !Number.isNaN(min)) filter.price.$gte = min;
    if (maxPrice && !Number.isNaN(max) && max > 0) filter.price.$lte = max;
    if (Object.keys(filter.price).length === 0) delete filter.price;
  }

  return Listing.find(filter)
    .populate("owner", "fullName email avatar")
    .sort(SORT_OPTIONS[sort] || SORT_OPTIONS.newest);
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

  const activeBooking = await Booking.exists({
    listing: listing._id,
    status: { $in: ["pending", "confirmed"] },
    checkOut: { $gt: new Date() },
  });
  if (activeBooking) {
    throw new ApiError(
      400,
      "This listing has upcoming bookings. Resolve them before deleting.",
    );
  }

  await cloudinary.uploader.destroy(listing.mainImage.public_id);

  for (const image of listing.images) {
    await cloudinary.uploader.destroy(image.public_id);
  }

  await Promise.all([
    Booking.deleteMany({ listing: listing._id }),
    Review.deleteMany({ listing: listing._id }),
    User.updateMany({}, { $pull: { wishlist: listing._id } }),
  ]);

  await listing.deleteOne();

  return;
};

export const getMyListingsService = async (userId) => {
  const listings = await Listing.find({
    owner: userId,
  }).populate("owner", "fullName email avatar");

  return listings;
};
