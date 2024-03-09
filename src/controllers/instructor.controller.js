import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const createInstructor = asyncHandler(async(req, res) => {
    const {name, email} = req.body;

    if(!name || !email) {
        throw new ApiError(400, "Name and email must be provided")
    }

    const existingInstructor = await prisma.instructor.findUnique({
        where: {
            email: email
        }
    });

    if (existingInstructor) {
        throw new ApiError(409, "Instructor with the same email already exists");
    }

    const instructor = await prisma.instructor.create({
        data: {
            name : name,
            email : email
        }
    });

    return res.status(200)
    .json(
        new ApiResponse(200, instructor, "Instructor created successfully")
    );

});

export { createInstructor, }