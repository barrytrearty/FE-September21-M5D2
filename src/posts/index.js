//IMPORTS
import { Router } from "express";
import fs from "fs-extra";
import multer from "multer";
import { fileURLToPath } from "url";
import { join, dirname, extname } from "path";
import uniqid from "uniqid";
// import { uploadFileToBlogPosts, parseFile } from "../utils/upload/index.js";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { blogPostValidation } from "./validation.js";
//for uploading files to cloud services
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { getPdfReadableStream } from "../utils/upload/pdf.js";
import { pipeline } from "stream";
// import html2canvas from "html2canvas";

const { readJSON, writeJSON, writeFile } = fs;

//CONNECT PATH WITH JSON
const blogPostFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "posts.json"
);

const coverFolderPath = join(process.cwd(), "./public/img/blogPosts");

const getBlogPosts = () => readJSON(blogPostFilePath);
const writeBlogPosts = (content) => writeJSON(blogPostFilePath, content);

const blogPostRoute = Router();

///////////CLOUDINARY STORAGE UPLOAD

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blogPosts",
  },
});

//// GET ALL
blogPostRoute.get("/", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
    res.send(blogPosts);
  } catch (error) {
    next(error);
    // res.send(500).send({ message: error.message });
  }
});

//// POST
blogPostRoute.post("/", blogPostValidation, async (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      next(createHttpError(400, { errorsList }));
    } else {
      const blogPosts = await getBlogPosts();
      const newBlogPost = { ...req.body, _id: uniqid(), createdAt: new Date() };
      blogPosts.push(newBlogPost);
      writeBlogPosts(blogPosts);
      res.send(newBlogPost);
    }
  } catch (error) {
    next(error);
    // res.send(500).send({ message: error.message });
  }
});

//// GET ID
blogPostRoute.get("/:id", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
    const blogPost = blogPosts.find((Post) => Post._id === req.params.id);
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(console.log(`blogPosts/${req.params.id} not found`));
      // next(createHttpError(404, `blogPosts/${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

//// PUT
blogPostRoute.put("/:id", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
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
blogPostRoute.delete("/:id", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
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
  multer().single("blogPostCover"),
  async (req, res, next) => {
    try {
      const { originalname, buffer } = req.file;
      const extension = extname(originalname);
      const fileName = `${req.params.id}${extension}`;
      // console.log(publicFolderPath);
      const pathToFile = join(coverFolderPath, fileName);
      // const pathToFile = join(publicFolderPath, fileName);
      await fs.writeFile(pathToFile, buffer);

      const blogPosts = await getBlogPosts();
      const index = blogPosts.findIndex((Post) => Post._id === req.params.id);
      let postToBeAltered = blogPosts[index];

      const link = `https://striveblogbt.herokuapp.com/img/blogPosts/${fileName}`;
      req.file = link;
      const newCover = { cover: req.file };
      const updatedPost = { ...postToBeAltered, ...newCover };

      blogPosts[index] = updatedPost;
      await writeBlogPosts(blogPosts);
      res.send(updatedPost);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

blogPostRoute.post(
  "/:id/cloudinaryUpload",
  multer({ storage: cloudinaryStorage }).single("blogPostCover"),
  async (req, res, next) => {
    try {
      // const { originalname, buffer } = req.file;
      // const extension = extname(originalname);
      // const fileName = `${req.params.id}${extension}`;
      // // console.log(publicFolderPath);
      // const pathToFile = join(coverFolderPath, fileName);
      // // const pathToFile = join(publicFolderPath, fileName);
      // await fs.writeFile(pathToFile, buffer);

      // const blogPosts = await getBlogPosts();
      // const index = blogPosts.findIndex((Post) => Post._id === req.params.id);
      // let postToBeAltered = blogPosts[index];

      // const link = `https://striveblogbt.herokuapp.com/img/blogPosts/${fileName}`;
      // req.file = link;
      // const newCover = { cover: req.file };
      // const updatedPost = { ...postToBeAltered, ...newCover };

      // blogPosts[index] = updatedPost;
      // await writeBlogPosts(blogPosts);
      res.send(updatedPost);
    } catch (error) {
      next(error);
    }
  }
);

blogPostRoute.get("/:id/PDFDownload", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
    const blogPost = blogPosts.find((Post) => Post._id === req.params.id);
    if (blogPost) {
      res.setHeader("Content-Disposition", "attachment; filename=example.pdf");

      const source = getPdfReadableStream(blogPost);
      const destination = res;
      // const transform = html2canvas();

      pipeline(source, destination, (err) => {
        if (err) next(err);
      });
    } else {
      next(createHttpError(404, `blogPosts/${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// GETTING COMMENTS
blogPostRoute.get("/:id/comments", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
    const blogPost = blogPosts.find((Post) => Post._id === req.params.id);
    if (blogPost) {
      blogPost.comments = blogPost.comments || [];
      res.send(blogPost.comments);
    } else {
      next(createHttpError(404, `blogPosts/${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

// POSTING COMMENTS
blogPostRoute.put("/:id/comments", async (req, res, next) => {
  try {
    const blogPosts = await getBlogPosts();
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
