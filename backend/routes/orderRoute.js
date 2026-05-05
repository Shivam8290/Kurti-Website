import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/authUser.js";
import {
  getAllOrders,
  getUserOrders,
  placeCodOrder,
  updateOrderStatus,
} from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", authUser, placeCodOrder);
orderRouter.get("/", authUser, getUserOrders);
orderRouter.get("/admin", adminAuth, getAllOrders);
orderRouter.patch("/:id/status", adminAuth, updateOrderStatus);

export default orderRouter;
