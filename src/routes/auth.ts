import express from "express";

import authController from "../controllers/auth";
import { signupValidators, loginValidators } from "../middleware/validation";

const router = express.Router();

router.get("/signup", authController.getSignUp);

router.get("/login", authController.getLogin);

router.post("/signup", signupValidators, authController.postSignUp);

router.post(
  "/login",
  loginValidators,
  authController.postLogin
);

router.post("/logout", authController.postLogout);

export default router;
