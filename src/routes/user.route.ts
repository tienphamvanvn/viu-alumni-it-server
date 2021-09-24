import express, { Router } from "express";
import userController from "../controllers/user.controller";
import { auth, checkURL } from "../middlewares/auth";
import { isValidated } from "../validators/auth";
import { validateEditAccount } from "../validators/user";

const userRoute: Router = express.Router();

userRoute.patch(
  "/edit",
  auth,
  validateEditAccount,
  isValidated,
  checkURL,
  userController.editAccount
);
userRoute.patch("/:id/follow", auth, userController.follow);
userRoute.patch("/:id/unfollow", auth, userController.unfollow);
userRoute.get("/:studentID/follow", auth, userController.getFollow);
userRoute.get("/:studentID", userController.getUserByStudentID);

export default userRoute;
