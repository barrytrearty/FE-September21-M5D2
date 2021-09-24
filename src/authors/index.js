import { Router } from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname, extname } from "path";
import uniqid from "uniqid";
// import { uploadFileToAuthors, parseFile } from "../utils/upload/index.js";
import createHttpError from "http-errors";
import { authorValidation } from "./validation.js";
import { validationResult } from "express-validator";
import { pipeline } from "stream";
import multer from "multer";
import json2csv from "json2csv";

const { readJSON, writeJSON, writeFile } = fs;

//CONNECT PATH WITH JSON
const authorFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

const avatarFolderPath = join(process.cwd(), "./public/img/authors");

const getAuthorsReadableStrean = () => fs.createReadStream(authorFilePath); // For CSV Download

console.log("authorFilePath", authorFilePath);

// const cwd = process.cwd();
// const authorFilePath2 = join(cwd, "/src/authors/authors.json");
// console.log("authorFilePath2", authorFilePath2);

//ROUTER CONST
const getAuthors = () => readJSON(authorFilePath);
const writeAuthors = (content) => writeJSON(authorFilePath, content);

const authorRoute = Router();

//// GET ALL
authorRoute.get("/", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    res.send(authors);
  } catch (error) {
    next(error);
  }
});

//// POST
authorRoute.post("/", authorValidation, async (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      console.log(error);
      next(createHttpError(400, { errorsList }));
    } else {
      const authors = await getAuthors();
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
authorRoute.get("/:id", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const author = authors.find((author) => author.id === req.params.id);
    if (author) {
      res.send(author);
    }
  } catch (error) {
    next(error);
  }
});

authorRoute.get("/param1/param2", async (req, res, next) => {
  try {
    // console.log(req);
    console.log(authorFilePath);
    res.setHeader("Content-Disposition", "attachment; filename=books.csv");

    const source = getAuthorsReadableStrean();
    // console.log(source);
    const transform = new json2csv.Transform({
      // fields: ["name", "surname", "avatar", "email", "dateOfBirth", "id"],
      fields: ["name", "surname"],
    });
    console.log(transform);

    pipeline(source, transform, res, (err) => {
      if (err) next(err);
    });
  } catch (error) {
    next(error);
  }
});

//// PUT
authorRoute.put("/:id", async (req, res, next) => {
  try {
    const authors = await getAuthors();
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
authorRoute.delete("/:id", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const filteredAuthors = authors.filter(
      (author) => author.id !== req.params.id
    );
    writeAuthors(filteredAuthors);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

//UPLOAD AUTHOR AVATAR
authorRoute.put(
  "/:id/uploadAvatar",
  multer().single("authorAvatar"),
  async (req, res, next) => {
    try {
      const { originalname, buffer } = req.file;
      const extension = extname(originalname);
      const fileName = `${req.params.id}${extension}`;

      const pathToFile = join(avatarFolderPath, fileName);
      await fs.writeFile(pathToFile, buffer);

      const authors = await getAuthors();
      const index = authors.findIndex((author) => author.id === req.params.id);
      let authorToBeAltered = authors[index];

      // const link = `https://striveblogbt.herokuapp.com/img/authors/${fileName}`;
      const link = `http://localhost:3000/img/authors/${fileName}`;

      req.file = link;
      const newAvatar = { avatar: req.file };

      const updatedAuthor = { ...authorToBeAltered, ...newAvatar };

      authors[index] = updatedAuthor;
      await writeAuthors(authors);
      res.send(updatedAuthor);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

authorRoute.get("/param1", async (req, res, next) => {
  try {
    // console.log(req);
    console.log(authorFilePath);
    res.setHeader("Content-Disposition", "attachment; filename=books.csv");

    const source = getAuthorsReadableStrean();
    // console.log(source);
    const transform = new json2csv.Transform({
      // fields: ["name", "surname", "avatar", "email", "dateOfBirth", "id"],
      fields: ["name", "surname"],
    });
    console.log(transform);

    pipeline(source, transform, res, (err) => {
      if (err) next(err);
    });
  } catch (error) {
    next(error);
  }
});

export default authorRoute;
