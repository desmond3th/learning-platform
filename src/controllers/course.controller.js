import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const createCourse = asyncHandler(async (req, res) => {
    const { name, maxSeats, instructorId } = req.body;

    if (!instructorId || !name || !maxSeats) {
        throw new ApiError(400, "All the fields are required");
    }

    try {
        const course = await prisma.course.create({
            data: {
                name: name,
                maxSeats: maxSeats,
                startDate: new Date().toISOString(),
                instructorId: instructorId,
            }
        });
        
        return res.status(200)
            .json(
                new ApiResponse(200, course, "Course created successfully")
            );

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Error while creating course")
    }
});


const updateCourse = asyncHandler(async(req, res) => {
    const {courseId} = req.params;
    const {name, maxSeats, startDate } = req.body;

    if (!courseId) {
        throw new ApiError(400, "Course ID is required");
    }

    if (!name && !maxSeats && !startDate) {
        throw new ApiError(400, "At least one field must be provided for update");
    }

    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    });

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    const updateData = {};

    if (name) {
        updateData.name = name;
    }
    if (maxSeats) {
        updateData.maxSeats = maxSeats;
    }
    if(startDate) {
        updateData.startDate = startDate;
    }

    const updatedCourse = await prisma.course.update({
        where: {
            id: courseId
        },
        data: updateData
    });


    return res.status(200)
    .json(
        new ApiResponse(200, updatedCourse, "Course created successfully")
    );
});


const getCoursesForInstructor = asyncHandler(async (req, res) => {
    const { instructorId } = req.params;

    const courses = await prisma.course.findMany({
        where: {
            instructorId: instructorId
        },
        select: {
            id: true,
            name: true,
            maxSeats: true,
            startDate: true
        }
    });

    return res.status(200)
    .json(
        new ApiResponse(200, courses, "Courses retrieved successfully")
    );
});


export { createCourse,
        updateCourse,
        getCoursesForInstructor }