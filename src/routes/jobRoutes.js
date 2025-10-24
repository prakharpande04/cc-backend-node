import express from "express";
import { createJob, listJobs, getJob } from "../controllers/jobController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", listJobs);
router.get("/:jobId", getJob);

// Protected (companies & colleges can create jobs)
router.post("/", authMiddleware(["COMPANY", "COLLEGE"]), createJob);

export default router;
