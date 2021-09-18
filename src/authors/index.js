import { Router } from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import uniqid from "uniqid";
import { uploadFileToAuthors, parseFile } from "../utils/upload/index.js";
import createHttpError from "http-errors";
import { authorValidation } from "./validation.js";
import { validationResult } from "express-validator";

//CONNECT PATH WITH JSON
const authorFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
console.log("authorFilePath", authorFilePath);

// const cwd = process.cwd();
// const authorFilePath2 = join(cwd, "/src/authors/authors.json");
// console.log("authorFilePath2", authorFilePath2);

//ROUTER CONST
const getAuthors = () => JSON.parse(fs.readFileSync(authorFilePath));
const writeAuthors = (content) => {
  fs.writeFileSync(authorFilePath, JSON.stringify(content));
};
const authorRoute = Router();

//// GET ALL
authorRoute.get("/", (req, res, next) => {
  try {
    const authors = getAuthors();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

//// POST
authorRoute.post("/", authorValidation, (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      console.log(error);
      next(createHttpError(400, { errorsList }));
    } else {
      const authors = getAuthors();
      const newAuthor = { ...req.body, id: uniqid() };
      authors.push(newAuthor);
      writeAuthors(authors);
      res.send(authors);
    }
  } catch (error) {
    next(error);
  }
});

//// GET ID
authorRoute.get("/:id", (req, res, next) => {
  try {
    const authors = getAuthors();
    const author = authors.find((author) => author.id === req.params.id);
    if (author) {
      res.send(author);
    }
  } catch (error) {
    next(error);
  }
});

//// PUT
authorRoute.put("/:id", (req, res, next) => {
  try {
    const authors = getAuthors();
    const index = authors.findIndex((author) => author.id === req.params.id);
    let authorToBeAltered = authors[index];
    const newDetails = req.body;

    const updatedAuthor = { ...authorToBeAltered, ...newDetails };
    authors[index] = updatedAuthor;
    writeAuthors(authors);

    res.send(updatedAuthor);
  } catch (error) {
    next(error);
  }
});

//// DELETE
authorRoute.delete("/:id", (req, res, next) => {
  try {
    const authors = getAuthors();
    const filteredAuthors = authors.filter(
      (author) => author.id !== req.params.id
    );
    writeAuthors(filteredAuthors);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

authorRoute.put(
  "/:id/uploadAvatar",
  parseFile.single("authorAvatar"),
  uploadFileToAuthors,
  async (req, res, next) => {
    try {
      const authors = getAuthors();
      const index = authors.findIndex((author) => author.id === req.params.id);
      let authorToBeAltered = authors[index];
      const newAvatar = { avatar: req.file };

      const updatedAuthor = { ...authorToBeAltered, ...newAvatar };
      authors[index] = updatedAuthor;
      writeAuthors(authors);

      res.send(updatedAuthor);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default authorRoute;
