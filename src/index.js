import dotenv from "dotenv";
import app from "./appk.js";
import connectDB from "./db/databaseConnection.js";

dotenv.config({
    // path: './.env'
})
console.log(process.env.PORT);

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
}).catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
