import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/UserRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");
const frontendDir = path.join(publicDir, "front");
const adminDir = path.join(publicDir, "admin");

// DB + Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());

// API routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

// ============================
// SERVE FRONTEND + ADMIN
// ============================

// Vite writes frontend bundles to /assets. Serve the current frontend
// build first, then admin assets for older admin builds that used /assets.
app.use(
  "/assets",
  express.static(path.join(frontendDir, "assets")),
  express.static(path.join(adminDir, "assets"))
);

// Serve admin static
app.use("/admin", express.static(adminDir));

// Serve frontend static
app.use("/", express.static(frontendDir));

// ----------------------------
// FIXED FALLBACK ROUTES
// ----------------------------

// Admin fallback (must come BEFORE root)
app.get(/^\/admin(?:\/.*)?$/, (req, res) => {
  res.sendFile(path.join(adminDir, "index.html"));
});

// Frontend fallback
app.get(/^(?!\/api(?:\/|$)).*/, (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

// ============================

app.listen(port, () => {
  console.log(`server started on PORT: ${port}`);
});
