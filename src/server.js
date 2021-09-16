import express from "express";
import cors from "cors";
import blogPostRoute from "./posts/index.js";
import blogAuthorRoute from "./authors/index.js";
import filesRouter from "./files/index.js";
//DAY 4 Hw
// import uploadAvatarRoute from "";
// import uploadCoverRoute from "";

import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  genericServerErrorHandler,
} from "./errorhandlers.js";

const server = express();
const port = 3001;

// Place for our globalmiddlewares

server.use(cors());
server.use(express.json());

// Place for our routes
server.use("/blogPosts", blogPostRoute);
server.use("/authors", blogAuthorRoute);
server.use("/authors", filesRouter);

//DAY 4 Hw
// ("/authors/:id/uploadAvatar", uploadAvatarRoute);
// ("/blogPosts/:id/uploadCover", uploadCoverRoute);
// ("/blogPosts/:id/comments", commentsRoute);
// ("/blogPosts/:id/uploadCover", uploadCoverRoute);

// Place for our error middleware

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(forbiddenErrorHandler);
server.use(genericServerErrorHandler);

// Place for console logging port location
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
server.on("error", (error) => {
  console.log(`Sorry there was an error ${error.message}`);
});
