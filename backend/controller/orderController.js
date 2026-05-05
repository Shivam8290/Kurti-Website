import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import Product from "../models/Productmodel.js";
import userModel from "../models/userModels.js";

const createOrderNumber = () =>
  `RAW${Date.now().toString(36).toUpperCase()}${Math.floor(
    Math.random() * 1000
  )
    .toString()
    .padStart(3, "0")}`;

const normalizeAddress = (address = {}) => ({
  name: String(address.name || "").trim(),
  phone: String(address.phone || "").trim(),
  address: String(address.address || "").trim(),
  city: String(address.city || "").trim(),
  state: String(address.state || "").trim(),
  zip: String(address.zip || "").trim(),
  country: String(address.country || "India").trim(),
});

const placeCodOrder = async (req, res) => {
  try {
    const { items = [], shippingAddress = {}, deliveryCharge = 0 } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must include at least one item",
      });
    }

    const address = normalizeAddress(shippingAddress);
    const missingField = ["name", "phone", "address", "city", "state", "zip"].find(
      (field) => !address[field]
    );

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `Shipping ${missingField} is required`,
      });
    }

    const productIds = items
      .map((item) => String(item.product || item.productId || item._id || ""))
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productById = new Map(
      products.map((product) => [String(product._id), product])
    );

    const orderItems = items.map((item) => {
      const productId = String(item.product || item.productId || item._id || "");
      const product = productById.get(productId);
      const snapshot = {
        _id: productId,
        name: product?.name || item.name || "Product",
        image: product?.image || item.image || [],
        category: product?.category || item.category || "",
        subCategory:
          product?.subCategory ||
          product?.subcategory ||
          item.subCategory ||
          item.subcategory ||
          "",
      };

      return {
        product: product ? product._id : undefined,
        productSnapshot: snapshot,
        quantity: Math.max(1, Number(item.quantity) || 1),
        size: String(item.size || item.selectedSize || ""),
        price: Number(product?.price || item.price || 0),
      };
    });

    if (orderItems.some((item) => item.price <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Every order item must have a valid price",
      });
    }

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const safeDeliveryCharge = Math.max(0, Number(deliveryCharge) || 0);
    const totalAmount = subtotal + safeDeliveryCharge;

    const order = await orderModel.create({
      user: req.userId,
      items: orderItems,
      shippingAddress: address,
      subtotal,
      deliveryCharge: safeDeliveryCharge,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      status: "Placed",
      orderNumber: createOrderNumber(),
    });

    await userModel.findByIdAndUpdate(req.userId, { cartData: [] });

    res.status(201).json({
      success: true,
      message: "COD order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.userId })
      .populate("items.product", "name image price category subCategory subcategory")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("user", "name email")
      .populate("items.product", "name image price category subCategory subcategory")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Placed",
      "Confirmed",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getAllOrders, getUserOrders, placeCodOrder, updateOrderStatus };
