import { Router } from "express";
import {
  addAddress,
  addToWishlist,
  deleteAddresses,
  getAddresses,
  getWishlist,
  removeFromWishlist,
  updateAddresses,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

//Adress
router.post("/addresses", addAddress);
router.get("/addresses", getAddresses);
router.put("/addresses/:addressId", updateAddresses);
router.delete("/addresses/:addressId", deleteAddresses);

//Wishlist

router.post("/wishlist", addToWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);
router.get("/wishlist", getWishlist);

export default router;
