import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const registerForCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { name, email, phoneNumber, linkedInProfile } = req.body;

    if (!name || !email) {
        throw new ApiError(400, "Name and email are required for course registration");
    }

    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    });

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    const learner = await prisma.learner.create({
        data: {
            name: name,
            email: email,
            phoneNumber: phoneNumber || null,
            linkedInProfile: linkedInProfile || null,
            status: 'WAITLIST',
            courses: {
                connect: {
                    id: courseId
                }
            }
        }
    });

    return res.status(200)
    .json(
        new ApiResponse(200, learner, "User registered for the course successfully")
    );
});


const updateLearnerStatus = asyncHandler(async (req, res) => {
    const { learnerId } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const learner = await prisma.learner.findUnique({
        where: {
            id: learnerId
        }
    });

    if (!learner) {
        throw new ApiError(404, "Learner not found");
    }

    const updatedLearner = await prisma.learner.update({
        where: {
            id: learnerId
        },
        data: {
            status: status.toUpperCase()
        }
    });

    return res.status(200)
    .json(
        new ApiResponse(200, updatedLearner, "Learner status updated successfully")
    );
});


const getLearnerDetails = asyncHandler(async (req, res) => {
    const { name, email } = req.query;

    if(!name && !email) {
        throw new ApiError(400, "One of the field is required")
    }

    const searchConditions = {};
    if (name) {
        searchConditions.name = { contains: name };
    }
    if (email) {
        searchConditions.email = { contains: email };
    }

    const learners = await prisma.learner.findMany({
        where: searchConditions,
        select: {
            id : true,
            name: true,
            email: true,
            phoneNumber: true,
            linkedInProfile: true,
            courses: true,
            comments: true
        }
    });

    return res.status(200).
    json(
        new ApiResponse(200, learners, "Learners retrieved successfully")
    );
});


const getAllLearnersForCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const learners = await prisma.learner.findMany({
        where: {
            courses: {
                some: {
                    id: courseId
                }
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            linkedInProfile: true,
            status: true,
            comments: true 
        }
    });

    return res.status(200)
    .json(
        new ApiResponse(200, learners, "Learner retrieved successfully")
    );
});


export {registerForCourse,
        updateLearnerStatus,
        getLearnerDetails,
        getAllLearnersForCourse }