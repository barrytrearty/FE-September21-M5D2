// BLOG POSTS
// 1. CREATE ==> POST
// 2. READ ==> GET
// 3. READ ==> GET
// 4. UPDATE ==> PUT
// 5. DELETE ==> DELETE

//IMPORTS
import { Router } from "express";
import fs from "fs";
import { join } from "path";
import uniqid from "uniqid";

//ROUTER CONST
const blogAuthorRoute = Router();

//CONNECT PATH WITH JSON
const cwd = process.cwd();
const blogAuthorFilePath = join(cwd, "src/blogAuthors/authors.json");

blogAuthorRoute.get("/", (req, res) => {
  const blogAuthorContent = fs.readFileSync(blogAuthorFilePath);
  const blogAuthorArray = JSON.parse(blogAuthorContent);
  res.send(blogAuthorArray);
});

blogAuthorRoute.post("/", (req, res) => {
  const newBlogAuthor = { ...req.body, id: uniqid() };
  const blogAuthorArray = JSON.parse(fs.readFileSync(blogAuthorFilePath));
  blogAuthorArray.push(newBlogAuthor);
  fs.writeFileSync(blogAuthorFilePath, JSON.stringify(blogAuthorArray));
  res.send(blogAuthorArray);
});

//EXPORT ROUTER CONST
export default blogAuthorRoute;
