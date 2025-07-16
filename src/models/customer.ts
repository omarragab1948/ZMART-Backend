import mongoose from "mongoose";
import { ICustomer } from "../types/users";
import { User } from "./user";

const customerSchema = new mongoose.Schema<ICustomer>({
  phone: {
    type: String,
  },
  addresses: {
    type: [
      {
        label: String,
        city: String,
        area: String,
        street: String,
        building: String,
        default: Boolean,
      },
    ],
  },
  wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

export const customer = User.discriminator("Customer", customerSchema);
