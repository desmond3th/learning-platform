import {Router} from "express"
import { changePassword, getCurrentUser, 
        loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";

const router = new Router();

router.route("/register").post(registerUser)
ute.route("/login").post( loginUser)

router.route("/logout").post(logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(changePassword)
router.route("/current-user").get(getCurrentUser)