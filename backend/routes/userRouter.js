import express from "express";


import { RegisterUser, LoginUser, LogoutUser, GetUser, UpdateUserProfile, UpdateUserPassword } from "../controllers/userController.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multerConfig.js"


const router = express.Router();

router.route("/register").post(upload.single("resume"), RegisterUser);
router.route("/login").post(LoginUser);
router.route("/logout").get(isAuthenticated, LogoutUser);
router.route("/getuser").get(isAuthenticated, GetUser);
router.route("/update/profile").put(isAuthenticated, upload.single("resume"), UpdateUserProfile);
router.route("/update/password").put(isAuthenticated, UpdateUserPassword);


export default router;
