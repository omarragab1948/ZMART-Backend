import { Customer } from "../../../models/customer";
import { ICustomer } from "../../../types/users";
import { ApiFeatures } from "../../../utils/apiFeatures";
import { AppError } from "../../../utils/appError";
import { catchAsync } from "../../../utils/catchAsync";

export const getAllCustomers = catchAsync(async (req, res, next) => {
 const features = new ApiFeatures<ICustomer>(Customer.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const total = await features.totalCount();
  const customers = await features.paginate().query;

  res.status(200).json({
    message: "success",
    total,
    data: { customers },
  });
});
export const getCustomerById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const customer = await Customer.findById(id);

  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }

  res.status(200).json({
    message: "success",
    data: { customer },
  });
});
export const createCustomer = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    return next(new AppError("Customer with this email already exists", 400));
  }
  const customer = await Customer.create(req.body);

  res.status(201).json({
    message: "Customer created successfully",
    data: { customer },
  });
});
export const customerChangeStatus = catchAsync(async (req, res, next) => {
  const { id: customerId, action } = req.params;
  if (!customerId) {
    return next(new AppError("Customer ID is required", 400));
  }

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }

  let newStatus: string;
  switch (action) {
    case "active":
      newStatus = "active";
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
      newStatus = customer.status;
  }
  console.log(newStatus);
  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    { status: newStatus },
    { new: true, runValidators: false }
  );

  res.status(200).json({
    message: `Customer status changed to '${newStatus}' successfully`,
    data: { customer: updatedCustomer },
  });
});
