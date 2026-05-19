import { Router } from "express";
import {
  createPaymentIntent,
  createPayOSPayment,
  handleWebhook,
  payOSWebhook,
} from "../controllers/payment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create-intent", protectRoute, createPaymentIntent);

router.post("/webhook", handleWebhook);

router.post("/create-payos", createPayOSPayment);

router.post("/payos-webhook", payOSWebhook);
export default router;
