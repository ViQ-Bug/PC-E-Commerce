import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `$Date.now()-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowTypes = /jpeg|jpg|png|webp/;
  const extname = allowTypes.test(
    path.extname(file.originalname).toLocaleLowerCase(),
  );
  const mimeType = allowTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Images only! (jpeg, jpg, png, webp)"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
