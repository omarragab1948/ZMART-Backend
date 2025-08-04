import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAttribute {
  name: string;
  type: string;
  required?: boolean;
  multiple: boolean;
  options: string[];
}

export interface ICategory extends Document {
  name: string;
  attributes: IAttribute[];
}
