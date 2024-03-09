import { Router } from "express";
import { createInstructor, getInstructorCourses, getInstructorDetails, } from "../controllers/instructor.controller.js";

const router = Router()

router.route("/create").post(createInstructor);
router.route("/get-details/:email").get(getInstructorDetails);
router.route("/get-course/:instructorId").get(getInstructorCourses);


export default router;