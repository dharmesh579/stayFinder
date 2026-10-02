import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import ApiError from "../utils/ApiError.js";

export const toggleWishlistService = async (userId, listingId) => {
  const listing = await Listing.exists({ _id: listingId });
  if (!listing) throw new ApiError(404, "Listing not found");

  const user = await User.findById(userId);
  const alreadySaved = user.wishlist.some((id) => id.toString() === listingId);

  const updated = await User.findByIdAndUpdate(
    userId,
    alreadySaved
      ? { $pull: { wishlist: listingId } }
      : { $addToSet: { wishlist: listingId } },
    { returnDocument: "after" },
  );

  return { saved: !alreadySaved, wishlist: updated.wishlist };
};

export const getWishlistService = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "wishlist",
    populate: { path: "owner", select: "fullName email avatar" },
  });
  return user.wishlist;
};
