import express, { Router } from "express";

import {addToCart,
    getCart,
    removeFromCart
} from "../controllers/cart.controllers.js"
    
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/c", (req, res) => {
    res.send("Test cart Routes ");
});

router.route("/addcart").post(verifyJWT,addToCart);
router.route("/getcart").get(verifyJWT,getCart);
router.route("/removecart").post(verifyJWT,removeFromCart);



export default router