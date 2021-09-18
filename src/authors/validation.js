import { body } from "express-validator";

export const authorValidation = [
  body("name").exists().withMessage("name required"),
  body("surname").exists().withMessage("surname required"),
  body("email").exists().withMessage("email required"),
  body("dateOfBirth").exists().withMessage("dateOfBirth required"),
  //   body("avatar").exists().withMessage("avatar"),
];
