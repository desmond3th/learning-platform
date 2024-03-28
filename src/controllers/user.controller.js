import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';


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


export { registerUser, }