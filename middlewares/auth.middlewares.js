import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import User from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // console.log("Token-->", token);

        if (!token) {
            console.log("Access token missing");
            throw new ApiError(401, "Access token missing");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        // console.log("User found:", user);

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
