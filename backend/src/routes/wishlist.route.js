import { Router } from "express";
import {
  toggleWishlistController,
  getWishlistController,
} from "../controllers/wishlist.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getWishlistController);
router.post("/:listingId", authenticate, toggleWishlistController);

export default router;
