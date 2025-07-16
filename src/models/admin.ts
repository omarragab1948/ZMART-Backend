import mongoose from "mongoose";
import { IAdmin } from "../types/users";
import { User } from "./user";

const adminSchema = new mongoose.Schema<IAdmin>({
  permissions: {
    type: Map,
    of: [String],
    default: {},
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
});

export const Admin = User.discriminator("Admin", adminSchema);
