import { body } from "express-validator";

export const blogPostValidation = [
  body("category").exists().withMessage("category required"),
  body("title").exists().withMessage("title required"),
  // body("author").exists().withMessage("author required"),
  body("content").exists().withMessage("content required"),
];

export const commentValidation = [
  body("text")
    .exists()
    .isString()
    .withMessage("Please enter valid comment text"),
  body("userName")
    .exists()
    .isString()
    .withMessage("Please enter valid username"),
];
