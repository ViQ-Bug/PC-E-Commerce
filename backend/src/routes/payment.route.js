import { Router } from "express";
import {
  createPaymentIntent,
  handleWebhook,
} from "../controllers/payment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create-intent", protectRoute, createPaymentIntent);

router.post("/webhook", handleWebhook);

// router.post("/payos/create-link", protectRoute, createPayOSLink);
export default router;
