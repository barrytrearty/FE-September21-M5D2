//IMPORTS
import { Router } from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import uniqid from "uniqid";
import { uploadFileToBlogPosts, parseFile } from "../utils/upload/index.js";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { blogPostValidation } from "./validation.js";

//CONNECT PATH WITH JSON
const blogPostFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "posts.json"
);
console.log("BlogPostFilePath", blogPostFilePath);

// const cwd = process.cwd();
// const blogPostFilePath2 = join(cwd, "/src/blogPosts/Posts.json");
// console.log("BlogPostFilePath2", blogPostFilePath2);

//ROUTER CONST
const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostFilePath));
const writeBlogPosts = (content) => {
  fs.writeFileSync(blogPostFilePath, JSON.stringify(content));
};
const blogPostRoute = Router();

//// GET ALL
blogPostRoute.get("/", (req, res, next) => {
  try {
    const blogPosts = getBlogPosts();
    res.send(blogPosts);
  } catch (error) {
    nest(error);
    // res.send(500).send({ message: error.message });
  }
});

//// POST
blogPostRoute.post("/", blogPostValidation, (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      next(createHttpError(400, { errorsList }));
    } else {
      const blogPosts = getBlogPosts();
      const newBlogPost = { ...req.body, _id: uniqid(), createdAt: new Date() };
      blogPosts.push(newBlogPost);
      writeBlogPosts(blogPosts);
      res.send(blogPosts);
    }
  } catch (error) {
    next(error);
    // res.send(500).send({ message: error.message });
  }
});

//// GET ID
blogPostRoute.get("/:id", (req, res, next) => {
  try {
    const blogPosts = getBlogPosts();
    const blogPost = blogPosts.find((Post) => Post._id === req.params.id);
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(createHttpError(404, `blogPost/${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

//// PUT
blogPostRoute.put("/:id", (req, res, next) => {
  try {
    const blogPosts = getBlogPosts();
    const index = blogPosts.findIndex((Post) => Post._id === req.params.id);
    let postToBeAltered = blogPosts[index];
    const newDetails = req.body;

    const updatedPost = { ...postToBeAltered, ...newDetails };
    blogPosts[index] = updatedPost;
    writeBlogPosts(blogPosts);

    res.send(updatedPost);
  } catch (error) {
    next(error);
  }
});

//// DELETE
blogPostRoute.delete("/:id", (req, res, next) => {
  try {
    const blogPosts = getBlogPosts();
    const filteredBlogPosts = blogPosts.filter(
      (post) => post._id !== req.params.id
    );
    writeBlogPosts(filteredBlogPosts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

//ADDING COVER PHOTO

blogPostRoute.put(
  "/:id/uploadCover",
  parseFile.single("blogPostCover"),
  uploadFileToBlogPosts,
  (req, res, next) => {
    try {
      const blogPosts = getBlogPosts();
      const index = blogPosts.findIndex((Post) => Post._id === req.params.id);
      let postToBeAltered = blogPosts[index];
      console.log(`Hello ${req.file}`);
      const newCover = { cover: req.file };

      const updatedPost = { ...postToBeAltered, ...newCover };
      blogPosts[index] = updatedPost;
      writeBlogPosts(blogPosts);

      res.send(updatedPost);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// GETTING COMMENTS
blogPostRoute.get("/:id/comments", (req, res, next) => {
  try {
    const blogPosts = getBlogPosts();
    const blogPost = blogPosts.find((Post) => Post._id === req.params.id);
    if (blogPost) {
      blogPost.comments = blogPost.comments || [];
      res.send(blogPost.comments);
    } else {
      next(createHttpError(404, `blogPost/${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// POSTING COMMENTS
blogPostRoute.put("/:id/comments", (req, res, next) => {
  try {
    const blogPosts = getBlogPosts();
    const index = blogPosts.findIndex((Post) => Post._id === req.params.id);
    let postBeforeNewComment = blogPosts[index];
    postBeforeNewComment.comments = postBeforeNewComment.comments || [];

    const { text, userName } = req.body;

    const postWithNewComment = {
      ...postBeforeNewComment,
      comments: [...postBeforeNewComment.comments, { text, userName }],
    };
    blogPosts[index] = postWithNewComment;

    writeBlogPosts(blogPosts);

    res.send(postWithNewComment);
  } catch (error) {
    next(error);
  }
});

//EXPORT ROUTER CONST
export default blogPostRoute;
