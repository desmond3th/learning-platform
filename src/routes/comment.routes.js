import { Router } from "express";
import { addCommentToLearner, getCommentsForLearner } from "../controllers/comment.controller.js";

const router = new Router();

router.route("/add/:learnerId").post(addCommentToLearner);
router.route("/get-comments/:learnerId").get(getCommentsForLearner);

export default router;