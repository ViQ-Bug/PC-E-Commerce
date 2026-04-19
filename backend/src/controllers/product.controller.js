import { Product } from "../models/product.model.js";

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getProductBySearch(req, res) {
  try {
    const { search } = req.query;
    const products = await Product.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
