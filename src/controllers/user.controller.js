import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();


const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    const fields = [fullname, email, username, password];
    for (const field of fields) {
        if (!field || !field.trim()) {
            throw new ApiError(400, "Empty fields are not acceptable");
        }
    }

    const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
    const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
    
    if (existingUserByEmail || existingUserByUsername) {
        throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = await prisma.user.create({
        data: {
            fullname,
            username: username.toLowerCase(),
            password: hashedPassword,
            email
        }
    });

    const user = await prisma.user.findUnique({
        where: { id: newUser.id },
        select: { id: true, fullname: true, email: true }
    });

    if (!user) {
        throw new ApiError(500, "Couldn't register the user");
    }

    return res.status(201)
    .json(
        new ApiResponse(200, user, "User successfully registered!")
        );
});


const generateAccessToken = (userId) => {
    return jwt.sign(
        {
            userId: userId
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

const  generateRefreshToken = (userId) => {
    return jwt.sign(
        {
            userId: userId
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

const loginUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "One of the fields is required");
    }

    const user = await prisma.user.findUnique({
        where: {
            OR: [
                { username: username.toLowerCase() },
                { email: email.toLowerCase() }
            ]
        }
    });

    if (!user) {
        throw new ApiError(402, "User doesn't exist");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        throw new ApiError(403, "Password Incorrect");
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const options = {
        httpOnly: true,
        secure: true
    };

    const checkForUser = await prisma.user.findUnique({
        where: { id: newUser.id },
        select: { id: true, fullname: true, email: true }
    });
    
    const responseData = {
        checkForUser,
        accessToken,
        refreshToken
    };

    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { responseData }, "User logged in successfully")
            );
});


const logoutUser = asyncHandler(async (req, res) => {
    
    await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null }
    });

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});


const generateAccessAndRefreshTokens = async (userId) => {

    try{
        const user = await prisma.user.findUnique({
            where: {userId: userId}
        })
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken

        await user.save( {validateBeforeSave : false} )

        return {accessToken, refreshToken}

    } catch(err){
        throw new ApiError(500, "Couldn't generate Acesss or Refresh token")
    }
}


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(402, "Invalid request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken.userId
            }
        });

        if (!user) {
            throw new ApiError(401, "Refresh Token Invalid");
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Expired refresh token or used token");
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user.id);

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200,
                {
                    accessToken,
                    newRefreshToken
                },
                "Access token refreshed successfully"
            ));

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});


const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            id: req.user?.id
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);

    if (!validPassword) {
        throw new ApiError(400, "Old password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 8);
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hashedNewPassword
        }
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.user?.id
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    );
});


export { registerUser, 
        loginUser,
        logoutUser,
        refreshAccessToken,
        changePassword,
        getCurrentUser }