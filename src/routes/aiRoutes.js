import express from "express";
import { analyzeResumeForJob } from "../controllers/aiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected — students can request analysis on their resumes vs job
router.post("/analyze", authMiddleware(["STUDENT", "COMPANY", "COLLEGE"]), analyzeResumeForJob);

export default router;
