import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import productModel from "../models/productModel.js";
import { frontendProducts } from "../data/frontendProducts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendAssetDir = path.resolve(__dirname, "../../frontend/src/assets");

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const images = Array.isArray(req.files) ? req.files : [];

    if (images.length === 0) {
      return res.json({
        success: false,
        message: "Please upload at least one product image",
      });
    }

    const imageURL = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });

        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      subcategory: subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      image: imageURL,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({
      success: true,
      message: "Product added successfully",
    });

  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// function for importing frontend asset products into database
const importFrontendProducts = async (req, res) => {
  try {
    let imported = 0;
    let skipped = 0;

    for (const item of frontendProducts) {
      const exists = await productModel.findOne({ sourceId: item.sourceId });

      if (exists) {
        skipped += 1;
        continue;
      }

      const imageURL = await Promise.all(
        item.imageFiles.map(async (fileName) => {
          const imagePath = path.join(frontendAssetDir, fileName);

          if (!fs.existsSync(imagePath)) {
            throw new Error(`Image file not found: ${fileName}`);
          }

          const result = await cloudinary.uploader.upload(imagePath, {
            resource_type: "image",
          });

          return result.secure_url;
        })
      );

      await productModel.create({
        sourceId: item.sourceId,
        name: item.name,
        description: item.description,
        price: item.price,
        mrp: item.mrp,
        image: imageURL,
        category: item.category,
        subCategory: item.subCategory,
        subcategory: item.subCategory,
        sizes: item.sizes,
        bestseller: item.bestseller,
        isNew: item.isNew,
        date: item.date,
      });

      imported += 1;
    }

    res.json({
      success: true,
      message: `Imported ${imported} products. Skipped ${skipped} existing products.`,
      imported,
      skipped,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// function for list product
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});

    res.json({
      success: true,
      products,
    });

  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// function for removing the product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);

    res.json({
      success: true,
      message: "Product removed successfully",
    });

  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// function for updating product details
const updateProduct = async (req, res) => {
  try {
    const { id, name, description, category, subCategory, price } = req.body;

    if (!id) {
      return res.json({
        success: false,
        message: "Product id is required",
      });
    }

    await productModel.findByIdAndUpdate(id, {
      name,
      description,
      category,
      subCategory,
      subcategory: subCategory,
      price: Number(price),
    });

    res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const {Productid}= req.body
    const product = await productModel.findById(req.body.id);

    res.json({
      success: true,
      product,
    });

  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addProduct,
  importFrontendProducts,
  listProduct,
  removeProduct,
  singleProduct,
  updateProduct,
};
