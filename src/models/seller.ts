import mongoose from "mongoose";
import { ISeller } from "../types/users";
import { User } from "./user";

const sellerSchema = new mongoose.Schema<ISeller>({
  storeName: {
    type: String,
    required: true,
  },
  storeDescription: {
    type: String,
  },
  storeLogo: {
    type: String,
  },
});

export const Seller = User.discriminator("Seller", sellerSchema);
