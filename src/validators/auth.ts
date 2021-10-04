import { Request, Response, NextFunction } from "express";
import {
  check,
  validationResult,
  ValidationError,
  Result,
} from "express-validator";
import statusCodes from "../utils/status-codes";

const isValidated = (req: Request, res: Response, next: NextFunction) => {
  const errors: Result<ValidationError> = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;

    return res.status(statusCodes.badRequest).json({ message: errorMessage });
  } else {
    next();
  }
};

const validateSignUp = [
  check("fullname")
    .notEmpty()
    .withMessage("Please input your Full name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Full Name must be between 3 and 20 characters")
    .trim()
    .escape(),
  check("studentID")
    .notEmpty()
    .withMessage("Please input your Student ID")
    .isNumeric()
    .withMessage("Student ID must be numeric")
    .trim()
    .escape(),
  check("email")
    .notEmpty()
    .withMessage("Please input your Email")
    .isEmail()
    .withMessage("Invalid email")
    .trim()
    .escape(),
  check("password")
    .notEmpty()
    .withMessage("Please input your Password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 letters")
    .trim()
    .escape(),
];

const validateSignIn = [
  check("studentID")
    .notEmpty()
    .withMessage("Please input your Student ID")
    .isNumeric()
    .withMessage("Student ID must be numeric")
    .trim()
    .escape(),
  check("password")
    .notEmpty()
    .withMessage("Please input your Password")
    .trim()
    .escape(),
];

export { isValidated, validateSignUp, validateSignIn };
