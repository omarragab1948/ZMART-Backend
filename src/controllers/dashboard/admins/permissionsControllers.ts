import { Permissions } from "../../../models/permissions";
import { ApiFeatures } from "../../../utils/apiFeatures";
import { AppError } from "../../../utils/appError";
import { catchAsync } from "../../../utils/catchAsync";

export const createPermission = catchAsync(async (req, res) => {
  const permission = await Permissions.create(req.body);
  res.status(201).json({
    message: "Permission created successfully",
    data: { permission },
  });
});

export const getAllPermissions = catchAsync(async (req, res) => {
  const feature = new ApiFeatures(Permissions.find(), req.query)
    .filter()
    .sort()
    .limitFields();
  const total = await feature.totalCount();
  const permissions = await feature.paginate().query;
  res.status(200).json({
    message: "Permissions fetched successfully",
    total,
    data: { permissions },
  });
});

export const getPermissionById = catchAsync(async (req, res, next) => {
  const permission = await Permissions.findById(req.params.id);
  if (!permission) {
    return next(new AppError("Permission not found", 404));
  }
  res.status(200).json({
    message: "Permission fetched successfully",
    data: { permission },
  });
});

export const updatePermission = catchAsync(async (req, res, next) => {
  const permission = await Permissions.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!permission) {
    return next(new AppError("Permission not found", 404));
  }
  res.status(200).json({
    message: "Permission updated successfully",
    data: { permission },
  });
});

export const deletePermission = catchAsync(async (req, res, next) => {
  const permission = await Permissions.findByIdAndDelete(req.params.id);
  if (!permission) {
    return next(new AppError("Permission not found", 404));
  }
  res.status(200).json({
    message: "Permission deleted successfully",
  });
});
