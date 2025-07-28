import { Document, Types } from "mongoose";

export enum UserRole {
  Admin = "Employee",
  Seller = "Seller",
  Customer = "Customer",
}

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password?: string;
  passwordConfirm?: string;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetTokenExpiration: Date | undefined;
  status: string;
  role: UserRole;
  correctPassword: (candidatepassword: string, userPassword: string) => boolean;
  changedpasswordAfter: (JWTTimestamp: number) => boolean;
  createPasswordResetToken: () => string;
  phone?: string;
  image: string;
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
  addresses?: Address[];
  wishList?: Types.ObjectId[];
  role: UserRole.Customer;
}

export interface ISeller extends IUser {
  storeName: string;
  storeDescription?: string;
  storeLogo?: string;
}

export interface IEmployee extends IUser {
  permissions: Map<string, string[]>;
}
