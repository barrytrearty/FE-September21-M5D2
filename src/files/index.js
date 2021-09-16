import blogAuthorRoute from "../authors/index.js";
import express from "express";
import multer from "multer";
import { join } from "path";

const filesRouter = express.Router();

const publicFolderPath = join(process.cwd(), "public/img/authors");
const uploadAvatar = (name, contentAsBuffer) =>
  writeFile(join(publicFolderPath, name), contentAsBuffer);

filesRouter.post(
  "/:id/uploadAvatar",
  multer().single("idOfTheAuthor"),
  async (req, res, next) => {
    try {
      console.log(req.file);
      // const blogAuthors = getBlogAuthors();
      // const blogAuthor = blogAuthors.find(
      //   (author) => author.id === req.params.id
      // );
      await uploadAvatar(req.file.originalname, file.buffer);
      res.send("Ok");
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
