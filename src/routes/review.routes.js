import express, { Router } from "express";

import {addReview,
    getReviewsByBook
} from "../controllers/review.controller.js"
    
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/R", (req, res) => {
    res.send("Test cart Routes ");
});


router.route("/review").post(verifyJWT, addReview);
router.route("/allreview").post(getReviewsByBook);




export default router