import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createReview(req, res) {
  try {
    const { productId, orderId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }
    const user = req.user;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.clerkId !== user.clerkId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({ error: "Can only review delivered order" });
    }

    const productInOrder = order.orderItems.find(
      (item) => item.product.toString() === productId.toString(),
    );
    if (!productInOrder) {
      return res.status(404).json({ error: "Product not found in order" });
    }

    const existingReview = await Review.findOne({
      productId,
      userId: user._id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this product" });
    }

    const review = await Review.create({
      productId,
      userId: user._id,
      orderId,
      rating,
    });

    //update rating
    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        averageRating: totalRating / reviews.length,
        totalReviews: reviews.length,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedProduct) {
      await Review.findByIdAndDelete(review._id);
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(201).json({ message: "Review sumbitted successfully", review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const user = req.user;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (review.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);

    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    await Product.findById(productId, {
      averageRating: totalRating / reviews.length,
      totalReviews: reviews.length,
    });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
