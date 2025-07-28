import express from "express";
import {
  createSeller,
  getAllSellers,
  getSellerById,
  sellerChangeStatus,
} from "../../controllers/dashboard/admins/sellersControllers";

export const router = express.Router();

router.route("/").get(getAllSellers);
router.route("/create").post(createSeller);
router.route("/:id").get(getSellerById);
router.patch("/:id/:action", sellerChangeStatus);
