import express from "express";
import cors from "cors";
import blogPostRoute from "./posts/index.js";
import blogAuthorRoute from "./authors/index.js";
import { join } from "path";
import listEndpoints from "express-list-endpoints";

import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  genericServerErrorHandler,
} from "./errorhandlers.js";

const server = express();
const port = process.env.PORT || 3001;
// const port = 3001;

const publicFilePath = join(process.cwd(), "public");

// Place for our globalmiddlewares

//CORS: Cross-Origin Resource Sharing

const whiteList = [process.env.FRONT_DEV_URL, process.env.FRONT_PROD_URL];

const corsOptions = {
  origin: function (origin, next) {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whiteList.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error(`Origin ${origin} not allowed!`));
    }
  },
};

server.use(express.static(publicFilePath));
server.use(cors(corsOptions));
server.use(express.json());

// Place for our routes
server.use("/blogPosts", blogPostRoute);
server.use("/authors", blogAuthorRoute);

// Place for our error middleware

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(forbiddenErrorHandler);
server.use(genericServerErrorHandler);

console.table(listEndpoints(server));

// Place for console logging port location
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
server.on("error", (error) => {
  console.log(`Sorry there was an error ${error.message}`);
});
