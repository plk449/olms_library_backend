import express, { Router } from "express";
import {
    getAllBooks,
    createBook,
    getBooksByGenre,
    searchBooks,
    borrowBook,
    returnBook,
    getTransactionHistoryByUser,
    getOneBook
} from "../controllers/book.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = express.Router();

router.get("/p", (req, res) => {
    res.send("Test Books Routes ");
});

router.route("/").get(getAllBooks);
router.route("/addbook").post(verifyJWT, upload.single("coverImage"), createBook);
router.route("/Searchbygenre").post(getBooksByGenre);
router.route("/Search").post(searchBooks);
router.route("/borrow").post(verifyJWT, borrowBook);
router.route("/return").post(verifyJWT, returnBook);
router.route("/history").get(verifyJWT, getTransactionHistoryByUser);
router.route("/getOneBook").post(getOneBook);


export default router