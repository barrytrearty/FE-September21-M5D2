//IMPORTS
import { Router } from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import uniqid from "uniqid";
import createHttpError from "http-errors";

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
blogPostRoute.get("/", (req, res) => {
  try {
    const blogPosts = getBlogPosts();
    res.send(blogPosts);
  } catch (error) {
    nest(error);
    // res.send(500).send({ message: error.message });
  }
});

//// POST
blogPostRoute.post("/", (req, res) => {
  try {
    const blogPosts = getBlogPosts();
    const newBlogPost = { ...req.body, _id: uniqid(), createdAt: new Date() };
    blogPosts.push(newBlogPost);
    writeBlogPosts(blogPosts);
    res.send(blogPosts);
  } catch (error) {
    next(error);
    // res.send(500).send({ message: error.message });
  }
});

//// GET ID
blogPostRoute.get("/:id", (req, res) => {
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
blogPostRoute.put("/:id", (req, res) => {
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
blogPostRoute.delete("/:id", (req, res) => {
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

//EXPORT ROUTER CONST
export default blogPostRoute;
