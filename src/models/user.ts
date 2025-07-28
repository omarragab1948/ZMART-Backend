import mongoose from "mongoose";
import { IUser, UserRole } from "../types/users";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const options = {
  discriminatorKey: "role",
  collection: "user",
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc: mongoose.Document, ret: Record<string, any>) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
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
      required: [true, "Password confirm is required"],
      validate: {
        validator: function (this: IUser, value: string): boolean {
          if (this.isNew) {
            return this.password === value;
          }
          return true;
        },
        message: "Password confirmation does not match the password",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiration: Date,
    status: {
      type: String,
      enum: ["pending", "active", "banned", "deleted"],
      default: "pending",
    },
    phone: {
      type: String,
    },
    image: {
      type: String,
    },
  },

  options
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = (await bcrypt.hash(this.password as string, 12)) as
    | string
    | undefined;
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedpasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );
    return changedTimestamp > JWTTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpiration = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
export const User = mongoose.model("User", userSchema);
