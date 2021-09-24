import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import validUrl from "valid-url";
import statusCodes from "../utils/status-codes";
import messages from "../utils/messages";
import { isPasswordValid } from "../utils/misc";
import User, { IUserProps } from "../models/user.model";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(statusCodes.unauthorized)
      .json({ message: messages.unauthorized });
  }

  const decoded = (await jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  )) as { id: string };

  if (!decoded) {
    return res
      .status(statusCodes.unauthorized)
      .json({ message: messages.unauthorized });
  }

  const account = await User.findById(decoded.id);

  if (!account) {
    return res
      .status(statusCodes.notFound)
      .json({ message: messages.loginError });
  }

  req.account = <IUserProps>{
    ...account._doc,
    password: "",
  };

  next();
};

const checkURL = async (req: Request, res: Response, next: NextFunction) => {
  const url = req.body.website;
  if (url) {
    if (!validUrl.isUri(url)) {
      return res
        .status(statusCodes.badRequest)
        .json({ message: messages.urlError });
    }
  }
  next();
};

const checkStudentIDTaken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { studentID } = <IUserProps>req.body;
  const userWithSameStudentID = await User.findOne({ studentID });

  if (userWithSameStudentID) {
    return res
      .status(statusCodes.badRequest)
      .json({ message: messages.studentIDTaken });
  }

  next();
};

const checkEmailTaken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { email } = <IUserProps>req.body;
  const userWithSameEmail = await User.findOne({ email });

  if (userWithSameEmail) {
    return res
      .status(statusCodes.badRequest)
      .json({ message: messages.emailTaken });
  }

  next();
};

const checkSignIn = async (req: Request, res: Response, next: NextFunction) => {
  let { studentID, password } = <IUserProps>req.body;

  const account = await User.findOne({ studentID });

  if (!account) {
    return res
      .status(statusCodes.notFound)
      .json({ message: messages.loginError });
  }

  const passwordsMatch = await isPasswordValid(password, account.password);

  if (!passwordsMatch) {
    return res
      .status(statusCodes.notFound)
      .json({ message: messages.loginError });
  }

  req.account = <IUserProps>{
    ...account._doc,
    password: "",
  };

  next();
};

const checkAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshtoken;

  if (!refreshToken) {
    return res
      .status(statusCodes.unauthorized)
      .json({ message: messages.unauthorized });
  }

  const decoded = (await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  )) as { id: string };

  if (!decoded) {
    return res
      .status(statusCodes.unauthorized)
      .json({ message: messages.unauthorized });
  }

  const account = await User.findById(decoded.id).select("-password");

  if (!account) {
    return res
      .status(statusCodes.notFound)
      .json({ message: messages.loginError });
  }

  req.account = <IUserProps>{
    ...account._doc,
    password: "",
  };

  next();
};

export {
  auth,
  checkURL,
  checkStudentIDTaken,
  checkEmailTaken,
  checkSignIn,
  checkAccount,
};
