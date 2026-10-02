import { Router } from "express";
import {
  createListingController,
  getAllListingsController,
  getListingByIdController,
  getMyListingsController,
  updateListingController,
  deleteListingController,
} from "../controllers/listing.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createListingSchema,
  updateListingSchema,
} from "../validators/listing.validator.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  validate(createListingSchema),
  createListingController,
);
router.get("/my-listings", authenticate, getMyListingsController);
router.get("/", getAllListingsController);
router.get("/:id", getListingByIdController);
router.put(
  "/:id",
  authenticate,
  validate(updateListingSchema),
  updateListingController,
);
router.delete("/:id", authenticate, deleteListingController);

export default router;
