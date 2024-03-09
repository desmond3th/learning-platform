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

    const lead = await prisma.lead.create({
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
        new ApiResponse(200, lead, "User registered for the course successfully")
    );
});


export {registerForCourse,}