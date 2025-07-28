import mongoose from "mongoose";
import { IEmployee } from "../types/users";
import { User } from "./user";

const employeeSchema = new mongoose.Schema<IEmployee>({
  permissions: {
    type: Map,
    of: [String],
    default: {},
  },
});

export const Employee = User.discriminator("Employee", employeeSchema);
