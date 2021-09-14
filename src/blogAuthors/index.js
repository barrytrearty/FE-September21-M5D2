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

//CONNECT PATH WITH JSON
const cwd = process.cwd();
console.log("cwd= " + cwd);
const blogAuthorFilePath = join(cwd, "/src/blogAuthors/authors.json");

//ROUTER CONST
const blogAuthorRoute = Router();

blogAuthorRoute.get("/", (req, res) => {
  const blogAuthorContent = fs.readFileSync(blogAuthorFilePath);
  const blogAuthorArray = JSON.parse(blogAuthorContent);
  res.send(blogAuthorArray);
});

blogAuthorRoute.post("/", (req, res) => {
  const blogAuthorContent = fs.readFileSync(blogAuthorFilePath);
  console.log("Content:" + blogAuthorContent);
  const blogAuthorArray = JSON.parse(blogAuthorContent.toString());
  console.log("Array:" + blogAuthorArray);

  // const newBlogAuthor = { ...req.body, id: uniqid() };
  // console.log(newBlogAuthor);

  // blogAuthorArray.push(newBlogAuthor);

  fs.writeFileSync(
    blogAuthorFilePath,
    JSON.stringify([...blogAuthorArray, { id: uniqid(), ...req.body }])
  );
  // res.send(blogAuthorArray);

  res.status(201).send(blogAuthorArray);
});

blogAuthorRoute.post("/:id", (req, res) => {
  const blogAuthorContent = fs.readFileSync(blogAuthorFilePath);
  const blogAuthorArray = JSON.parse(blogAuthorContent.toString());

  const blogAuthor = blogAuthorArray.find(
    (author) => author.id === req.params.id
  );
  if (author) {
    res.send(author);
  }
});

//EXPORT ROUTER CONST
export default blogAuthorRoute;
