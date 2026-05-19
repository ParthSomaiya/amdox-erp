import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";
import path from "path";

import {
  CloudinaryStorage,
}
  from "multer-storage-cloudinary";

import cloudinary
  from "../config/cloudinary.js";

// Storage config
const storage =
  new CloudinaryStorage({

    cloudinary,

    params: async (
      req,
      file
    ) => ({

      folder:
        "amdox-erp",

      resource_type:
        "auto",

    }),

  });


// File filter (ONLY PDF)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (req, file, cb) => {
      const fileName = Date.now() + "-" + file.originalname;
      cb(null, fileName);
    },
  }),

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF allowed"), false);
    }
  },
});

export default upload;