import express from "express";
const router = express.Router();
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAuthorized from "../middlewares/isAuthorized.js";
import upload from "../utils/multerConfig.js";


import { postApplication, employerGetAllApplication, jobSeekerGetAllApplication, deleteApplication, alreadyApplied } from "../controllers/applicationController.js";


router.route("/post/:jobId").post(isAuthenticated, isAuthorized("Job Seeker"), upload.single("resume"), postApplication);

router.route("/employer/getAll").get(isAuthenticated, isAuthorized("Employer"), employerGetAllApplication);

router.route("/jobSeeker/getAll").get(isAuthenticated, isAuthorized("Job Seeker"), jobSeekerGetAllApplication);

router.route("/delete/:id").delete(isAuthenticated, deleteApplication);

router.route("/applied/:jobId").get(isAuthenticated, isAuthorized("Job Seeker"), alreadyApplied);

export default router;
