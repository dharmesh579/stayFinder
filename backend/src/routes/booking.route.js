import { Router } from "express";
import {
  createBookingController,
  getMyBookingsController,
  getHostBookingsController,
  getBookedDatesController,
  updateBookingStatusController,
  cancelBookingController,
} from "../controllers/booking.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from "../validators/booking.validator.js";

const router = Router();

router.get("/listing/:listingId/booked-dates", getBookedDatesController);
router.post(
  "/listing/:listingId",
  authenticate,
  validate(createBookingSchema),
  createBookingController,
);
router.get("/my", authenticate, getMyBookingsController);
router.get("/host", authenticate, getHostBookingsController);
router.patch(
  "/:bookingId/status",
  authenticate,
  validate(updateBookingStatusSchema),
  updateBookingStatusController,
);
router.patch("/:bookingId/cancel", authenticate, cancelBookingController);

export default router;
