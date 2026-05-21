import multer from "multer";
import path from "path";


// ==============================
// 📁 STORAGE
// ==============================

const storage =
  multer.diskStorage({

    destination:
      (req, file, cb) => {

        cb(
          null,
          "uploads/"
        );

      },

    filename:
      (req, file, cb) => {

        cb(

          null,

          Date.now() +
          "-" +
          file.originalname

        );

      },

  });


// ==============================
// 📄 FILE FILTER
// ==============================

const fileFilter =
  (req, file, cb) => {

    const allowed =
      [
        "image/png",
        "image/jpeg",
        "application/pdf",
      ];

    if (
      allowed.includes(
        file.mimetype
      )
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Invalid file type"
        ),
        false
      );

    }

  };


// ==============================
// 🚀 MULTER
// ==============================

const upload =
  multer({

    storage,

    fileFilter,

    limits: {
      fileSize:
        5 * 1024 * 1024,
    },

  });

export default upload;