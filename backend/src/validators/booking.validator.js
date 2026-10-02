import { z } from "zod";

const startOfTodayUTC = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

export const createBookingSchema = z
  .object({
    checkIn: z.coerce.date({ message: "Valid check-in date is required" }),
    checkOut: z.coerce.date({ message: "Valid check-out date is required" }),
    guests: z.coerce
      .number()
      .int("Guests must be a whole number")
      .min(1, "At least 1 guest is required")
      .max(20, "Maximum 20 guests allowed"),
  })
  .refine((d) => d.checkIn >= startOfTodayUTC(), {
    message: "Check-in date cannot be in the past",
    path: ["checkIn"],
  })
  .refine((d) => d.checkOut > d.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export const updateBookingStatusSchema = z.object({
  status: z.enum(["confirmed", "rejected"], {
    message: "Status must be confirmed or rejected",
  }),
});
