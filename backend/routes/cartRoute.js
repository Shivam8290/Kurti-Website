import express from "express";
import { clearCart, getCart, updateCart } from "../controller/cartController.js";
import authUser from "../middleware/authUser.js";

const cartRouter = express.Router();

cartRouter.get("/", authUser, getCart);
cartRouter.patch("/", authUser, updateCart);
cartRouter.delete("/", authUser, clearCart);

export default cartRouter;
