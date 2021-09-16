import { join, extname } from "path";
import multer from "multer";
import { fstat } from "fs";

const publicFolderPath = join(process.cwd(), "./public/img/authors");

export const parseFile = multer();

export const uploadFile = (req, res, next) => {
  try {
    const { originalname, buffer } = req.file;
    const extension = extname(originalname);
    const fileName = `${req.params.id}${extension}`;
    const pathToFile = path.join(publicFolderPath, fileName);
    fs.writeFileSync(pathToFile, buffer);
    const link = `http://localhost:3001/${fileName}`;
    req.file = link;
    next();
    // console.log(req.file);
    // console.log(publicFolderPath);
    // res.send("OK");
  } catch (error) {
    next(error);
  }
};
