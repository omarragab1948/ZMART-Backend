import mongoose from "mongoose";
import { IProduct } from "../types/products";

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    attributes: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
