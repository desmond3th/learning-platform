import { Router } from "express";
import { registerForCourse, getAllLearnersForCourse, getLearnerDetails, updateLearnerStatus } from "../controllers/learner.controller.js";

const router = new Router();

router.route("/register/:courseId").post(registerForCourse);
router.route("/update/:learnerId").patch(updateLearnerStatus);
router.route("/learner-details").get(getLearnerDetails);
router.route("/learners-of-course/:courseId").get(getAllLearnersForCourse)

export default router;