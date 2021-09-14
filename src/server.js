import express from "express";
import cors from "cors";
import blogAuthorRoute from "./blogAuthors/index.js";

const server = express();
const port = 3001;

server.use(cors());
server.use(express.json());
server.use("/authors", blogAuthorRoute);

// console.table(listEndpoints);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on("error", (error) => {
  console.log(`Sorry there was an error ${error.message}`);
});
