import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  subcategory: { type: String },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean, default: false },
  mrp: { type: Number },
  isNew: { type: Boolean, default: false },
  sourceId: { type: String, unique: true, sparse: true },
  date: { type: Number, required: true },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
