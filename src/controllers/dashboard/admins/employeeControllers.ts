import { Employee } from "../../../models/employee";
import { IEmployee } from "../../../types/users";
import { ApiFeatures } from "../../../utils/apiFeatures";
import { AppError } from "../../../utils/appError";
import { catchAsync } from "../../../utils/catchAsync";

export const getAllEmployees = catchAsync(async (req, res, next) => {
  const querytoFilter = Employee.find();
  const features = await new ApiFeatures<IEmployee>(querytoFilter, req.query)
    .filter()
    .sort()
    .limitFields();
  const total = await features.totalCount();
  const employees = await features.paginate().query;
  res.status(200).json({
    message: "success",
    total,
    data: { employees },
  });
});

export const getEmployeeById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const employee = await Employee.findById(id).populate("permission", "name description");

  if (!employee) {
    return next(new AppError("Employee not found", 404));
  }

  res.status(200).json({
    message: "success",
    data: { employee },
  });
});

export const createEmployee = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    return next(new AppError("Employee with this email already exists", 400));
  }
  const employee = await Employee.create(req.body);
  res.status(201).json({
    message: "Employee created successfully",
    data: { employee },
  });
});

export const employeeChangeStatus = catchAsync(async (req, res, next) => {
  const { id: employeeId, action } = req.params;
  if (!employeeId) {
    return next(new AppError("Employee ID is required", 400));
  }

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return next(new AppError("Employee not found", 404));
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
      newStatus = employee.status;
  }

  const updatedEmployee = await Employee.findByIdAndUpdate(
    employeeId,
    { status: newStatus },
    { new: true, runValidators: false }
  );

  res.status(200).json({
    message: `Employee status changed to '${newStatus}' successfully`,
    data: { employee: updatedEmployee },
  });
});
