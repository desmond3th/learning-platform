import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const addCommentToLead = asyncHandler(async (req, res) => {
    const { leadId } = req.params;
    const { content } = req.body;

    const lead = await prisma.lead.findUnique({
        where: {
            id: leadId
        }
    });

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    const newComment = await prisma.comment.create({
        data: {
            content: content,
            lead: {
                connect: { id: leadId }
            }
        }
    });

    return res.status(200)
    .json(
        new ApiResponse(200, newComment, "Comment added successfully")
    );
});


const getCommentsForLead = asyncHandler(async (req, res) => {
    const { leadId } = req.params;

    const lead = await prisma.lead.findUnique({
        where: {
            id: leadId
        }
    });

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    const comments = await prisma.comment.findMany({
        where: {
            leadId: leadId
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return res.status(200)
    .json(
        new ApiResponse(200, comments, "Comments retrieved successfully")
    );
});


export {addCommentToLead,
    getCommentsForLead}