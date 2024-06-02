import multer from "multer";
import path from 'path';

// to upload in localStorage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp")
//   },
//   filename: function (req, file, cb) {

//     cb(null, `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
//   }
// })


// to upload in db
// const storage = multer.memoryStorage();
const storage = multer.diskStorage({});



export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 3 }, // Limit file size to 5MB
})