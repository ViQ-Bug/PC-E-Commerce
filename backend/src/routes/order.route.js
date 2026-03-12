import { Router } from "express";
import { createOrder, getUserOrder } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.post("/", createOrder);
router.get("/", getUserOrder);

export default router;
