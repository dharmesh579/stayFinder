import {
  createBookingService,
  getMyBookingsService,
  getHostBookingsService,
  getBookedDatesService,
  updateBookingStatusService,
  cancelBookingService,
} from "../services/booking.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createBookingController = asyncHandler(async (req, res) => {
  const booking = await createBookingService(
    req.params.listingId,
    req.user._id,
    req.body,
  );
  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking request sent successfully"));
});

export const getMyBookingsController = asyncHandler(async (req, res) => {
  const bookings = await getMyBookingsService(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
});

export const getHostBookingsController = asyncHandler(async (req, res) => {
  const bookings = await getHostBookingsService(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, bookings, "Booking requests fetched successfully"));
});

export const getBookedDatesController = asyncHandler(async (req, res) => {
  const dates = await getBookedDatesService(req.params.listingId);
  return res
    .status(200)
    .json(new ApiResponse(200, dates, "Booked dates fetched successfully"));
});

export const updateBookingStatusController = asyncHandler(async (req, res) => {
  const booking = await updateBookingStatusService(
    req.params.bookingId,
    req.user._id,
    req.body.status,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, booking, `Booking ${booking.status}`));
});

export const cancelBookingController = asyncHandler(async (req, res) => {
  const booking = await cancelBookingService(req.params.bookingId, req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking cancelled"));
});
