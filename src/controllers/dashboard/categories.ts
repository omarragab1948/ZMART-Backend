import { Category } from "../../models/categories";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";

export const addCategory = catchAsync(async (req, res, next) => {
  const { name, attributes } = req.body;

  const exists = await Category.findOne({ name });
  if (exists) return next(new AppError("Category name already exists", 400));
 
  if (!Array.isArray(attributes)) {
    return next(new AppError("Attributes must be an array", 400));
  }

  const newDoc = await Category.create({ name, attributes });

  res.status(201).json({
    status: "success",
    data: newDoc,
  });
});
