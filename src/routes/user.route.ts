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
userRoute.get("/suggestions-user", auth, userController.suggestionsUser);
userRoute.get("/:studentID/follow", auth, userController.getFollow);
userRoute.get("/:studentID", userController.getUserByStudentID);
userRoute.patch("/:id/bookmark-post", auth, userController.bookmarkPost);
userRoute.patch("/:id/unbookmark-post", auth, userController.unbookmarkPost);

export default userRoute;
