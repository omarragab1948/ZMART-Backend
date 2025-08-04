import { Category } from "../../models/categories";
import { Product } from "../../models/products";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { validateAttribues } from "../../utils/validateAttribues";

export const addProduct = catchAsync(async (req, res, next) => {
  const {  category: categoryId, atteributes } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) return next(new AppError("Category not found", 400));

  const errors = validateAttribues(category.attributes, atteributes);

  if (errors.length > 0) return next(new AppError(errors.join(", "), 400));
  const newDoc = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    data: newDoc,
  });
});
