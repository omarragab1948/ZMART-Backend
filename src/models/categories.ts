import mongoose from "mongoose";
import { IAttribute, ICategory } from "../types/category";

const attributeSchema = new mongoose.Schema<IAttribute>({
  name: {
    type: String,
    required: [true, "Attribute name is required"],
  },
  type: {
    enum: ["String", "Number", "Boolean", "Date"],
    required: [true, "Attribute type is required"],
  },
  required: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  options: {
    type: [String],
    default: [],
  },
});

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    attributes: {
      type: [attributeSchema],
      validate: {
        validator: (val: unknown) => Array.isArray(val),
        message: "Attributes must be an array of attribute objects",
      },
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);
