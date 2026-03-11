import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

      const user = await User.findOne({ clerkId });

      if (!user) return res.status(401).json({ message: "Unauthorized" });

      req.user = user;
    } catch (error) {
      console.log("Error in protectRoute middleware", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
];

export const adminOnly = (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ message: "Unauthorized - user not found" });
  if (req.user.role !== ENV.ADMIN_ROLE)
    return res.status(403).json({ message: "Forbidden - admin access only" });
  next();
};
