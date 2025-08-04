import mongoose from "mongoose";
import { IEmployee } from "../types/users";
import { User } from "./user";

const employeeSchema = new mongoose.Schema<IEmployee>({
  permission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Permissions",
    required: true,
  },
});

export const Employee = User.discriminator("Employee", employeeSchema);
