import { Types, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  price: number;
  category: Types.ObjectId;
  attributes: Record<string, any>;
}
