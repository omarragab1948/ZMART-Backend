import mongoose from "mongoose";
import { IUser, UserRole } from "../types/users";

const options = {
  discriminatorKey: "role",
  collection: "user",
  timestamps: true,
};

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [40, "Name must be at most 40 characters long"],
      minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
      validate: {
        validator: function (value: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
        },
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      },
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (this: IUser, value: string): boolean {
          return this.password === value;
        },
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiration: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: [true, "Role is required"],
    },
  },
  options
);
export const User = mongoose.model("User", userSchema);
