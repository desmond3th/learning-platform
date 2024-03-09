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


const getInstructorDetails = asyncHandler(async(req, res) => {
    const {email} = req.params;

    const instructor = await prisma.instructor.findUnique({
        where: {
            email: email
        }
    });

    if(!instructor) {
        throw new ApiError(400, "Instructor not found");
    }

    return res.status(200)
    .json(
        new ApiResponse(200, instructor, "Instructor details fetched successfully")
    );
});


const getInstructorCourses = asyncHandler(async(req, res) => {
    const { instructorId } = req.params;

    try {
        const courses = await prisma.course.findMany({
            where: {
                instructorId: instructorId
            }
        });

        res.status(200)
        .json(
            new ApiResponse(200, courses, "Instructor courses fetched successfully")
        );

    } catch (error) {
        throw new ApiError(500, "Error fetching instructor courses")
    }
});


export { createInstructor,
        getInstructorCourses,
        getInstructorDetails} 