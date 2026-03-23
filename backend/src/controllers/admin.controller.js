import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }
    if (req.files.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images allowed" });
    }
    const uploadPromise = req.files.map(async (file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
    });

    const uploadResults = await Promise.all(uploadPromise);

    const imageUrls = uploadResults.map((result) => result.secure_url);

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getAllProducts(_, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (category) product.category = category;

    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ message: "Maximum 3 images allowed" });
      }
      const uploadPromise = req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
      });

      const uploadResults = await Promise.all(uploadPromise);
      product.images = uploadResults.map((result) => result.secure_url);
    }
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((imageUrl) => {
        const publicId =
          "products/" + imageUrl.split("/products/")[1]?.split(".")[0];
        if (publicId) return cloudinary.uploader.destroy(publicId);
      });
      await Promise.all(deletePromises.filter(Boolean));
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
}
export async function getAllOders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error getting all orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["peding", "shipped", "delivered"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }
    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getAllCustomers(_, res) {
  try {
    const customers = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ customers });
  } catch (error) {
    console.error("Error getting all customers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getDashboardStats(_, res) {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const totalCustomers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
