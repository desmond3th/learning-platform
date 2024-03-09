import { Router } from "express";
import { addCommentToLead, getCommentsForLead } from "../controllers/comment.controller.js";

const router = new Router();

router.route("/add/:leadId").post(addCommentToLead);
router.route("/get-comments/:leadId").get(getCommentsForLead);

export default router;