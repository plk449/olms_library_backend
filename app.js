import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import session from 'express-session';

const app = express();
// process.env.CORS_ORIGIN ||

app.use(cors({
    // origin: "http://192.168.29.216:5500",
    
    // Allow this origin
    origin:"https://library-frontend-smoky.vercel.app/"
    methods: "GET,POST,PATCH,DELETE",
    credentials: true // Allow cookies and credentials
}));

app.use(cookieParser())

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))


// Middleware to log headers for debugging
// app.use((req, res, next) => {
//     console.log('Headers:', req.headers);
//     console.log('Cookies:', req.cookies);

//     next();
// });


// import route 
import userRouter from "./routes/user.routes.js";
import bookRouter from "./routes/book.routes.js";
import cartRouter from "./routes/cart.routes.js"
import likeRouter from "./routes/like.routes.js"
import reviewRouter from "./routes/review.routes.js"

//routes declaration user
app.use("/api/v1/users", userRouter);

//routes declaration book
app.use("/api/v1/books", bookRouter);

//routes declaration cart
app.use("/api/v1/cart", cartRouter);

//routes declaration like
app.use("/api/v1/like", likeRouter);
3
//routes declaration like
app.use("/api/v1/review", reviewRouter);




export default app;
