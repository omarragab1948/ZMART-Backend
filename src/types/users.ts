import { Document, Types } from "mongoose";

export enum UserRole {
  Admin = "Admin",
  Seller = "Seller",
  Customer = "Customer",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetTokenExpiration: Date;
  active: boolean;
  role: UserRole;
}
export interface Address {
  label?: string;
  city?: string;
  area?: string;
  street?: string;
  building?: string;
  default?: boolean;
}
export interface ICustomer extends IUser {
  phone?: string;
  addresses?: Address[];
  wishList?: Types.ObjectId[];
}

export interface ISeller extends IUser {
  storeName: string;
  storeDescription?: string;
  storeLogo?: string;
  isVerified: boolean;
}

export interface IAdmin extends IUser {
  permissions: Map<string, string[]>;
  isSuperAdmin: boolean;
}
