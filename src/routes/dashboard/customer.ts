import express from "express";

import {
  createCustomer,
  customerChangeStatus,
  getAllCustomers,
  getCustomerById,
} from "../../controllers/dashboard/admins/customerControllers";

export const router = express.Router();

router.route("/").get(getAllCustomers);
router.route("/create").post(createCustomer);

router.route("/:id").get(getCustomerById);

router.patch("/:id/:action", customerChangeStatus);
