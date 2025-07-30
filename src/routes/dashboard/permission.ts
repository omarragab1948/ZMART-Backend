import express from "express";
import {
  createPermission,
  deletePermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
} from "../../controllers/dashboard/admins/permissionsControllers";

export const router = express.Router();

router.post("/create", createPermission);
router.get("/", getAllPermissions);
router
  .route("/:id")
  .get(getPermissionById)
  .put(updatePermission)
  .delete(deletePermission);
