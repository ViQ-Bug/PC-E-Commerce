import { Router } from "express";
import {
  createProduct,
  getAllCustomers,
  getAllOders,
  getAllProducts,
  getDashboardStats,
  updateOrderStatus,
  updateProduct,
} from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(protectRoute, adminOnly);

router.post("/products", upload.array("images", 3), createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.array("images", 3), updateProduct);
//PUT: update all
router.get("/orders", getAllOders);
router.patch("/orders/:orderId/status", updateOrderStatus);
//PATHCH: update 1 field
router.get("/custormers", getAllCustomers);
router.get("/stats", getDashboardStats);
export default router;
