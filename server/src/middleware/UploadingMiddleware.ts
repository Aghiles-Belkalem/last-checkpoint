import path from "node:path";
import type { Request } from "express";
import multer from "multer";

export interface MulterRequest extends Request {
  fileValidationError?: string;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, "../../public/assets/images");
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req: MulterRequest, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      req.fileValidationError = "Only image files are allowed!";
      cb(null, false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
