import { Seller } from "../../../models/seller";
import { ISeller } from "../../../types/users";
import { ApiFeatures } from "../../../utils/apiFeatures";
import { AppError } from "../../../utils/appError";
import { catchAsync } from "../../../utils/catchAsync";

export const getAllSellers = catchAsync(async (req, res, next) => {
  const querytoFilter = Seller.find();
  const features = new ApiFeatures<ISeller>(querytoFilter, req.query)
    .filter()
    .sort()
    .limitFields();
  const total = await features.totalCount();
  const sellers = await features.paginate().query;
  res.status(200).json({
    message: "success",
    total,
    data: { sellers },
  });
});
export const getSellerById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const seller = await Seller.findById(id);

  if (!seller) {
    return next(new AppError("Seller not found", 404));
  }

  res.status(200).json({
    message: "success",
    data: { seller },
  });
});
export const createSeller = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  delete req.body.storeLogo;
  const existingSeller = await Seller.findOne({ email });
  if (existingSeller) {
    return next(new AppError("Seller with this email already exists", 400));
  }

  const seller = await Seller.create(req.body);

  res.status(201).json({
    message: "Seller created successfully",
    data: { seller },
  });
});
export const sellerChangeStatus = catchAsync(async (req, res, next) => {
  const { id: sellerId, action } = req.params;
  if (!sellerId) {
    return next(new AppError("Seller ID is required", 400));
  }

  const seller = await Seller.findById(sellerId);
  if (!seller) {
    return next(new AppError("Seller not found", 404));
  }

  let newStatus: string;

  switch (action) {
    case "verify":
      newStatus = "verified";
      break;
    case "delete":
      newStatus = "deleted";
      break;
    case "ban":
      newStatus = "banned";
      break;
    case "restore-ban":
    case "restore-delete":
      newStatus = "active";
      break;
    default:
      newStatus = seller.status;
  }

  const updatedSeller = await Seller.findByIdAndUpdate(
    sellerId,
    { status: newStatus },
    { new: true, runValidators: false }
  );

  res.status(200).json({
    message: `Seller status changed to '${newStatus}' successfully`,
    data: { seller: updatedSeller },
  });
});
