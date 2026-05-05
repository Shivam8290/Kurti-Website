import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },
    productSnapshot: {
      _id: { type: String },
      name: { type: String, required: true },
      image: { type: Array, default: [] },
      category: { type: String },
      subCategory: { type: String },
    },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, default: "" },
    price: { type: Number, required: true },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: ["Placed", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },
    orderNumber: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
