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


const updateLeadStatus = asyncHandler(async (req, res) => {
    const { leadId } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const lead = await prisma.lead.findUnique({
        where: {
            id: leadId
        }
    });

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    const updatedLead = await prisma.lead.update({
        where: {
            id: leadId
        },
        data: {
            status: status.toUpperCase()
        }
    });

    return res.status(200)
    .json(
        new ApiResponse(200, updatedLead, "Lead status updated successfully")
    );
});


const getLeadDetails = asyncHandler(async (req, res) => {
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

    const leads = await prisma.lead.findMany({
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
        new ApiResponse(200, leads, "Leads retrieved successfully")
    );
});


const getAllLeadsForCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const leads = await prisma.lead.findMany({
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
        new ApiResponse(200, leads, "Leads retrieved successfully")
    );
});


export {registerForCourse,
        updateLeadStatus,
        getLeadDetails,
        getAllLeadsForCourse }