import { User } from "../models/user.model.js";

export async function addAddress(req, res) {
  try {
    const { fullName, streetAddress, city, phoneNumber, isDefault } = req.body;

    const user = req.user;

    if (isDefault) {
      user.addAddress.forEach((addr) => addr.isDefault == false);
    }

    user.addresses.push({
      fullName,
      streetAddress,
      city,
      phoneNumber,
      isDefault: isDefault || false,
    });

    await user.save();
    res.status(201).json({
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getAddresses(req, res) {
  try {
    const user = req.user;
    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("Error getting addresses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function updateAddresses(req, res) {
  try {
    const { fullName, streetAddress, city, phoneNumber, isDefault } = req.body;
    const { addressId } = req.params;
    const user = req.user;
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (isDefault) {
      user.addAddress.forEach((addr) => addr.isDefault == false);
    }

    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();
    res.status(200).json({
      message: "Address updated successfully",
      address: user.addresses,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function deleteAddresses(req, res) {
  try {
    const { addressId } = req.params;
    const user = req.user;

    user.addresses.pull(addressId);
    await user.save();
    res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function addToWishlist(req, res) {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();
    res
      .status(201)
      .json({ message: "Product added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function removeFormWishlist(req, res) {
  try {
    const { productId } = req.params;
    const user = req.user;

    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product is not in wishlist" });
    }

    user.wishlist.pull(productId);
    await user.save();
    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getWishlist(req, res) {
  try {
    const user = req.user;
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error getting wishlist:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
