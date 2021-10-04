import { check } from "express-validator";

const validateCreatePost = [
  check("content")
    .notEmpty()
    .withMessage("Please input content")
    .trim()
    .escape(),
];

export { validateCreatePost };
