import { Router } from "express";
import { registerForCourse, getLeadDetails, updateLeadStatus, getAllLeadsForCourse } from "../controllers/lead.controller.js";

const router = new Router();

router.route("/register/:courseId").post(registerForCourse);
router.route("/update/:leadId").patch(updateLeadStatus);
router.route("/lead-details").get(getLeadDetails);
router.route("/leads-of-course/:courseId").get(getAllLeadsForCourse)

export default router;