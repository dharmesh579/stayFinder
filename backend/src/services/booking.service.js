import Booking from "../models/booking.model.js";
import Listing from "../models/listing.model.js";
import ApiError from "../utils/ApiError.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const ACTIVE_STATUSES = ["pending", "confirmed"];

const populateBooking = (query) =>
  query
    .populate("listing", "title location country mainImage price")
    .populate("guest", "fullName email avatar")
    .populate("host", "fullName email avatar");

// A booking overlaps when it starts before the new one ends
// and ends after the new one starts (check-out day is free for the next guest).
const hasOverlap = async (listingId, checkIn, checkOut, excludeId) => {
  const filter = {
    listing: listingId,
    status: { $in: ACTIVE_STATUSES },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };
  if (excludeId) filter._id = { $ne: excludeId };
  return Boolean(await Booking.exists(filter));
};

export const createBookingService = async (listingId, guestId, data) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new ApiError(404, "Listing not found");
  if (!listing.isAvailable) {
    throw new ApiError(400, "This listing is currently unavailable");
  }
  if (listing.owner.toString() === guestId.toString()) {
    throw new ApiError(400, "You cannot book your own listing");
  }

  const { checkIn, checkOut, guests } = data;

  if (await hasOverlap(listing._id, checkIn, checkOut)) {
    throw new ApiError(409, "These dates are not available for this listing");
  }

  const nights = Math.round((checkOut - checkIn) / DAY_MS);

  const booking = await Booking.create({
    listing: listing._id,
    guest: guestId,
    host: listing.owner,
    checkIn,
    checkOut,
    guests,
    nights,
    pricePerNight: listing.price,
    totalPrice: nights * listing.price,
  });

  return populateBooking(Booking.findById(booking._id));
};

export const getMyBookingsService = async (guestId) =>
  populateBooking(Booking.find({ guest: guestId }).sort({ createdAt: -1 }));

export const getHostBookingsService = async (hostId) =>
  populateBooking(Booking.find({ host: hostId }).sort({ createdAt: -1 }));

export const getBookedDatesService = async (listingId) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return Booking.find({
    listing: listingId,
    status: { $in: ACTIVE_STATUSES },
    checkOut: { $gt: today },
  })
    .select("checkIn checkOut status -_id")
    .sort({ checkIn: 1 });
};

export const updateBookingStatusService = async (bookingId, hostId, status) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  if (booking.host.toString() !== hostId.toString()) {
    throw new ApiError(403, "You are not authorized to manage this booking");
  }
  if (booking.status !== "pending") {
    throw new ApiError(400, `Booking is already ${booking.status}`);
  }

  booking.status = status;
  await booking.save();

  return populateBooking(Booking.findById(booking._id));
};

export const cancelBookingService = async (bookingId, guestId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  if (booking.guest.toString() !== guestId.toString()) {
    throw new ApiError(403, "You are not authorized to cancel this booking");
  }
  if (!ACTIVE_STATUSES.includes(booking.status)) {
    throw new ApiError(400, `Booking is already ${booking.status}`);
  }

  booking.status = "cancelled";
  await booking.save();

  return populateBooking(Booking.findById(booking._id));
};
