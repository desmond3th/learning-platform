import { Router } from "express";
import { createInstructor } from "../controllers/instructor.controller.js";

const router = Router()

router.route("/create").post(createInstructor)

export default router;