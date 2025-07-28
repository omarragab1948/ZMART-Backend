import express from "express";

import {
  createEmployee,
  employeeChangeStatus,
  getAllEmployees,
  getEmployeeById,
} from "../../controllers/dashboard/admins/employeeControllers";

export const router = express.Router();

router.route("/").get(getAllEmployees)
router.route("/create").post(createEmployee);

router.route("/:id").get(getEmployeeById);

router.patch("/:id/:action", employeeChangeStatus);
