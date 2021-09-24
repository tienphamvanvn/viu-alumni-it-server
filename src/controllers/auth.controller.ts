import { Request, Response } from "express";
import statusCodes from "../utils/status-codes";
import messages from "../utils/messages";
import {
  generateSalt,
  generateHashedPassword,
  createAccessToken,
  createRefreshToken,
} from "../utils/misc";
import User, { IUserProps } from "../models/user.model";

const authController = {
  signUp: async (req: Request, res: Response) => {
    try {
      let { fullname, studentID, email, password, gender } = <IUserProps>(
        req.body
      );

      const salt = await generateSalt();

      password = await generateHashedPassword(password, salt);

      const newUser = new User({
        fullname,
        studentID,
        email,
        password,
        gender,
      });

      await newUser.save();

      return res
        .status(statusCodes.created)
        .json({ message: messages.signUpSuccess });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  signIn: async (req: Request, res: Response) => {
    try {
      const account = req.account;

      const accessToken = await createAccessToken({ id: account._id });
      const refreshToken = await createRefreshToken({ id: account._id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/api/auth/refreshtoken",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(statusCodes.success).json({
        message: messages.loggedInSuccessfully,
        token: accessToken,
        account,
      });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  signOut: async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/auth/refreshtoken" });

      return res
        .status(statusCodes.success)
        .json({ message: messages.signOutSuccessful });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const account = req.account;

      const accessToken = await createAccessToken({ id: account._id });

      return res.status(statusCodes.success).json({
        message: messages.loggedInSuccessfully,
        token: accessToken,
        account,
      });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
};

export default authController;
