import mongoose from "mongoose";
import Product from "../models/Productmodel.js";
import userModel from "../models/userModels.js";

const normalizeCart = (cart = []) => {
  if (!Array.isArray(cart)) return [];

  return cart
    .map((item) => ({
      productId: String(item.productId || item._id || ""),
      quantity: Math.max(1, Number(item.quantity) || 1),
      size: item.size ? String(item.size) : "",
    }))
    .filter((item) => mongoose.Types.ObjectId.isValid(item.productId));
};

const hydrateCart = async (cart = []) => {
  const normalizedCart = normalizeCart(cart);
  const productIds = normalizedCart.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productById = new Map(
    products.map((product) => [String(product._id), product])
  );

  return normalizedCart
    .map((item) => {
      const product = productById.get(item.productId);
      if (!product) return null;

      return {
        product,
        quantity: item.quantity,
        size: item.size,
      };
    })
    .filter(Boolean);
};

const getCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cart = await hydrateCart(user.cartData);

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const cart = normalizeCart(req.body.cart);
    const user = await userModel.findByIdAndUpdate(
      req.userId,
      { cartData: cart },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hydratedCart = await hydrateCart(user.cartData);

    res.json({
      success: true,
      cart: hydratedCart,
      message: "Cart updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.userId,
      { cartData: [] },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      cart: [],
      message: "Cart cleared",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getCart, updateCart, clearCart };
