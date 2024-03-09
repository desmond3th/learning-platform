import { Router } from "express";
import { registerForCourse } from "../controllers/lead.controller.js";

const router = new Router();

router.route("/register/:courseId").post(registerForCourse);

export default router;