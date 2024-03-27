import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const addCommentToLearner = asyncHandler(async (req, res) => {
    const { learnerId } = req.params;
    const { content } = req.body;

    const learner = await prisma.learner.findUnique({
        where: {
            id: learnerId
        }
    });

    if (!learner) {
        throw new ApiError(404, "Learner not found");
    }

    const newComment = await prisma.comment.create({
        data: {
            content: content,
            learner: {
                connect: { id: learnerId }
            }
        }
    });

    return res.status(200)
    .json(
        new ApiResponse(200, newComment, "Comment added successfully")
    );
});


const getCommentsForLearner = asyncHandler(async (req, res) => {
    const { learnerId } = req.params;

    const learner = await prisma.learner.findUnique({
        where: {
            id: learnerId
        }
    });

    if (!learner) {
        throw new ApiError(404, "Learner not found");
    }

    const comments = await prisma.comment.findMany({
        where: {
            learnerId: learnerId
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


export {addCommentToLearner,
    getCommentsForLearner}