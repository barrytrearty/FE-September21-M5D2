import { Router } from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import uniqid from "uniqid";
import { uploadFile, parseFile } from "../utils/upload/index.js";

//CONNECT PATH WITH JSON
const blogAuthorFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
console.log("BlogAuthorFilePath", blogAuthorFilePath);

// const cwd = process.cwd();
// const blogAuthorFilePath2 = join(cwd, "/src/blogAuthors/authors.json");
// console.log("BlogAuthorFilePath2", blogAuthorFilePath2);

//ROUTER CONST
const getBlogAuthors = () => JSON.parse(fs.readFileSync(blogAuthorFilePath));
const writeBlogAuthors = (content) => {
  fs.writeFileSync(blogAuthorFilePath, JSON.stringify(content));
};
const blogAuthorRoute = Router();

//// GET ALL
blogAuthorRoute.get("/", (req, res) => {
  const blogAuthors = getBlogAuthors();
  res.send(blogAuthors);
});

//// POST
blogAuthorRoute.post("/", (req, res) => {
  const blogAuthors = getBlogAuthors();
  const newBlogAuthor = { ...req.body, id: uniqid() };
  blogAuthors.push(newBlogAuthor);
  writeBlogAuthors(blogAuthors);
  res.send(blogAuthors);
});

//// GET ID
blogAuthorRoute.get("/:id", (req, res) => {
  const blogAuthors = getBlogAuthors();
  const blogAuthor = blogAuthors.find((author) => author.id === req.params.id);
  if (blogAuthor) {
    res.send(blogAuthor);
  }
});

//// PUT
blogAuthorRoute.put("/:id", (req, res) => {
  const blogAuthors = getBlogAuthors();
  const index = blogAuthors.findIndex((author) => author.id === req.params.id);
  let authorToBeAltered = blogAuthors[index];
  const newDetails = req.body;

  const updatedAuthor = { ...authorToBeAltered, ...newDetails };
  blogAuthors[index] = updatedAuthor;
  writeBlogAuthors(blogAuthors);

  res.send(updatedAuthor);
});

//// DELETE
blogAuthorRoute.delete("/:id", (req, res) => {
  const blogAuthors = getBlogAuthors();
  const filteredBlogAuthors = blogAuthors.filter(
    (author) => author.id !== req.params.id
  );
  writeBlogAuthors(filteredBlogAuthors);
  res.status(204).send();
});

blogAuthorRoute.put(
  "/:id/uploadavatar",
  parseFile.single("authoravatar"),
  uploadFile,
  async (req, res, next) => {
    try {
      const blogAuthors = getBlogAuthors();
      const index = blogAuthors.findIndex(
        (author) => author.id === req.params.id
      );
      let authorToBeAltered = blogAuthors[index];
      const newAvatar = { avatar: req.file };

      const updatedAuthor = { ...authorToBeAltered, ...newAvatar };
      blogAuthors[index] = updatedAuthor;
      writeBlogAuthors(blogAuthors);

      res.send(updatedAuthor);
    } catch (error) {
      next(error);
    }
  }
);

export default blogAuthorRoute;
