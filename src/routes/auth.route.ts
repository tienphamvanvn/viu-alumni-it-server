import express, { Router } from "express";
import authController from "../controllers/auth.controller";
import {
  checkEmailTaken,
  checkStudentIDTaken,
  checkSignIn,
  checkAccount,
} from "../middlewares/auth";
import {
  isValidated,
  validateSignUp,
  validateSignIn,
} from "../validators/auth";

const authRoute: Router = express.Router();

authRoute.post(
  "/signup",
  validateSignUp,
  isValidated,
  checkEmailTaken,
  checkStudentIDTaken,
  authController.signUp
);
authRoute.post(
  "/signin",
  validateSignIn,
  isValidated,
  checkSignIn,
  authController.signIn
);
authRoute.post("/signout", authController.signOut);
authRoute.post("/refreshtoken", checkAccount, authController.refreshToken);

export default authRoute;
