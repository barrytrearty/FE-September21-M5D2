import { body } from "express-validator";

export const blogPostValidation = [
  body("category").exists().newMessage("category required"),
  body("title").exists().newMessage("title required"),
  body("author").exists().newMessage("author required"),
  body("content").exists().newMessage("content required"),
];
