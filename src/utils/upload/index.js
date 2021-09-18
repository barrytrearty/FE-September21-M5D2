import { join, extname } from "path";
import multer from "multer";
import fs from "fs";

const publicPathToAuthors = join(process.cwd(), "./public/img/authors");
const publicPathToBlogPosts = join(process.cwd(), "./public/img/blogPosts");

export const parseFile = multer();

export const uploadFileToAuthors = (req, res, next) => {
  try {
    const { originalname, buffer } = req.file;
    const extension = extname(originalname);
    const fileName = `${req.params.id}${extension}`;
    const pathToFile = join(publicPathToAuthors, fileName);
    fs.writeFileSync(pathToFile, buffer);
    const link = `http://localhost:3001/${fileName}`;
    req.file = link;
    next();
    // console.log(req.file);
    // console.log(publicPathToAuthors);
    // res.send("OK");
  } catch (error) {
    next(error);
  }
};

export const uploadFileToBlogPosts = (req, res, next) => {
  try {
    const { originalname, buffer } = req.file;
    const extension = extname(originalname);
    const fileName = `${req.params.id}${extension}`;
    const pathToFile = join(publicPathToBlogPosts, fileName);
    fs.writeFileSync(pathToFile, buffer);
    const link = `http://localhost:3001/${fileName}`;
    req.file = link;
    next();
    // console.log(req.file);
    // console.log(publicPathToBlogPosts);
    // res.send("OK");
  } catch (error) {
    next(error);
  }
};
