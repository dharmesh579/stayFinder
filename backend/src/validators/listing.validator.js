import { z } from "zod";

export const createListingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(20, "Descripton must be at least 20 characters")
    .max(2000, "Description cannot exceed 2000 characters"),

  price: z.coerce.number().positive("Price must be greater than 0"),

  country: z.string().trim().min(2, "Country is required"),

  location: z.string().trim().min(2, "Location is required"),

  category: z.enum([
    "Apartment",
    "Villa",
    "Cabin",
    "Hotel",
    "Resort",
    "Beach",
    "Mountain",
    "Camping",
    "Farmhouse",
    "Treehouse",
  ]),

  amenities: z.array(z.string()).optional(),
});

export const updateListingSchema = createListingSchema.partial();
