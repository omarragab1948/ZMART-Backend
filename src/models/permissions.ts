import mongoose from "mongoose";
const options = {
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
const permissionssSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
      required: true,
      default: [],
      validate: {
        validator: function (value: string[]) {
          return value.length > 0;
        },
      },
    },
  },
  options
);
export const Permissions = mongoose.model("Permissions", permissionssSchema);
