import express, { text } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

// import nodemailer from "nodemailer";
// import Mailgen from "mailgen";



const router = express.Router();

router.get("/", async (req, res) => {

    //COOKIE
 
    res.cookie("name","polladhikary",{
        maxAge: 900000, // 15 minutes
        httpOnly: false, // accessible via JavaScript
        secure: true, // set to true if using HTTPS
        sameSite:"none"
    }).json({message:"namcookie set maybe"});

    // let config = {
    //     service: "gmail",
    //     auth: {
    //         user: "poladhikari@gmail.com",
    //         pass: "oelbzvlvziocqfts"
    //     }
    // }
    // let transporter = nodemailer.createTransport(config);

    // let mailGen = new Mailgen({
    //     theme: "default",
    //     product: {
    //         name: "Mailgen",
    //         link:"https://mailgen.js/"
    //     }
    // })

//     const response = {
//     body: {
//       name: "userName",
//       intro: 'Welcome to our community! We are excited to have you on board.',
//       action: {
//         instructions: 'To get started with our service, please click the button below:',
//         button: {
//           color: '#22BC66',
//           text: 'Confirm your email',
//           link: 'Your confirmation link'
//         }
//       },
//       outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
//     }
//   };


    // let mail = mailGen.generate(response)


    // let message = {
    //     from: "poladhikari@gmail.com",
    //     to: "aimlpolladhikary@gmail.com",
    //     subject: "place Order",
    //     html:mail
    // }
    // transporter.sendMail(message).then(() => {
    //     res.status(200).json({ message: "Email sent successfully" });
    // }).catch(error => {
    //     return res.status(500).json({error})
    // })
    
    // res.send("Test Success");
})

router.route("/register").post(registerUser)
// router.post("/register",registerUser)
// 

router.route("/login").post(loginUser);
router.route("/logout").delete(verifyJWT, logoutUser)
router.route("/changepassword").post(verifyJWT, changeCurrentPassword)
router.route("/updateDetail").patch(verifyJWT, updateAccountDetails)
router.route("/profile").get(verifyJWT, getCurrentUser)
router.route("/avatar").post(verifyJWT, upload.single("avatar"), updateUserAvatar)


export default router