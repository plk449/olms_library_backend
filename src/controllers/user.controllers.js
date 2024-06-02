import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendRegistrationEmail } from "../utils/registrationMail.js"

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, userName, email, password, phoneNumber } = req.body;


    // Validate input data
    if (!fullName || !userName || !email || !password || !phoneNumber) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // console.log('Received registration request:', req.body);


    let existingUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (existingUser) {
        return res.status(409).json({ message: "User already has an account." });
    }


    let registerData = await User.create({
        email,
        fullName,
        userName,
        password,
        phoneNumber
    });

    const createdUser = await User.findById(registerData._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    sendRegistrationEmail(email, fullName);

    return res.status(201).json(createdUser);
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, userName, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Username or email is required");
    }

    let user = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const cookieOptions = {

        httpOnly: false, // accessible via JavaScript
        secure: true,
        sameSite: "none"// set to true if using HTTPS
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions); // Example: refresh token not httpOnly

    return res.status(200).json({
        status: 200,
        data: {
            user: loggedInUser,
            accessToken,
            refreshToken
        },
        message: "User logged in successfully"
    });
});

const logoutUser = asyncHandler(async (req, res) => {

    // console.log("I am in userControler.");


    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: false,
        secure: true,
        sameSite: "none"
    }
    // const cookieOptions = {

    //     httpOnly: false, // accessible via JavaScript
    //     secure: true,
    //    // set to true if using HTTPS
    // };
    // console.log("logout");
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email, phoneNumber } = req.body

    if (!fullName && !email && !phoneNumber) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email,
                phoneNumber
            }
        },
        { new: true }

    ).select("-password")
    // console.log(user);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const getCurrentUser = asyncHandler(async (req, res) => {

    const user = req.user;
    // Add the full URL of the avatar
    // const userWithAvatarUrl = {
    //     ...user.toObject(),
    //     avatar: user.avatar ? `${req.protocol}://${req.get('host')}/public/temp/${user.avatar}` : null,
    // };
    res.status(200).json(new ApiResponse(200, user, 'User profile retrieved successfully'));


    // return res
    //     .status(200)
    //     .json(new ApiResponse(
    //         200,
    //         req.user,
    //         "User fetched successfully"
    // ))
})

// Upload avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
    // console.log("poll");
    if (!req.file) {
        throw new ApiError(400, 'No file uploaded');
    }
    if (!req.user?._id) {
        throw new ApiError(404, 'User not found');
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: req.file.filename
            }
        },
        { new: true }
    );

    // Add the full URL of the avatar
    //  const userWithAvatarUrl = {
    //     ...user.toObject(),
    //     avatar: user.avatar ? `${req.protocol}://${req.get('host')}/public/temp${user.avatar}` : null,
    // };
    // res.status(200).json(new ApiResponse(200, userWithAvatarUrl, 'User profile retrieved successfully'));


    res.status(200).json(new ApiResponse(200, user, 'Avatar uploaded successfully'));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    updateAccountDetails,
    getCurrentUser,
    updateUserAvatar
    // getUserChannelProfile,
};
