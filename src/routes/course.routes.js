import { Router } from "express";
import { createCourse, getCoursesForInstructor, searchCourses, updateCourse } from "../controllers/course.controller.js";

const router = new Router();

router.route("/create").post(createCourse);
router.route("/update/:courseId").patch(updateCourse);
router.route("/get-courses/:instructorId").get(getCoursesForInstructor);
router.route("/search").get(searchCourses)

export default router;