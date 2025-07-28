import mongoose from "mongoose";
import { ICustomer, UserRole } from "../types/users";
import { User } from "./user";

const customerSchema = new mongoose.Schema<ICustomer>({  addresses: {
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

export const Customer = User.discriminator<ICustomer>(
  "Customer",
  customerSchema
);
