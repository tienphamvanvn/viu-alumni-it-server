import { check } from "express-validator";

const validateEditAccount = [
  check("fullname")
    .notEmpty()
    .withMessage("Please input your Full name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Full Name must be between 3 and 20 characters")
    .trim()
    .escape(),
];

export { validateEditAccount };
