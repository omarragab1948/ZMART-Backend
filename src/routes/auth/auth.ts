import express from "express";
import {
  forgotPassword,
  logout,
  resetPassword,
  signin,
  signup,
} from "../../controllers/auth/authControllers";

export const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
