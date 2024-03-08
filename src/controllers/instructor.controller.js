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

export {createInstructor}